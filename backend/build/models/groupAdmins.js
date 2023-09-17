"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupAdmin = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../utils/database"));
const index_1 = require("./index");
class AdminModel extends sequelize_1.Model {
}
exports.GroupAdmin = AdminModel;
AdminModel.init({
    adminId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, { sequelize: database_1.default, modelName: "GroupAdmin" });
// Define the many-to-many relationship between users and group chats through admins
index_1.User.belongsToMany(index_1.GroupChat, { through: AdminModel, foreignKey: "userId" });
index_1.GroupChat.belongsToMany(index_1.User, { through: AdminModel, foreignKey: "groupId" });
