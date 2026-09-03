/**
 * One-off script: creates (or promotes) the platform's first admin account.
 * Usage: node src/scripts/seedAdmin.js admin@collabotravel.com "Strong Passw0rd!"
 */
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import mongoose from "mongoose";

async function run() {
  const [, , email, password] = process.argv;
  if (!email || !password) {
    console.error("Usage: node src/scripts/seedAdmin.js <email> <password>");
    process.exit(1);
  }

  await connectDB();
  const passwordHash = await User.hashPassword(password);

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      $setOnInsert: { fullName: "Collabo Admin", email: email.toLowerCase(), passwordHash },
      $set: { role: "admin", isEmailVerified: true },
    },
    { upsert: true, new: true }
  );

  console.log(`Admin ready: ${user.email}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
