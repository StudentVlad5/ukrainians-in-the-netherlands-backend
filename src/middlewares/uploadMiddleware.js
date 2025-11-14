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

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "ukrainians_users",
    resource_type: "image",
    format: "webp",
    allowedFormats: ["jpg", "png", "jpeg", "webp", "gif"],
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  transformation: [{ width: 400, crop: "limit" }, { quality: "auto:good" }],
});

const uploadCloud = multer({ storage });

export default uploadCloud;
