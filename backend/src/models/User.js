import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const trustedContactSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["rider", "driver", "admin"], default: null },
    avatarUrl: String,

    isEmailVerified: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },

    walletBalanceKobo: { type: Number, default: 0 },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    emergencyContact: { name: String, phone: String },
    trustedContacts: [trustedContactSchema],

    language: { type: String, default: "en" },
    currency: { type: String, default: "NGN" },

    googleId: String,
    lastLoginAt: Date,
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

userSchema.statics.hashPassword = function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
};

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});

export default mongoose.model("User", userSchema);
