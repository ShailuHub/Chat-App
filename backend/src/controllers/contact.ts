import { Request, Response } from "express";
import path from "path";
import { absolutePath } from "../utils/path";
import { User, Contact, Conversation } from "../models/index";
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

export { getAddContactPage, createNewContact, deleteContact };
