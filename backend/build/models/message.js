"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../utils/database"));
const user_1 = require("./user");
const conversation_1 = require("./conversation");
class MessageModel extends sequelize_1.Model {
}
exports.Message = MessageModel;
MessageModel.init({
    messageId: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    conversationId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    sendername: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
    },
    senderId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, { sequelize: database_1.default, modelName: "Message" });
//Association
user_1.User.hasMany(MessageModel, {
    foreignKey: "senderId",
    onDelete: "CASCADE",
});
MessageModel.belongsTo(user_1.User, { foreignKey: "senderId", onDelete: "CASCADE" });
conversation_1.Conversation.hasMany(MessageModel, {
    foreignKey: "conversationId",
    onDelete: "CASCADE",
});
