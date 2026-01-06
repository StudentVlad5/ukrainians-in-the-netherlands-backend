import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Схема для перекладів з вбудованими повідомленнями про помилки
const translatableStringSchema = {
  uk: { type: String, required: [true, "Ukrainian translation is required"] },
  nl: { type: String, required: [true, "Dutch translation is required"] },
  de: { type: String, required: [true, "German translation is required"] },
  en: { type: String, required: [true, "English translation is required"] },
};

const EventsSchema = new Schema(
  {
    title: translatableStringSchema,
    description: translatableStringSchema,
    article_event: {
      type: String,
      required: [true, "Article event is required"],
      trim: true,
    },
    specialistId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    duration: { type: String, required: true },
    category: { type: String, required: true },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },
    images: {
      type: [String],
      validate: {
        validator: (val) => val.length <= 3,
        message: "You can upload maximum 3 images",
      },
    },
  },
  { timestamps: true, versionKey: false }
);

export const Events = model("Event", EventsSchema);
