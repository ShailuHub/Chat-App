"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../utils/database"));
const group_1 = require("./group");
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
}, { sequelize: database_1.default, modelName: "Member" });
user_1.User.hasMany(MemberModel, { foreignKey: "userId", onDelete: "CASCADE" });
MemberModel.belongsTo(group_1.GroupChat, {
    foreignKey: "groupId",
    onDelete: "CASCADE",
});
