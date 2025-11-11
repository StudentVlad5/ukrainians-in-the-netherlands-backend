import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["user", "seller", "admin"], default: "user" },

  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  avatarUrl: { type: String },
  city: { type: String, trim: true },

  phone: { type: String, trim: true },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },

  contacts: {
    website: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    facebook: { type: String, trim: true },
  },

  locale: { type: String, enum: ["ua", "nl", "de", "en"], default: "ua" },
  status: {
    type: String,
    enum: ["active", "inactive", "blocked"],
    default: "active",
  },

  createdAt: { type: Date, default: Date.now },
});

// Віртуальне поле для 'fullName' (зручно для відображення)
UserSchema.virtual("fullName").get(function () {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  if (this.firstName) {
    return this.firstName;
  }
  return this.email; // Повертаємо email, якщо_імені немає
});

// Переконайтеся, що віртуальні поля включені в JSON
UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

export default models.User || model("User", UserSchema);
