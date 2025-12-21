import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    address: String,
    lat: Number,
    lng: Number,
  },
  { _id: false }
);

const SpecialistSchema = new mongoose.Schema(
  {
    isActive: { type: Boolean, default: true },
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    imageUrl: { type: String },
    education: { type: String },
    description: { type: String },
    rating: { type: Number, default: 0 },
    languages: [{ type: String }],
    email: { type: String },
    phone: { type: String },
    instagram: { type: String },
    telegram: { type: String },
    whatsapp: { type: String },
    portfolio: [{ type: String }],
    minOrder: { type: String },
    location: LocationSchema,
  },
  { timestamps: true }
);

export default mongoose.model("Specialist", SpecialistSchema);
