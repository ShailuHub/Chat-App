import { Request, Response } from "express";
import sequelize from "../utils/database";
import { User, Message, Conversation, Contact } from "../models/index";
import Sequelize from "sequelize";

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

          if (user) {
            try {
              // Retrieve one-to-one messages
              const oneToOneMsg = await Message.findAll({
                where: { conversationId: isConversationExists.conversationId },
              });

              res
                .status(201)
                .send({ oneToOneMsg, user1_id, username: user.username });
            } catch (error) {
              console.log(error);
            }
          } else {
            res.status(405).send({ message: "No contact" });
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

export { postMessage, getOneToOneMsg, getGroupMsg, postGroupMsg };
