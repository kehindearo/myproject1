import { v2 as cloudinary } from "cloudinary";
import { env } from "../../config/env.js";

let configured = false;

function ensureConfigured() {
  if (configured || !env.cloudinary.cloudName) return;
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
  });
  configured = true;
}

/**
 * Uploads a base64/data-URI or local file path to Cloudinary with automatic
 * compression. Used for driver documents, vehicle photos, and avatars.
 */
export async function uploadImage(source, folder = "collabo-travel") {
  ensureConfigured();
  if (!env.cloudinary.cloudName) {
    console.log(`[cloudinary:dev] would upload to folder=${folder}`);
    return { secure_url: source, simulated: true };
  }
  return cloudinary.uploader.upload(source, {
    folder,
    quality: "auto",
    fetch_format: "auto",
  });
}
