import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database";
import { GroupChat } from "./groupChat";
import { User } from "./user";

class MemberModel extends Model {
  public memberId!: number;
  public groupId!: number;
  public userId!: number;
  public isAdmin!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

MemberModel.init(
  {
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { sequelize, modelName: "Member" }
);

User.hasMany(MemberModel, { foreignKey: "userId", onDelete: "CASCADE" });
MemberModel.belongsTo(GroupChat, {
  foreignKey: "groupId",
  onDelete: "CASCADE",
});
MemberModel.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
export { MemberModel as Member };
