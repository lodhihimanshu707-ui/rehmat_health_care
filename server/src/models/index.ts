import { User } from "./User.js";
import { Doctor } from "./Doctor.js";
import { Wallet } from "./Wallet.js";
import { Transaction } from "./Transaction.js";
import { Consultation } from "./Consultation.js";
import { Message } from "./Message.js";

// User <-> Doctor (1:1)
User.hasOne(Doctor, { foreignKey: "userId", as: "doctorProfile" });
Doctor.belongsTo(User, { foreignKey: "userId", as: "user" });

// User <-> Wallet (1:1)
User.hasOne(Wallet, { foreignKey: "userId", as: "wallet" });
Wallet.belongsTo(User, { foreignKey: "userId", as: "user" });

// Wallet <-> Transaction (1:M)
Wallet.hasMany(Transaction, { foreignKey: "walletId", as: "transactions" });
Transaction.belongsTo(Wallet, { foreignKey: "walletId", as: "wallet" });

// User & Doctor <-> Consultation (1:M)
User.hasMany(Consultation, { foreignKey: "patientId", as: "patientConsultations" });
Doctor.hasMany(Consultation, { foreignKey: "doctorId", as: "doctorConsultations" });
Consultation.belongsTo(User, { foreignKey: "patientId", as: "patient" });
Consultation.belongsTo(Doctor, { foreignKey: "doctorId", as: "doctor" });

// User <-> Message (1:M)
User.hasMany(Message, { foreignKey: "senderId", as: "sentMessages" });
User.hasMany(Message, { foreignKey: "receiverId", as: "receivedMessages" });
Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });
Message.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });

export { User, Doctor, Wallet, Transaction, Consultation, Message };

