import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database.js";
import { User } from "./User.js";

export interface MessageAttributes {
  id: string;
  senderId: string;
  receiverId: string;
  consultationId?: string;
  text: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MessageCreationAttributes extends Optional<MessageAttributes, "id" | "isRead" | "createdAt" | "updatedAt"> {}

export class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  declare id: string;
  declare senderId: string;
  declare receiverId: string;
  declare consultationId?: string;
  declare text: string;
  declare isRead: boolean;

  declare sender?: User;
  declare receiver?: User;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    consultationId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "messages",
  }
);
