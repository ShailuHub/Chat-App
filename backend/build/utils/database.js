"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize("chat_app", process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.HOST,
    dialect: "mysql",
});
exports.default = sequelize;
