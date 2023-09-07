import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "chat-app",
  process.env.DB_USERNAME!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.HOST,
    dialect: "mysql",
  }
);

export default sequelize;
