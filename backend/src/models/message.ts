import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database";
import { User } from "./user";
import { Conversation } from "./conversation";

class MessageModel extends Model {
  public messageId!: number;
  public conversationId!: number;
  public sendername!: string;
  public message!: string;
  public senderId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public phone!: string;
}

MessageModel.init(
  {
    messageId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sendername: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
    },
    senderId: {
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
  foreignKey: "senderId",
  onDelete: "CASCADE",
});
MessageModel.belongsTo(User, { foreignKey: "senderId", onDelete: "CASCADE" });
Conversation.hasMany(MessageModel, {
  foreignKey: "conversationId",
  onDelete: "CASCADE",
});

export { MessageModel as Message };
