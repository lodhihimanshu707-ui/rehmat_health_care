import http from "http";
import { app } from "./app.js";
import { ENV } from "./config/env.js";
import { sequelize } from "./config/database.js";
import { initializeSocket } from "./socket/index.js";

const server = http.createServer(app);

// Initialize Socket.io
export const io = initializeSocket(server);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    server.listen(ENV.PORT, () => {
      console.log(`🏥 Rehmat Health Care Server listening on port ${ENV.PORT}`);
      console.log(`🌐 Base API URL: http://localhost:${ENV.PORT}/api`);
      console.log(`⚡ Socket.io gateway online`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

