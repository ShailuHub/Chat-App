import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database";
import { User } from "./user";

class MessageModel extends Model {
  public id!: number;
  public message!: string;
  public userId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

MessageModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    message: {
      type: DataTypes.TEXT,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { sequelize, modelName: "Message" }
);

//Association
User.hasMany(MessageModel, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

export { MessageModel as Message };
