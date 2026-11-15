import { Sequelize } from "sequelize";
import { ENV } from "./env.js";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ENV.DB_STORAGE,
  logging: false,
  define: {
    timestamps: true,
  },
});
