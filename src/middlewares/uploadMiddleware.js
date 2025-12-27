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

/**
 * AVATAR UPLOAD
 * 1 user = 1 avatar
 * always 400x400
 */
export const uploadAvatar = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {
      folder: "users/avatars",
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: (req) => req.user.id,
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "auto" },
        { quality: "auto", fetch_format: "auto" },
      ],
    },
  }),
});

/**
 * PORTFOLIO UPLOAD
 * multiple images
 * keep proportions
 */
export const uploadPortfolio = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {
      folder: "specialists/portfolio",
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [
        { width: 800, crop: "fit" },
        { quality: "auto", fetch_format: "auto" },
      ],
    },
  }),
});

export const uploadGoods = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {
      folder: "specialists/goods",
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [
        { width: 400, crop: "fit" },
        { quality: "auto", fetch_format: "auto" },
      ],
    },
  }),
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: (req, file) => {
    if (file.fieldname === "imageUrl") {
      return {
        folder: "specialists/avatars",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "auto" },
          { quality: "auto", fetch_format: "auto" },
        ],
      };
    }

    if (file.fieldname === "portfolio") {
      return {
        folder: "specialists/portfolio",
        transformation: [
          { width: 800, crop: "fit" },
          { quality: "auto", fetch_format: "auto" },
        ],
      };
    }
  },
});

export const uploadSpecialistImages = multer({
  storage,
}).fields([
  { name: "imageUrl", maxCount: 1 },
  { name: "portfolio", maxCount: 10 },
]);

export const deleteFromCloudinary = async (url) => {
  if (!url) return;

  const publicId = url.split("/").pop().split(".")[0];
  await cloudinary.uploader.destroy(publicId);
};
