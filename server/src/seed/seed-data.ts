import { sequelize } from "../config/database.js";
import { User, Doctor, Wallet, Transaction, Message } from "../models/index.js";

export async function seedDatabase() {
  console.log("🌱 Syncing database schema with PostgreSQL...");
  await sequelize.sync({ force: true });
  console.log("✅ Tables synced successfully.");

  console.log("🌱 Creating Rehmat Health Care Doctors & Demo Users...");

  // 1. Doctor: Dr. Rehmat Ali
  const drRehmatUser = await User.create({
    id: "b1000000-0000-0000-0000-000000000001",
    name: "Dr. Rehmat Ali",
    phone: "+91 98370 12345",
    email: "dr.rehmat@rehmathealthcare.com",
    role: "doctor",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80",
  });

  const drRehmat = await Doctor.create({
    id: "b2000000-0000-0000-0000-000000000001",
    userId: drRehmatUser.id,
    specialization: "General Physician & Family Medicine",
    qualifications: "MBBS, MD (General Medicine)",
    experienceYears: 14,
    clinicName: "Rehmat Health Care (Near Mohan X-Ray, Malviya Nagar, Moradabad)",
    ratePerMinute: 15.0,
    isOnline: true,
    isBusy: false,
    rating: 4.9,
    about: "Senior Consultant General Physician at Rehmat Health Care. Over 14 years of clinical experience diagnosing and treating chronic and acute primary care medical conditions.",
  });

  // 2. Doctor: Dr. Sana Khan
  const drSanaUser = await User.create({
    id: "c1000000-0000-0000-0000-000000000002",
    name: "Dr. Sana Khan",
    phone: "+91 98370 67890",
    email: "dr.sana@rehmathealthcare.com",
    role: "doctor",
    avatarUrl: "https://images.unsplash.com/photo-1594824813596-78b958c22d0d?w=300&auto=format&fit=crop&q=80",
  });

  const drSana = await Doctor.create({
    id: "c2000000-0000-0000-0000-000000000002",
    userId: drSanaUser.id,
    specialization: "Women Health & Family Wellness",
    qualifications: "BUMS, Consultant Physician",
    experienceYears: 9,
    clinicName: "Rehmat Health Care",
    ratePerMinute: 12.0,
    isOnline: true,
    isBusy: false,
    rating: 4.8,
    about: "Specialized in holistic primary care, women's health wellness, and routine family medicine.",
  });

  // 3. Demo Patient: Mohd. Imran
  const patientUser = await User.create({
    id: "a1000000-0000-0000-0000-000000000001",
    name: "Mohd. Imran",
    phone: "+91 94120 54321",
    email: "imran.moradabad@gmail.com",
    role: "patient",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
  });

  // Create Patient Wallet with initial bonus of ₹150 (approx 10 minutes of consultation)
  const patientWallet = await Wallet.create({
    id: "e1000000-0000-0000-0000-000000000001",
    userId: patientUser.id,
    balance: 150.0,
    currency: "INR",
  });

  // Create initial transaction record
  await Transaction.create({
    id: "f1000000-0000-0000-0000-000000000001",
    walletId: patientWallet.id,
    type: "credit",
    amount: 150.0,
    paymentMethod: "UPI (Google Pay)",
    referenceId: "TXN-INIT-001",
    status: "success",
    description: "Welcome Credits - Rehmat Health Care Teleconsultation",
  });

  // Create a welcome chat message from Dr. Rehmat Ali
  await Message.create({
    id: "f2000000-0000-0000-0000-000000000001",
    senderId: drRehmatUser.id,
    receiverId: patientUser.id,
    text: "Hello Mohd. Imran! Welcome to Rehmat Health Care teleconsultation. You can initiate a live video call or text me here anytime you need medical advice.",
    isRead: false,
  });

  console.log("🎉 Neon PostgreSQL Seed completed successfully!");
  console.log({
    doctors: [drRehmat.id, drSana.id],
    patient: patientUser.id,
    walletBalance: patientWallet.balance,
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
