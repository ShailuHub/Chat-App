import { Request, Response } from "express";
import path from "path";
import { absolutePath } from "../utils/path";
import { User } from "../models/user";
import sequelize from "../utils/database";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import Sequelize from "sequelize";
import { Contact } from "../models";

const saltRound: number = 10;

function isValidPhoneNumber(phone: string): boolean {
  if (phone.length != 10) return false;
  for (let i = 0; i < 10; ++i) {
    let char = parseInt(phone[i]);
    if (isNaN(char)) return false;
  }
  return true;
}
// Handle POST request to create a new user account
const postSignup = async (req: Request, res: Response) => {
  let { username, email, password, confirm_password, phone } = req.body;
  // Trim and convert email and username to lowercase for consistency
  username = username.trim();
  let usernameArray = username.split(" ");
  username = usernameArray[0];
  email = email.trim().toLowerCase();
  phone = phone.trim();
  if (!isValidPhoneNumber(phone))
    return res.status(405).send({ message: "Enter valid phone number" });
  if (password === confirm_password) {
    try {
      // Check if the email already exists in the database
      const user = await User.findOne({
        where: {
          [Sequelize.Op.or]: [
            {
              email: email,
            },
            { phone: phone },
          ],
        },
      });

      if (!user) {
        // Hash the password before saving it to the database
        const hashPassword: string = await bcrypt.hash(password, saltRound);
        try {
          await User.create({
            username: username,
            email: email,
            password: hashPassword,
            phone: phone,
          });

          // Send a success response
          res
            .status(202)
            .send({ success: "success", message: "Registered successfully" });
        } catch (error) {
          console.log(error);
          res.status(500).send({ message: "Internal server error" });
        }
      } else {
        // User with the same email already exists
        res
          .status(409)
          .send({ success: "failed", message: "Email already exists" });
      }
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  } else {
    // Passwords don't match
    res
      .status(400)
      .send({ success: "failed", message: "Passwords don't match" });
  }
};

// Handle GET request to retrieve the signup page
const getSignup = async (req: Request, res: Response) => {
  const filePath: string = path.join(
    __dirname,
    absolutePath,
    "html",
    "signup.html"
  );
  res.status(200).sendFile(filePath);
};

// Handle GET request to retrieve the login page
const getLogin = async (req: Request, res: Response) => {
  const filePath: string = path.join(
    __dirname,
    absolutePath,
    "html",
    "login.html"
  );
  res.status(200).sendFile(filePath);
};

// Handle POST request to log in a user
const postLogin = async (req: Request, res: Response) => {
  let { email, password } = req.body;

  // Trim and convert email to lowercase for consistency
  email = email.trim().toLowerCase();

  try {
    // Find the user with the provided email
    const user = await User.findOne({ where: { email: email } });

    if (user) {
      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const secret: Secret = process.env.JWT_SECRET!;
        // Create a JSON Web Token (JWT) for authentication
        const token = await jwt.sign(
          {
            id: user.userId,
            email: user.email,
            phone: user.phone,
          },
          secret,
          { expiresIn: "1hr" }
        );

        // Send a success response with the JWT
        res.status(200).json({
          success: "success",
          message: "Logged in",
          token: token,
          ownerId: user.userId,
          ownerName: user.username,
        });
      } else {
        // Unauthorized user (incorrect password)
        res.status(401).json({ message: "Unauthorized user" });
      }
    } else {
      // User not found
      res.status(401).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Handle GET request to retrieve the chat page
const getChatPage = async (req: Request, res: Response) => {
  const filePath: string = path.join(
    __dirname,
    absolutePath,
    "html",
    "chat.html"
  );
  res.status(200).sendFile(filePath);
};

// Handle GET request to retrieve all users (for admin or chat functionality)
const getAllUsers = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (userId) {
    try {
      const allUsers = await Contact.findAll({
        where: { userId: userId },
        include: [{ model: User, attributes: ["isActive"] }],
      });
      res.status(200).send({
        message: "Users posted",
        allUsers,
        ownerName: req.user?.username,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
};

export { postSignup, getSignup, getLogin, postLogin, getChatPage, getAllUsers };
