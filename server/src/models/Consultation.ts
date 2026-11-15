import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database.js";
import { User } from "./User.js";
import { Doctor } from "./Doctor.js";

export interface ConsultationAttributes {
  id: string;
  patientId: string;
  doctorId: string;
  type: "video" | "audio";
  status: "initiated" | "ringing" | "connected" | "completed" | "ended_zero_balance" | "rejected" | "missed";
  ratePerMinute: number;
  startedAt?: Date;
  endedAt?: Date;
  durationSeconds: number;
  billedMinutes: number;
  totalCost: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ConsultationCreationAttributes
  extends Optional<
    ConsultationAttributes,
    "id" | "status" | "durationSeconds" | "billedMinutes" | "totalCost" | "createdAt" | "updatedAt"
  > {}

export class Consultation
  extends Model<ConsultationAttributes, ConsultationCreationAttributes>
  implements ConsultationAttributes
{
  declare id: string;
  declare patientId: string;
  declare doctorId: string;
  declare type: "video" | "audio";
  declare status: "initiated" | "ringing" | "connected" | "completed" | "ended_zero_balance" | "rejected" | "missed";
  declare ratePerMinute: number;
  declare startedAt?: Date;
  declare endedAt?: Date;
  declare durationSeconds: number;
  declare billedMinutes: number;
  declare totalCost: number;
  declare notes?: string;

  declare patient?: User;
  declare doctor?: Doctor;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Consultation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    doctorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "doctors",
        key: "id",
      },
    },
    type: {
      type: DataTypes.ENUM("video", "audio"),
      allowNull: false,
      defaultValue: "video",
    },
    status: {
      type: DataTypes.ENUM(
        "initiated",
        "ringing",
        "connected",
        "completed",
        "ended_zero_balance",
        "rejected",
        "missed"
      ),
      allowNull: false,
      defaultValue: "initiated",
    },
    ratePerMinute: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    durationSeconds: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    billedMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    totalCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "consultations",
  }
);
