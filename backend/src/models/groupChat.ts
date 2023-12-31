import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database";
import { User } from "./user";
import { Conversation } from "./conversation";
class GroupChatModel extends Model {
  public groupId!: number;
  public groupName!: string;
  public adminId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

GroupChatModel.init(
  {
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    groupName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { sequelize, modelName: "GroupChat" }
);

GroupChatModel.belongsTo(User, { foreignKey: "adminId" });
GroupChatModel.hasOne(Conversation, {
  foreignKey: "groupId",
  onDelete: "CASCADE",
});
export { GroupChatModel as GroupChat };
