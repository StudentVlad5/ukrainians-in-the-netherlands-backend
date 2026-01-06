import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Схема для перекладів з вбудованими повідомленнями про помилки
const translatableStringSchema = {
  uk: { type: String, required: [true, "Ukrainian translation is required"] },
  nl: { type: String, required: [true, "Dutch translation is required"] },
  de: { type: String, required: [true, "German translation is required"] },
  en: { type: String, required: [true, "English translation is required"] },
};

const categoriesSchema = new Schema(
  {
    title: translatableStringSchema,
  },
  { timestamps: true, versionKey: false }
);

export const Categories = model("Category", categoriesSchema);
