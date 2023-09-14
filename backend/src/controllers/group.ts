import { Request, Response } from "express";
import { GroupChat, Member, Conversation, User } from "../models/index";

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
  console.log(groupName);
  try {
    // Find the group associated with the adminId
    const isGroup = await GroupChat.findOne({
      where: { adminId: userId, groupName },
    });
    console.log(isGroup);

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
    console.log(error);
  }
};

export { postGroup, postMember, getGroup };
