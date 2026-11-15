import { sequelize } from "../config/database.js";
import { User, Doctor, Wallet, Transaction, Message, Consultation } from "../models/index.js";
import { hashPassword } from "../core/auth/jwt.util.js";

export async function seedDatabase() {
  console.log("🌱 Dropping existing tables and recreating clean PostgreSQL schema...");
  await sequelize.sync({ force: true });
  console.log("✅ All tables cleanly recreated.");

  console.log("🌱 Creating Rehmat Health Care Doctors & Demo Users...");
  const defaultPasswordHash = await hashPassword("password123");

  // 1. Doctor: Dr. Rehmat Ali (MBBS, MD - General Medicine)
  const drRehmatUser = await User.create({
    id: "b1000000-0000-0000-0000-000000000001",
    name: "Dr. Rehmat Ali",
    phone: "+91 98370 12345",
    email: "dr.rehmat@rehmathealthcare.com",
    passwordHash: defaultPasswordHash,
    role: "doctor",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80",
  });

  const drRehmat = await Doctor.create({
    id: "b2000000-0000-0000-0000-000000000001",
    userId: drRehmatUser.id,
    specialization: "General Physician & Internal Medicine",
    qualifications: "MBBS, MD (General Medicine)",
    experienceYears: 15,
    clinicName: "Rehmat Health Care (Near Mohan Xray, Malviya Nagar, Moradabad)",
    ratePerMinute: 15.0,
    isOnline: true,
    isBusy: false,
    rating: 4.9,
    about: "Senior Consultant General Physician at Rehmat Health Care. Over 15 years of clinical experience treating diabetes, hypertension, and primary care illnesses.",
  });

  // 2. Doctor: Dr. Sana Khan (MBBS, MS - Gynecologist & Obstetrician)
  const drSanaUser = await User.create({
    id: "c1000000-0000-0000-0000-000000000002",
    name: "Dr. Sana Khan",
    phone: "+91 98370 67890",
    email: "dr.sana@rehmathealthcare.com",
    passwordHash: defaultPasswordHash,
    role: "doctor",
    avatarUrl: "https://images.unsplash.com/photo-1594824813596-78b958c22d0d?w=300&auto=format&fit=crop&q=80",
  });

  const drSana = await Doctor.create({
    id: "c2000000-0000-0000-0000-000000000002",
    userId: drSanaUser.id,
    specialization: "Gynecologist & Obstetrician",
    qualifications: "MBBS, MS (Obs & Gynae)",
    experienceYears: 11,
    clinicName: "Rehmat Health Care",
    ratePerMinute: 18.0,
    isOnline: true,
    isBusy: false,
    rating: 4.95,
    about: "Senior specialist in antenatal care, high-risk pregnancies, adolescent PCOD care, and compassionate women's reproductive health.",
  });

  // 3. Doctor: Dr. Tariq Mansoor (MBBS, DCH - Pediatrician)
  const drTariqUser = await User.create({
    id: "d1000000-0000-0000-0000-000000000003",
    name: "Dr. Tariq Mansoor",
    phone: "+91 98370 78910",
    email: "dr.tariq@rehmathealthcare.com",
    passwordHash: defaultPasswordHash,
    role: "doctor",
    avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80",
  });

  const drTariq = await Doctor.create({
    id: "d2000000-0000-0000-0000-000000000003",
    userId: drTariqUser.id,
    specialization: "Consultant Pediatrician & Neonatologist",
    qualifications: "MBBS, DCH (Pediatrics)",
    experienceYears: 10,
    clinicName: "Rehmat Health Care",
    ratePerMinute: 12.0,
    isOnline: true,
    isBusy: false,
    rating: 4.85,
    about: "Child health specialist handling neonatal care, growth milestones, pediatric immunization schedules, and childhood respiratory infections.",
  });

  // 4. Demo Patient: Mohd. Imran
  const patientUser = await User.create({
    id: "a1000000-0000-0000-0000-000000000001",
    name: "Mohd. Imran",
    phone: "+91 94120 54321",
    email: "imran.moradabad@gmail.com",
    passwordHash: defaultPasswordHash,
    role: "patient",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
  });

  // 5. Patient Wallet (Initial Balance ₹150 = ~10 mins with Dr. Rehmat Ali)
  const patientWallet = await Wallet.create({
    id: "e1000000-0000-0000-0000-000000000001",
    userId: patientUser.id,
    balance: 150.0,
    currency: "INR",
  });

  // 6. Initial Wallet Transaction
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

  // 7. Initial Welcome Message
  await Message.create({
    id: "f2000000-0000-0000-0000-000000000001",
    senderId: drRehmatUser.id,
    receiverId: patientUser.id,
    text: "Hello Mohd. Imran! Welcome to Rehmat Health Care. You can initiate a live video consultation or message me here anytime for medical advice.",
    isRead: false,
  });

  console.log("🎉 Clean database reset and seed completed successfully!");
  console.log({
    tablesCreated: ["users", "doctors", "wallets", "transactions", "consultations", "messages"],
    doctorsSeeded: [
      { name: drRehmatUser.name, rate: `₹${drRehmat.ratePerMinute}/min` },
      { name: drSanaUser.name, rate: `₹${drSana.ratePerMinute}/min` },
      { name: drTariqUser.name, rate: `₹${drTariq.ratePerMinute}/min` },
    ],
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
