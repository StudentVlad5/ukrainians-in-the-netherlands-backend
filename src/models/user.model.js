import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  role: { type: String, enum: ["user", "seller", "admin"], default: "user" },
  locale: { type: String, enum: ["ua", "nl", "de", "en"], default: "ua" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema);
