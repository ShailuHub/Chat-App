"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../utils/database"));
class FileModel extends sequelize_1.Model {
}
exports.File = FileModel;
FileModel.init({
    fileId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    fileName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    fileType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    fileUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    conversationId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    senderId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, { sequelize: database_1.default, modelName: "File" });
