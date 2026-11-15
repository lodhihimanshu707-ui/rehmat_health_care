import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database.js";

export interface TransactionAttributes {
  id: string;
  walletId: string;
  type: "credit" | "debit";
  amount: number;
  paymentMethod: string;
  referenceId?: string;
  status: "success" | "pending" | "failed";
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TransactionCreationAttributes extends Optional<TransactionAttributes, "id" | "createdAt" | "updatedAt"> {}

export class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
  declare id: string;
  declare walletId: string;
  declare type: "credit" | "debit";
  declare amount: number;
  declare paymentMethod: string;
  declare referenceId?: string;
  declare status: "success" | "pending" | "failed";
  declare description: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    walletId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "wallets",
        key: "id",
      },
    },
    type: {
      type: DataTypes.ENUM("credit", "debit"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "UPI",
    },
    referenceId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("success", "pending", "failed"),
      allowNull: false,
      defaultValue: "success",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "transactions",
  }
);
