import { sequelize } from "../config/database.js";
import { User, Doctor, Wallet, Transaction, Message, Consultation } from "../models/index.js";
import { hashPassword } from "../core/auth/jwt.util.js";

export async function seedDatabase() {
  console.log("🌱 Dropping existing tables and recreating clean PostgreSQL schema...");
  await sequelize.sync({ force: true });
  console.log("✅ All tables cleanly recreated.");

  console.log("🌱 Creating Rehmat Health Care Sole Doctor & Demo User...");
  const defaultPasswordHash = await hashPassword("password123");

  // 1. Sole Doctor: Dr. Raees Akhtar (General Physician & Family Medicine)
  const drRaeesUser = await User.create({
    id: "3733b500-aedc-4b14-9d0a-99d20b190028",
    name: "Dr. Raees Akhtar",
    phone: "+91 98370 12345",
    email: "dr.raees@rehmathealthcare.com",
    passwordHash: defaultPasswordHash,
    role: "doctor",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80",
  });

  const drRaees = await Doctor.create({
    id: "d434e00d-1e38-42b5-b2d4-721139ad7183",
    userId: drRaeesUser.id,
    specialization: "General Physician & Family Medicine",
    qualifications: "MBBS, MD (General Medicine)",
    experienceYears: 10,
    clinicName: "Rehmat Health Care (Near Mohan Xray, Malviya Nagar, Moradabad)",
    ratePerMinute: 15.0,
    isOnline: true,
    isBusy: false,
    rating: 4.5,
    about: "Chief Medical Consultant at Rehmat Health Care, Malviya Nagar, Moradabad. 10+ years dedicated experience in general medicine, seasonal infections, diabetes, hypertension, and primary healthcare.",
  });

  // 2. Demo Patient: Mohd. Imran
  const patientUser = await User.create({
    id: "cce7b0cb-243c-4e1c-9b2a-214a74434f5e",
    name: "Mohd. Imran",
    phone: "+91 94120 54321",
    email: "imran.moradabad@gmail.com",
    passwordHash: defaultPasswordHash,
    role: "patient",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
  });

  // 3. Patient Wallet (Initial Balance ₹150 = 10 mins with Dr. Raees Akhtar)
  const patientWallet = await Wallet.create({
    id: "537a2db7-24fe-4bf2-82d8-69ccee929a77",
    userId: patientUser.id,
    balance: 150.0,
    currency: "INR",
  });

  // 4. Initial Wallet Transaction
  await Transaction.create({
    id: "286790b5-b260-4aa4-b21f-c45e6d6ef45b",
    walletId: patientWallet.id,
    type: "credit",
    amount: 150.0,
    paymentMethod: "UPI (Google Pay)",
    referenceId: "TXN-INIT-001",
    status: "success",
    description: "Welcome Credits - Rehmat Health Care Teleconsultation",
  });

  // 5. Initial Welcome Message
  await Message.create({
    id: "1d0de862-2df0-4858-8914-a3e049c1318d",
    senderId: drRaeesUser.id,
    receiverId: patientUser.id,
    text: "Hello Mohd. Imran! Welcome to Rehmat Health Care. I am Dr. Raees Akhtar. You can initiate a live video consultation or message me here anytime for medical advice.",
    isRead: false,
  });

  console.log("🎉 Clean database reset and seed completed successfully!");
  console.log({
    tablesCreated: ["users", "doctors", "wallets", "transactions", "consultations", "messages"],
    doctorSeeded: { name: drRaeesUser.name, rate: `₹${drRaees.ratePerMinute}/min`, rating: drRaees.rating },
    patientSeeded: { name: patientUser.name, wallet: `₹${patientWallet.balance}` },
  });
}

seedDatabase()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
