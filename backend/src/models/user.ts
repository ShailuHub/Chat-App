import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database";

class UserModel extends Model {
  public userId!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public phone!: string;
  public isActive!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

UserModel.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { sequelize, modelName: "User" }
);

export { UserModel as User };
