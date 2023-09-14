import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database";
import { User } from "./user";
import { Message } from "./message";

class ConversationModel extends Model {
  public conversationId!: number;
  public type!: string;
  public user1_id!: number;
  public user2_id!: number;
  public groupId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

ConversationModel.init(
  {
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user1_id: {
      type: DataTypes.INTEGER,
    },
    user2_id: {
      type: DataTypes.INTEGER,
    },
    groupId: {
      type: DataTypes.INTEGER,
    },
  },
  { sequelize, modelName: "Conversation" }
);

User.hasMany(ConversationModel, {
  foreignKey: "user1_id",
  onDelete: "CASCADE",
});

User.hasMany(ConversationModel, {
  foreignKey: "user2_id",
  onDelete: "CASCADE",
});

export { ConversationModel as Conversation };
