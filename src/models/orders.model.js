import mongoose from "mongoose";
const { Schema } = mongoose;

const ordersSchema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    activeEventID: {
      type: Schema.Types.ObjectId,
      ref: "ActiveEvent",
      required: true,
    },
    userName: { type: String, required: true, minlength: 2 },
    userEmail: {
      type: String,
      required: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please fill a valid email address",
      ],
    },
    bookingSeats: { type: Number, required: true, min: 1 },
    priceTotal: { type: Number, required: true },
    status: {
      type: String,
      enum: ["new", "accept", "reject"],
      default: "new",
    },
  },
  { timestamps: true, versionKey: false }
);

export const Orders = model("Order", ordersSchema);
