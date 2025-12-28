import { Schema, model } from "mongoose";

const MultilangSchema = {
  uk: { type: String, default: "" },
  en: { type: String, default: "" },
  nl: { type: String, default: "" },
  de: { type: String, default: "" },
};

const NewsSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    date: { type: String, required: true }, // Зберігаємо як ISO рядок
    imageUrl: { type: String, required: true },
    publicId: { type: String }, // Для видалення файлу з Cloudinary
    sourceUrl: { type: String },
    isActive: { type: Boolean, default: true },

    category: MultilangSchema,
    title: MultilangSchema,
    shortDescription: MultilangSchema,

    paragraphs: [
      {
        title: MultilangSchema,
        body: MultilangSchema,
      },
    ],
  },
  { timestamps: true }
);

export const News = model("News", NewsSchema);
