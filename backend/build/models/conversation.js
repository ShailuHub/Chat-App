"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversation = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../utils/database"));
const user_1 = require("./user");
class ConversationModel extends sequelize_1.Model {
}
exports.Conversation = ConversationModel;
ConversationModel.init({
    conversationId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    user1_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    user2_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    groupId: {
        type: sequelize_1.DataTypes.INTEGER,
    },
}, { sequelize: database_1.default, modelName: "Conversation" });
user_1.User.hasMany(ConversationModel, {
    foreignKey: "user1_id",
    onDelete: "CASCADE",
});
user_1.User.hasMany(ConversationModel, {
    foreignKey: "user2_id",
    onDelete: "CASCADE",
});
