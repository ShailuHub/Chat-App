import { Request, Response } from "express";
import sequelize from "../utils/database";
import { User, Message, Conversation, Contact } from "../models/index";
import Sequelize, { where } from "sequelize";

// Handle POST request to create a new message
const postMessage = async (req: Request, res: Response) => {
  // Get the user ID and message from the request body
  const user1_id = req.user?.userId;
  const user2_id: number = Number(req.params.user2_id);
  const { message } = req.body;

  if (user1_id && user2_id) {
    try {
      // Check if a conversation between the two users exists
      const isConversationExists = await Conversation.findOne({
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

      // Create a new message in the database
      if (isConversationExists) {
        await Message.create({
          sendername: req.user?.username,
          message,
          senderId: user1_id,
          conversationId: isConversationExists.conversationId,
        });

        // Send a success response
        res.status(200).send({
          message: "Message created and posted successfully",
          sendername: req.user?.username,
        });
      } else {
        res.status(401).send({ message: "Not connected with each other" });
      }
    } catch (error) {
      console.error(error);
      // Handle internal server error
      res.status(500).send({ message: "Internal server error" });
    }
  }
};

// Handle one-to-one message retrieval
const getOneToOneMsg = async (req: Request, res: Response) => {
  const user1_id = req.user?.userId;
  const user2_id: number = Number(req.params.user2_id);

  if (user1_id && user2_id) {
    try {
      // Check if a conversation between the two users exists
      const isConversationExists = await Conversation.findOne({
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

      if (!isConversationExists) {
        // Create a new conversation if it doesn't exist
        await Conversation.create({
          user1_id,
          user2_id,
          type: "oneToOne",
        });

        res.status(200).send({ message: "Connection successful" });
      } else {
        try {
          // Check if the user is a contact
          const user = await Contact.findOne({
            where: {
              [Sequelize.Op.and]: [{ userId: user1_id }, { addedId: user2_id }],
            },
          });

          try {
            // Retrieve one-to-one messages
            const oneToOneMsg = await Message.findAll({
              where: { conversationId: isConversationExists.conversationId },
            });

            if (user) {
              res
                .status(201)
                .send({ oneToOneMsg, user1_id, username: user.username });
            } else {
              res
                .status(201)
                .send({ oneToOneMsg, user1_id, username: "anonymous" });
            }
          } catch (error) {
            console.log(error);
          }
        } catch (error) {
          console.log(error);
          res.status(500).send({ message: "Internal server error" });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
};

// Handle group message retrieval
const getGroupMsg = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const groupId = req.params.groupId;

  try {
    // Check if the group exists
    const isGroupExist = await Conversation.findOne({
      where: {
        type: "group",
        groupId: groupId,
      },
    });

    if (!isGroupExist) {
      return res
        .status(403)
        .send({ message: "User is not the creator of the group" });
    }

    // Retrieve group messages
    const groupMsg = await Message.findAll({
      where: { conversationId: isGroupExist.conversationId },
    });

    res.status(200).send({ groupMsg, userId, message: "Group Msg sent" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

// Handle POST request to create a new group message
const postGroupMsg = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const groupId: number = Number(req.params.groupId);
  const { message } = req.body;

  try {
    // Check if the conversation (group) exists
    const isConversationExists = await Conversation.findOne({
      where: { groupId: groupId },
    });

    if (!isConversationExists) {
      return res.status(401).send({ message: "Not connected with this group" });
    } else {
      // Create a new group message in the database
      await Message.create({
        conversationId: isConversationExists.conversationId,
        message,
        sendername: req.user?.username,
        senderId: userId,
      });

      res.status(200).send({
        message: "Message created and posted successfully",
        sendername: req.user?.username,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const MsgFromUnknown = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const allUnKnownMsg = [];
  try {
    const allOneSidedCoversation = await Conversation.findAll({
      where: { user2_id: userId },
      attributes: ["conversationId", "user1_id"],
    });

    // Use Promise.all to handle asynchronous operations concurrently
    const msgPromises = allOneSidedCoversation.map(async (itr) => {
      const isSaved = await Contact.findOne({
        where: { userId: userId, addedId: itr.user1_id },
      });

      if (!isSaved) {
        const msg = await Message.findAll({
          where: { conversationId: itr.conversationId, senderId: itr.user1_id },
          include: [{ model: User }],
        });
        return msg;
      }
      return null; // Return null for saved contacts
    });

    // Wait for all promises to resolve
    const messages = await Promise.all(msgPromises);

    // Filter out null values (saved contacts) and flatten the result
    allUnKnownMsg.push(...messages.filter((msg) => msg !== null));

    res.status(200).send({ allUnKnownMsg, userId: userId });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

// const MsgFromUnknown = async (req: Request, res: Response) => {
//   const userId = req.user?.userId;
//   try {
//     const allUnKnownMsg = await Conversation.findAll({
//       where: { user2_id: userId },
//       include: [
//         {
//           model: Message,
//           attributes: ["message"],
//           include: [{ model: User, attributes: ["phone"] }],
//         },
//       ],
//     });
//     res.status(200).send({ allUnKnownMsg });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ message: "Internal server error" });
//   }
// };

const unknownMsg = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const conversationId = Number(req.params.conversationId);
  try {
    const unknownMsg = await Message.findAll({
      where: { conversationId, senderId: userId },
    });
    res.status(200).send({ unknownMsg });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

export {
  postMessage,
  getOneToOneMsg,
  getGroupMsg,
  postGroupMsg,
  MsgFromUnknown,
  unknownMsg,
};
