import { Request, Response } from "express";
import { GroupChat, Member, Conversation, User } from "../models/index";
import path from "path";
import { absolutePath } from "../utils/path";

// Create a new group or return an error if it already exists
const postGroup = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const groupName: string = req.params.groupName.toLowerCase();

  try {
    // Check if a group with the same adminId and groupName already exists
    const existingGroup = await GroupChat.findOne({
      where: { adminId: userId, groupName },
    });

    if (existingGroup) {
      res.status(405).send({ message: "Group already exists" });
    } else {
      // Create a new group
      await GroupChat.create({
        groupName,
        adminId: userId,
      });

      res.status(200).send({ message: "Group is created" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

// Add members to a group
const postMember = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { groupIdArray } = req.body;
  const groupName: string = req.body.groupName.toLowerCase();
  try {
    // Find the group associated with the adminId
    const isGroup = await GroupChat.findOne({
      where: { adminId: userId, groupName },
    });

    if (!isGroup) {
      res.status(404).send({ message: "Group not found" });
      return;
    }

    // Create members for the specified group
    const memberPromises = groupIdArray.map(async (id: number | string) => {
      id = Number(id);
      await Member.create({
        groupId: isGroup.groupId,
        userId: id,
      });
    });

    // Wait for all member creations to complete
    await Promise.all(memberPromises);

    // Add the admin as a member too
    await Member.create({
      groupId: isGroup.groupId,
      userId,
      isAdmin: true,
    });

    // Add the group id to the conversation table
    try {
      await Conversation.create({
        type: "group",
        groupId: isGroup.groupId,
      });
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
    res.status(200).send({ message: "Member table created" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const getGroup = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  try {
    const allGroup = await Member.findAll({
      where: { userId: userId },
      include: [
        {
          model: GroupChat,
          attributes: ["groupName"],
          include: [{ model: User, attributes: ["username"] }],
        },
      ],
    });

    res.status(200).send({ allGroup, message: "Group List sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const getGroupMember = async (req: Request, res: Response) => {
  const groupId: number = Number(req.params.groupId);
  try {
    const allMember = await Member.findAll({
      where: { groupId: groupId },
      include: [{ model: User, attributes: ["username", "phone", "isActive"] }],
    });
    res.status(200).send({ allMember, adminId: req.user?.userId });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const getGroupChatPage = async (req: Request, res: Response) => {
  const filePath: string = path.join(
    __dirname,
    absolutePath,
    "html",
    "groupChat.html"
  );
  res.status(200).sendFile(filePath);
};

const toggleAdminStatus = async (
  req: Request,
  res: Response,
  isAdmin: boolean
) => {
  const userId = Number(req.params.userId);
  const admin = req.user?.userId;

  try {
    const adminMember = await Member.findOne({ where: { userId: admin } });

    if (!adminMember || !adminMember.isAdmin) {
      return res.status(401).send({ message: "You are not an admin" });
    }

    // Find the target member by userId and update their isAdmin status
    await Member.update({ isAdmin }, { where: { userId } });

    const message = isAdmin
      ? "This contact is admin now"
      : "This contact is no longer an admin";

    // Send a success response
    res.status(200).send({ message });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const makeAdmin = async (req: Request, res: Response) => {
  toggleAdminStatus(req, res, true);
};

const removeAdmin = async (req: Request, res: Response) => {
  toggleAdminStatus(req, res, false);
};

const deleteGroup = async (req: Request, res: Response) => {};

export {
  postGroup,
  postMember,
  getGroup,
  getGroupMember,
  getGroupChatPage,
  makeAdmin,
  removeAdmin,
  deleteGroup,
};
