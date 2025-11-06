import mongoose from "mongoose";
const { Schema } = mongoose;

const ListingSchema = new Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: { type: String, enum: ["product", "service"], required: true },
  title: { ua: String, nl: String, de: String },
  description: { ua: String, nl: String, de: String },
  price: Number,
  currency: { type: String, default: "EUR" },
  category: String,
  tags: [String],
  images: [String],
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number],
  },
  createdAt: { type: Date, default: Date.now },
});

ListingSchema.index({ location: "2dsphere" });
export default mongoose.model("Listing", ListingSchema);
