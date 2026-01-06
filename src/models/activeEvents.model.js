import mongoose from "mongoose";
const { Schema } = mongoose;

const ActiveEventsSchema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    date: { type: Date, required: [true, "Event date is required"] },
    time: { type: String, required: [true, "Event time is required"] },
    price: { type: Number, required: true, min: 0 },
    seats: { type: Number, required: true, min: 1 },
    booking: { type: Number, default: 0 },
    vacancies: {
      type: Number,
      required: true,
      default: function () {
        return this.seats;
      },
    },
    location: {
      city: { type: String, required: true },
      address: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
  },
  { timestamps: true, versionKey: false }
);

export const ActiveEvents = model("ActiveEvent", ActiveEventsSchema);
