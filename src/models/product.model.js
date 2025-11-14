const mongoose = require("mongoose");
const { Schema } = mongoose;

// Схема для перекладних рядків
const translatableStringSchema = {
  uk: { type: String, required: true },
  nl: { type: String, required: true },
  de: { type: String, required: true },
  en: { type: String, required: true },
};

// Основна схема товару
const ProductSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Посилання на модель User
      required: true,
    },

    title: {
      type: translatableStringSchema,
      required: true,
    },

    description: {
      type: translatableStringSchema,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String, // Можна замінити на ObjectId, якщо є модель Category
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    images: {
      type: [String], // URL фотографій
      validate: [(val) => val.length <= 3, "Можна завантажити максимум 3 фото"],
    },

    location: {
      city: { type: String, required: true },
      postalCode: { type: String },
      address: { type: String },
    },

    deliveryOptions: {
      pickup: { type: Boolean, default: false },
      shipping: { type: Boolean, default: false },
    },

    condition: {
      type: String,
      enum: ["new", "used"],
      default: "new",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

// Індекси для пошуку
ProductSchema.index({
  "title.uk": "text",
  "title.nl": "text",
  "title.de": "text",
  "title.en": "text",
  "description.uk": "text",
  "description.nl": "text",
  "description.de": "text",
  "description.en": "text",
  tags: 1,
  "location.city": 1,
});

// Експорт моделі
module.exports = mongoose.model("Product", ProductSchema);
