import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quote: { type: String, required: true },
  service: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Testimonial", testimonialSchema);
