import { sequelize } from "../config/database.js";
import { User, Doctor, Wallet, Transaction, Message, Consultation } from "../models/index.js";
import { hashPassword } from "../core/auth/jwt.util.js";

export async function seedDatabase() {
  console.log("🌱 Dropping existing tables and recreating clean PostgreSQL schema...");
  await sequelize.sync({ force: true });
  console.log("✅ All tables cleanly recreated.");

  console.log("🌱 Creating Rehmat Health Care Doctor (Dr. Raees Akhtar) & Generic Patients (Rahul Sharma, Priya Verma)...");
  const defaultPasswordHash = await hashPassword("password123");

  // 1. Sole Doctor: Dr. Raees Akhtar (General Physician & Family Medicine)
  const drRaeesUser = await User.create({
    id: "b1000000-0000-0000-0000-000000000001",
    name: "Dr. Raees Akhtar",
    phone: "+91 98370 12345",
    email: "dr.raees@rehmathealthcare.com",
    passwordHash: defaultPasswordHash,
    role: "doctor",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80",
  });

  const drRaees = await Doctor.create({
    id: "b2000000-0000-0000-0000-000000000001",
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

  // 2. Patient 1: Rahul Sharma (patient_1@rehmatcare.com)
  const patient1User = await User.create({
    id: "a1000000-0000-0000-0000-000000000001",
    name: "Rahul Sharma",
    phone: "+91 94120 54321",
    email: "patient_1@rehmatcare.com",
    passwordHash: defaultPasswordHash,
    role: "patient",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
  });

  const patient1Wallet = await Wallet.create({
    id: "e1000000-0000-0000-0000-000000000001",
    userId: patient1User.id,
    balance: 150.0,
    currency: "INR",
  });

  await Transaction.create({
    id: "f1000000-0000-0000-0000-000000000001",
    walletId: patient1Wallet.id,
    type: "credit",
    amount: 150.0,
    paymentMethod: "UPI (Google Pay)",
    referenceId: "TXN-PAT1-001",
    status: "success",
    description: "Welcome Credits - Rehmat Health Care Teleconsultation",
  });

  await Message.create({
    id: "11000000-0000-0000-0000-000000000001",
    senderId: drRaeesUser.id,
    receiverId: patient1User.id,
    text: "Hello Rahul Sharma! Welcome to Rehmat Health Care. I am Dr. Raees Akhtar. You can initiate a live video consultation or message me here anytime for medical advice.",
    isRead: false,
  });

  // 3. Patient 2: Priya Verma (patient_2@rehmatcare.com)
  const patient2User = await User.create({
    id: "a2000000-0000-0000-0000-000000000002",
    name: "Priya Verma",
    phone: "+91 94120 54322",
    email: "patient_2@rehmatcare.com",
    passwordHash: defaultPasswordHash,
    role: "patient",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
  });

  const patient2Wallet = await Wallet.create({
    id: "e2000000-0000-0000-0000-000000000002",
    userId: patient2User.id,
    balance: 200.0,
    currency: "INR",
  });

  await Transaction.create({
    id: "f2000000-0000-0000-0000-000000000002",
    walletId: patient2Wallet.id,
    type: "credit",
    amount: 200.0,
    paymentMethod: "UPI (PhonePe)",
    referenceId: "TXN-PAT2-001",
    status: "success",
    description: "Welcome Credits - Rehmat Health Care Teleconsultation",
  });

  await Message.create({
    id: "12000000-0000-0000-0000-000000000002",
    senderId: drRaeesUser.id,
    receiverId: patient2User.id,
    text: "Hello Priya Verma! Dr. Raees Akhtar here from Rehmat Health Care. Feel free to consult or share your reports for review.",
    isRead: false,
  });

  console.log("🎉 Clean database reset and seed completed successfully!");
  console.log({
    tablesCreated: ["users", "doctors", "wallets", "transactions", "consultations", "messages"],
    doctorSeeded: { name: drRaeesUser.name, email: drRaeesUser.email, rate: `₹${drRaees.ratePerMinute}/min` },
    patient1Seeded: { name: patient1User.name, email: patient1User.email, wallet: `₹${patient1Wallet.balance}` },
    patient2Seeded: { name: patient2User.name, email: patient2User.email, wallet: `₹${patient2Wallet.balance}` },
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
