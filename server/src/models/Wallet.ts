import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database.js";

export interface WalletAttributes {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WalletCreationAttributes extends Optional<WalletAttributes, "id" | "createdAt" | "updatedAt"> {}

export class Wallet extends Model<WalletAttributes, WalletCreationAttributes> implements WalletAttributes {
  declare id: string;
  declare userId: string;
  declare balance: number;
  declare currency: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Wallet.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "INR",
    },
  },
  {
    sequelize,
    tableName: "wallets",
  }
);
