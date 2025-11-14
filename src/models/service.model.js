const mongoose = require("mongoose");
const { Schema } = mongoose;

// Схема перекладного тексту
const translatableStringSchema = {
  uk: { type: String, required: true },
  nl: { type: String, required: true },
  de: { type: String, required: true },
  en: { type: String, required: true },
};

// Основна схема сервісу / спеціаліста
const ServiceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Посилання на модель User
      required: true,
    },

    specialistName: {
      type: String,
      required: true,
    },

    serviceName: {
      type: translatableStringSchema,
      required: true,
    },

    specialistDescription: {
      type: translatableStringSchema,
      required: false,
    },

    serviceDescription: {
      type: translatableStringSchema,
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    avatar: {
      type: String, // URL одного фото
      default: null,
    },

    location: {
      city: { type: String, required: true },
      online: { type: Boolean, default: false },
    },

    pricingModel: {
      type: String,
      enum: ["hourly", "fixed", "free_consultation"],
      required: true,
    },

    price: {
      type: Number,
      required: false,
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

// Індекс для пошуку
ServiceSchema.index({
  "serviceName.uk": "text",
  "serviceName.nl": "text",
  "serviceName.de": "text",
  "serviceName.en": "text",
  "specialistDescription.uk": "text",
  "specialistDescription.nl": "text",
  "specialistDescription.de": "text",
  "specialistDescription.en": "text",
  tags: 1,
  "location.city": 1,
});

// Експорт моделі
module.exports = mongoose.model("Service", ServiceSchema);
