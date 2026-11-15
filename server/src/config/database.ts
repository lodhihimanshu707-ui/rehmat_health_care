import { Sequelize } from "sequelize";
import { ENV } from "./env.js";

export const sequelize = ENV.DATABASE_URL
  ? new Sequelize(ENV.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: {
      timestamps: true,
    },
  })
  : new Sequelize({
    dialect: "sqlite",
    storage: ENV.DB_STORAGE,
    logging: false,
    define: {
      timestamps: true,
    },
  });
