import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    address: { type: String },
    lat: { type: Number },
    lng: { type: Number },
  },
  { _id: false }
);

const MultiLangSchema = new mongoose.Schema(
  {
    uk: { type: String },
    en: { type: String },
    nl: { type: String },
    de: { type: String },
  },
  { _id: false }
);

const SpecialistSchema = new mongoose.Schema(
  {
    isActive: { type: Boolean, default: true },

    name: { type: MultiLangSchema, required: true },
    specialty: { type: MultiLangSchema, required: true },
    education: { type: MultiLangSchema },
    description: { type: MultiLangSchema },

    imageUrl: { type: String },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    languages: {
      type: [{ type: String, enum: ["uk", "en", "nl", "de"] }],
      default: [],
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    phone: { type: String },
    instagram: { type: String },
    telegram: { type: String },
    whatsapp: { type: String },

    portfolio: [{ type: String }],

    minOrder: { type: Number, required: true },

    location: LocationSchema,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Specialist", SpecialistSchema);
