import { Op } from "sequelize";
import { User, Wallet, Doctor } from "../../models/index.js";
import { BaseService } from "../../core/base/base.service.js";
import { RequestContext } from "../../core/context/request-context.js";
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  ValidationError,
} from "../../core/errors/domain-errors.js";
import {
  signToken,
  hashPassword,
  comparePassword,
} from "../../core/auth/jwt.util.js";
import { RegisterInput, LoginInput } from "./auth.schema.js";

export class AuthService extends BaseService {
  async register(data: RegisterInput) {
    const existing = await User.findOne({
      where: {
        [Op.or]: [
          { phone: data.phone },
          ...(data.email ? [{ email: data.email }] : []),
        ],
      },
    });

    if (existing) {
      if (existing.phone === data.phone) {
        throw new ConflictError("A user with this phone number already exists.");
      }
      throw new ConflictError("A user with this email address already exists.");
    }

    const passwordHash = await hashPassword(data.password);

    const user = await User.create({
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      passwordHash,
      role: data.role,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
    });

    let wallet: Wallet | null = null;
    if (user.role === "patient") {
      wallet = await Wallet.create({
        userId: user.id,
        balance: 100, // Starting welcome promo bonus credit of ₹100
        currency: "INR",
      });
    }

    const token = signToken({
      id: user.id,
      role: user.role,
      phone: user.phone,
      name: user.name,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      token,
      wallet: wallet ? { balance: wallet.balance, currency: wallet.currency } : null,
    };
  }

  async login(data: LoginInput) {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ phone: data.identifier }, { email: data.identifier }],
      },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid phone number or email address.");
    }

    let isPasswordValid = false;
    if (user.passwordHash) {
      isPasswordValid = await comparePassword(data.password, user.passwordHash);
    } else {
      // Demo / seed user fallback password
      if (data.password === "password123") {
        isPasswordValid = true;
        user.passwordHash = await hashPassword("password123");
        await user.save();
      }
    }

    if (!isPasswordValid) {
      throw new UnauthorizedError("Incorrect password. Please try again.");
    }

    const token = signToken({
      id: user.id,
      role: user.role,
      phone: user.phone,
      name: user.name,
      email: user.email,
    });

    let walletBalance = 0;
    if (user.role === "patient") {
      const wallet = await Wallet.findOne({ where: { userId: user.id } });
      if (wallet) {
        walletBalance = wallet.balance;
      }
    }

    let doctorProfile: any = null;
    if (user.role === "doctor") {
      doctorProfile = await Doctor.findOne({ where: { userId: user.id } });
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      token,
      walletBalance,
      doctor: doctorProfile,
    };
  }

  async quickLogin(userId: string) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundError("Demo user not found in database.");
    }

    const token = signToken({
      id: user.id,
      role: user.role,
      phone: user.phone,
      name: user.name,
      email: user.email,
    });

    let walletBalance = 0;
    if (user.role === "patient") {
      const wallet = await Wallet.findOne({ where: { userId: user.id } });
      if (wallet) {
        walletBalance = wallet.balance;
      }
    }

    let doctorProfile: any = null;
    if (user.role === "doctor") {
      doctorProfile = await Doctor.findOne({ where: { userId: user.id } });
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      token,
      walletBalance,
      doctor: doctorProfile,
    };
  }

  async getMe() {
    const current = RequestContext.getCurrentUser();
    if (!current) {
      throw new UnauthorizedError("You are not authenticated.");
    }

    const user = await User.findByPk(current.id);
    if (!user) {
      throw new NotFoundError("User record not found.");
    }

    let walletBalance = 0;
    if (user.role === "patient") {
      const wallet = await Wallet.findOne({ where: { userId: user.id } });
      if (wallet) {
        walletBalance = wallet.balance;
      }
    }

    let doctorProfile: any = null;
    if (user.role === "doctor") {
      doctorProfile = await Doctor.findOne({ where: { userId: user.id } });
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      walletBalance,
      doctor: doctorProfile,
    };
  }
}
