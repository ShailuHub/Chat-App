import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import path from "path";
import { userRouter } from "./routes";
import sequelize from "./utils/database";

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "..", "..", "fronted", "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(userRouter);

sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log("server is working on the port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
