import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ActiveEventsSchema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    // Зберігаємо як ISO Date (UTC)
    date: { type: Date, required: [true, "Event date is required"] },
    time: { type: String, required: true }, // Наприклад "18:30"
    price: { type: Number, required: true, min: 0 },
    seats: { type: Number, required: true, min: 1 },
    booking: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: function (v) {
          return v <= this.seats;
        },
        message: "Booking cannot exceed total seats",
      },
    },
    vacancies: {
      type: Number,
      default: function () {
        return this.seats - this.booking;
      },
    },
    location: {
      city: { type: String, required: true },
      address: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["active", "blocked", "archived"],
      default: "active",
    },
    type: {
      type: String,
      enum: ["online", "location"],
      default: "online",
    },
  },
  { timestamps: true, versionKey: false }
);

// Middleware: автоматично переводимо в архів, якщо дата минула
ActiveEventsSchema.pre("find", function () {
  // Цей код спрацьовує при кожному пошуку (опціонально)
});

export const ActiveEvents = model("ActiveEvent", ActiveEventsSchema);
