import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 4000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/collabo_travel",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",

  jwtSecret: process.env.JWT_SECRET || "dev-only-insecure-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || "Collabo Travel <no-reply@collabotravel.com>",
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },

  monnify: {
    apiKey: process.env.MONNIFY_API_KEY,
    secretKey: process.env.MONNIFY_SECRET_KEY,
    contractCode: process.env.MONNIFY_CONTRACT_CODE,
    baseUrl: process.env.MONNIFY_BASE_URL || "https://sandbox.monnify.com",
  },

  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY,
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
  },

  termii: {
    apiKey: process.env.TERMII_API_KEY,
    senderId: process.env.TERMII_SENDER_ID || "CollaboTravel",
  },

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,

  commissionRate: 0.1, // Collabo Travel takes 10% vs Uber's 25%
  surgeMultiplier: 1.5,
  surgeWindows: [
    { start: 6, end: 9 },
    { start: 17, end: 21 },
  ],
};
