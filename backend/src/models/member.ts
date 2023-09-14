import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database";
import { GroupChat } from "./group";
import { User } from "./user";

class MemberModel extends Model {
  public memberId!: number;
  public groupId!: number;
  public userId!: number;
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
  },
  { sequelize, modelName: "Member" }
);

User.hasMany(MemberModel, { foreignKey: "userId", onDelete: "CASCADE" });
MemberModel.belongsTo(GroupChat, {
  foreignKey: "groupId",
  onDelete: "CASCADE",
});

export { MemberModel as Member };
