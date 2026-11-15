import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database.js";

export interface UserAttributes {
  id: string;
  name: string;
  phone: string;
  email?: string;
  passwordHash?: string;
  role: "patient" | "doctor" | "admin";
  avatarUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare name: string;
  declare phone: string;
  declare email?: string;
  declare passwordHash?: string;
  declare role: "patient" | "doctor" | "admin";
  declare avatarUrl?: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("patient", "doctor", "admin"),
      allowNull: false,
      defaultValue: "patient",
    },
    avatarUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);
