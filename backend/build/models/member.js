"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../utils/database"));
const groupChat_1 = require("./groupChat");
const user_1 = require("./user");
class MemberModel extends sequelize_1.Model {
}
exports.Member = MemberModel;
MemberModel.init({
    memberId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    groupId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    isAdmin: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, { sequelize: database_1.default, modelName: "Member" });
user_1.User.hasMany(MemberModel, { foreignKey: "userId", onDelete: "CASCADE" });
MemberModel.belongsTo(groupChat_1.GroupChat, {
    foreignKey: "groupId",
    onDelete: "CASCADE",
});
MemberModel.belongsTo(user_1.User, { foreignKey: "userId", onDelete: "CASCADE" });
