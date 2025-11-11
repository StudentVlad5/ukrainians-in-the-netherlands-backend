import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

console.log("Cloudinary env:", {
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
  CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET ? "***" : undefined,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "ukrainians_users",
    resource_type: "auto",
    allowedFormats: ["jpg", "png", "jpeg", "webp", "gif"],
  },
  filename: (req, res, cb) => {
    cb(null, res.originalname);
  },
  transformation: [{ width: 200, height: 200, crop: "limit" }],
});

const uploadCloud = multer({ storage });

export default uploadCloud;
