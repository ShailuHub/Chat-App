import { Request, Response } from "express";
import sequelize from "../utils/database";
import { User, Message } from "../models/index";

const postMessage = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { message } = req.body;
  if (userId) {
    try {
      await Message.create({
        message,
        userId,
      });
      res
        .status(200)
        .send({ message: "Message table created and message posted" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
};

export { postMessage };
