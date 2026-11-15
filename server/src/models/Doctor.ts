import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database.js";
import { User } from "./User.js";

export interface DoctorAttributes {
  id: string;
  userId: string;
  specialization: string;
  qualifications: string;
  experienceYears: number;
  clinicName: string;
  ratePerMinute: number;
  isOnline: boolean;
  isBusy: boolean;
  rating: number;
  about?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DoctorCreationAttributes extends Optional<DoctorAttributes, "id" | "createdAt" | "updatedAt"> {}

export class Doctor extends Model<DoctorAttributes, DoctorCreationAttributes> implements DoctorAttributes {
  declare id: string;
  declare userId: string;
  declare specialization: string;
  declare qualifications: string;
  declare experienceYears: number;
  declare clinicName: string;
  declare ratePerMinute: number;
  declare isOnline: boolean;
  declare isBusy: boolean;
  declare rating: number;
  declare about?: string;

  declare user?: User;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Doctor.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qualifications: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experienceYears: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    clinicName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Rehmat Health Care",
    },
    ratePerMinute: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 15.0,
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isBusy: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 4.8,
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "doctors",
  }
);
