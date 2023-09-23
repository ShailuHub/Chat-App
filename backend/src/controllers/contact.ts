import { Request, Response } from "express";
import path from "path";
import { absolutePath } from "../utils/path";
import { User, Contact, Conversation, Member } from "../models/index";
import Sequelize from "sequelize";

// Function to get the Add Contact page
const getAddContactPage = (req: Request, res: Response) => {
  const filePath: string = path.join(
    __dirname,
    absolutePath,
    "html",
    "contact.html"
  );
  res.status(200).sendFile(path.join(filePath));
};

// Function to create a new contact
const createNewContact = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  let { phone, username } = req.body;
  phone = phone.trim();
  username = username.trim();

  // Check if the phone number is valid (10 digits)
  if (phone.length != 10) {
    return res.status(405).send({ message: "Enter a valid ten-digit number" });
  } else {
    try {
      // Find the user associated with the provided phone number
      const user = await User.findOne({ where: { phone: phone } });

      if (user) {
        try {
          // Create a new contact
          await Contact.create({
            username: username,
            userId: userId,
            phone: phone,
            addedId: user.userId,
          });

          res.status(200).send({ message: "Contact saved" });
        } catch (error) {
          console.log(error);
        }
      } else {
        res.status(405).send({ message: "The entered contact doesn't exist" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
};

// Function to delete a contact
const deleteContact = async (req: Request, res: Response) => {
  const user1_id = req.user?.userId;
  const phone: string = req.params?.phone;
  const user2_id: number = Number(req.params?.user2_id);

  if (phone) {
    try {
      // Find the contact to delete
      const user = await Contact.findOne({
        where: { [Sequelize.Op.and]: [{ phone: phone }, { userId: user1_id }] },
      });

      if (user) {
        try {
          // Check if there is a conversation with this contact
          const isConversationExist = await Conversation.findOne({
            where: {
              [Sequelize.Op.or]: [
                {
                  user1_id: user1_id,
                  user2_id: user2_id,
                },
                {
                  user1_id: user2_id,
                  user2_id: user1_id,
                },
              ],
            },
          });

          // Uncomment the following lines to delete the conversation if it exists
          // if (isConversationExist) {
          //   await isConversationExist.destroy();
          // }
        } catch (error) {
          console.log(error);
          res.status(500).send({ message: "Internal server error" });
        }

        // Delete the contact
        await user.destroy();
        res.status(200).send({ message: "Successfully deleted" });
      } else {
        res.status(401).send({ message: "User not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
};

const getAddToContactPage = async (req: Request, res: Response) => {
  const filePath: string = path.join(
    __dirname,
    absolutePath,
    "html",
    "addToContact.html"
  );
  res.status(200).sendFile(path.join(filePath));
};

const getSearchOrAdd = async (req: Request, res: Response) => {
  const filePath: string = path.join(
    __dirname,
    absolutePath,
    "html",
    "searchAndAddContact.html"
  );
  res.status(200).sendFile(path.join(filePath));
};

const getGroupExcludedList = async (req: Request, res: Response) => {
  const groupId = Number(req.params.groupId);
  const userId = req.user?.userId;
  try {
    const contacts: any = [];

    // Find user contacts and sort by addedId
    const userContacts = await Contact.findAll({
      where: { userId: userId },
    });
    // Find group member contacts and sort by userId
    const groupMemberContacts = await Member.findAll({
      attributes: ["userId"],
      where: { groupId: groupId },
    });
    let i: number = 0;
    while (i < userContacts.length) {
      const tar = userContacts[i];
      const idx = groupMemberContacts.findIndex(
        (member) => member.userId === tar.addedId
      );
      if (idx === -1) {
        contacts.push(tar);
      }
      i++;
    }
    res.status(200).send({ contacts, userContacts, groupMemberContacts });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const deleteMember = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const deleteId: number = Number(req.params.userId);
  try {
    const member = await Member.findOne({
      where: { userId: userId },
      attributes: ["isAdmin"],
    });
    if (member) {
      try {
        const deleteMember = await Member.findOne({
          where: { userId: deleteId },
        });
        if (deleteMember) {
          deleteMember.destroy();
          res.status(200).send({ message: "Member is removed" });
        } else {
          return res.status(404).send({ message: "Member not found" });
        }
      } catch (error) {
        res.status(500).send({ message: "Internal server error" });
      }
    } else {
      return res.status(401).send({ message: "You are not an admin" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

export {
  getAddContactPage,
  createNewContact,
  deleteContact,
  getAddToContactPage,
  getSearchOrAdd,
  getGroupExcludedList,
  deleteMember,
};
