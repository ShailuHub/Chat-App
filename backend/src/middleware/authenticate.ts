import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";

declare module "express" {
  interface Request {
    user?: User;
  }
}

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  try {
    const secret: Secret | undefined = process.env.JWT_SECRET;
    if (token && secret) {
      const decToken = (await jwt.verify(token, secret)) as JwtPayload;
      const user = await User.findOne({ where: { id: decToken.id } });
      if (user) {
        req.user = user;
      } else {
        throw new Error("User not found");
      }
      next();
    } else {
      throw new Error("JWT secret or Token is not defined");
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({ mesage: "Unathorized user" });
  }
};

export default authenticate;
