import { Request, Response, NextFunction } from "express";
import path from "path";
import { absolutePath } from "../utils/path";
import { User } from "../models/user";
import sequelize from "../utils/database";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";

const saltRound: number = 10;

const postSignup = async (req: Request, res: Response) => {
  let { username, email, password, confirm_password, phone } = req.body;
  username = username.trim().toLowerCase();
  email = email.trim().toLowerCase();
  if (password === confirm_password) {
    try {
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        const hashPassword: string = await bcrypt.hash(password, saltRound);
        try {
          await User.create({
            username: username,
            email: email,
            password: hashPassword,
            phone: phone,
          });
          res
            .status(202)
            .send({ success: "success", message: "Registered successfully" });
        } catch (error) {
          console.log(error);
          res.status(500).send({ message: "Internal server error" });
        }
      } else {
        res.status(409).send({ success: "failed", message: "Email exists" });
      }
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  } else {
    res
      .status(400)
      .send({ success: "failed", message: "Password don't match" });
  }
};

const getSignup = async (req: Request, res: Response) => {
  const filePath: string = path.join(
    __dirname,
    absolutePath,
    "html",
    "signup.html"
  );
  res.status(200).sendFile(filePath);
};

const getLogin = async (req: Request, res: Response) => {
  const filePath: string = path.join(
    __dirname,
    absolutePath,
    "html",
    "login.html"
  );
  res.status(200).sendFile(filePath);
};

const postLogin = async (req: Request, res: Response) => {
  let { email, password } = req.body;
  email = email.trim().toLowerCase();
  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const secret: Secret = process.env.JWT_SECRET!;
        const token = await jwt.sign(
          {
            id: user.id,
            email: user.email,
            phone: user.phone,
          },
          secret,
          { expiresIn: "1hr" }
        );
        res
          .status(200)
          .json({ success: "success", message: "Logged in", token: token });
      } else {
        res.status(401).json({ message: "Unauthorized user" });
      }
    } else {
      res.status(401).json({ message: "User not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getChatPage = async (req: Request, res: Response) => {
  const filePath: string = path.join(
    __dirname,
    absolutePath,
    "html",
    "chat.html"
  );
  res.status(200).sendFile(filePath);
};

const getAllUsers = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (userId) {
    try {
      const allUsers = await User.findAll();
      res.status(200).send({ message: "Users posted", allUsers });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
};

export { postSignup, getSignup, getLogin, postLogin, getChatPage, getAllUsers };
