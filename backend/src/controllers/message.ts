import { Request, Response } from "express";
import sequelize from "../utils/database";
import { User, Message } from "../models/index";
import Sequelize from "sequelize";

const postMessage = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { message } = req.body;
  if (userId) {
    try {
      await Message.create({
        username: req.user?.username,
        message,
        userId,
      });
      res.status(200).send({
        message: "Message table created and message posted",
        username: req.user?.username,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
};

const getMessage = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const lastMsgId: number = Number(req.params.lastMsgId);
  if (userId) {
    try {
      // Use Sequelize's where clause to filter messages with IDs greater than lastMsgId
      const allMessage = await Message.findAll({
        where: {
          id: {
            [Sequelize.Op.gt]: lastMsgId,
          },
        },
      });

      res.status(200).send({ message: "Message Posted", allMessage, userId });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal server error" });
    }
  } else {
    res.status(401).send({ message: "Unauthorised user" });
  }
};

export { postMessage, getMessage };
