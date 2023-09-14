"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMessage = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../utils/database"));
const user_1 = require("./user");
const group_1 = require("./group");
class GroupMessageModel extends sequelize_1.Model {
}
exports.GroupMessage = GroupMessageModel;
GroupMessageModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    groupMsg: {
        type: sequelize_1.DataTypes.TEXT,
    },
    groupId: {
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
}, { sequelize: database_1.default, modelName: "GroupMessage" });
//Association
user_1.User.hasMany(GroupMessageModel, { foreignKey: "userId", onDelete: "CASCADE" });
group_1.Group.hasMany(GroupMessageModel, {
    foreignKey: "groupId",
    onDelete: "CASCADE",
});
