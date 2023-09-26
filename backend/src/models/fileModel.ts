import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database";

class FileModel extends Model {
  public fileId!: number;
  public fileName!: string;
  public fileType!: string;
  public fileUrl!: string;
  public conversationId!: number;
  public senderId!: number;
}

FileModel.init(
  {
    fileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { sequelize, modelName: "File" }
);

export { FileModel as File };
