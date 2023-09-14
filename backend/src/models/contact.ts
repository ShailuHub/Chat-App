import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database";
import { User } from "./user";

class ContactModel extends Model {
  public contactId!: number;
  public phone!: string;
  public username!: string;
  public userId!: number;
  public addedId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

ContactModel.init(
  {
    contactId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    addedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { sequelize, modelName: "Contact" }
);

User.hasMany(ContactModel, { foreignKey: "userId", onDelete: "CASCADE" });

export { ContactModel as Contact };
