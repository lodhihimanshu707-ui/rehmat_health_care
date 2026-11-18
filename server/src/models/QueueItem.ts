import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database.js";

export interface QueueItemAttributes {
  id: string;
  tokenNumber: string;
  queueNumber: number;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  patientAvatar?: string;
  patientBalance?: number;
  doctorId: string;
  type: "video" | "clinic";
  status: "waiting" | "calling" | "in_consultation" | "completed" | "cancelled";
  symptom?: string;
  estimatedWaitMinutes: number;
  joinedAt: Date;
  calledAt?: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface QueueItemCreationAttributes
  extends Optional<
    QueueItemAttributes,
    "id" | "patientPhone" | "patientAvatar" | "patientBalance" | "symptom" | "calledAt" | "completedAt" | "createdAt" | "updatedAt"
  > {}

export class QueueItem
  extends Model<QueueItemAttributes, QueueItemCreationAttributes>
  implements QueueItemAttributes
{
  declare id: string;
  declare tokenNumber: string;
  declare queueNumber: number;
  declare patientId: string;
  declare patientName: string;
  declare patientPhone?: string;
  declare patientAvatar?: string;
  declare patientBalance?: number;
  declare doctorId: string;
  declare type: "video" | "clinic";
  declare status: "waiting" | "calling" | "in_consultation" | "completed" | "cancelled";
  declare symptom?: string;
  declare estimatedWaitMinutes: number;
  declare joinedAt: Date;
  declare calledAt?: Date;
  declare completedAt?: Date;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

QueueItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tokenNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    queueNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    patientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    patientPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    patientAvatar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    patientBalance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    doctorId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("video", "clinic"),
      allowNull: false,
      defaultValue: "video",
    },
    status: {
      type: DataTypes.ENUM("waiting", "calling", "in_consultation", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "waiting",
    },
    symptom: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estimatedWaitMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    joinedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    calledAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "opd_queue",
    indexes: [
      {
        fields: ["status", "joinedAt"],
      },
      {
        fields: ["patientId"],
      },
    ],
  }
);
