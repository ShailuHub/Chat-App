"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupChat = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../utils/database"));
const user_1 = require("./user");
class GroupChatModel extends sequelize_1.Model {
}
exports.GroupChat = GroupChatModel;
GroupChatModel.init({
    groupId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    groupName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    adminId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, { sequelize: database_1.default, modelName: "GroupChat" });
GroupChatModel.belongsTo(user_1.User, { foreignKey: "adminId" });
