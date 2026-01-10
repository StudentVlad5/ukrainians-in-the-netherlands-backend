// Створення замовлення (Бронювання)
import mongoose from "mongoose";
import Order from "../models/orders.model.js";
import { ActiveEvents } from "../models/activeEvents.model.js";

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { activeEventID, bookingSeats, userName, userEmail, priceTotal } =
      req.body;

    // 1. Знаходимо івент
    const activeEvent = await ActiveEvents.findById(activeEventID).session(
      session
    );

    if (!activeEvent) {
      throw new Error("Active event not found");
    }

    // 2. Перевірка доступних місць
    if (activeEvent.vacancies < bookingSeats) {
      throw new Error("Not enough available seats");
    }

    // 3. Оновлюємо бронювання
    activeEvent.booking += bookingSeats;
    activeEvent.vacancies = activeEvent.seats - activeEvent.booking;

    await activeEvent.save({ session });

    // 4. Створюємо замовлення
    const order = await Order.create(
      [
        {
          activeEventID,
          eventId: activeEvent.eventId,
          userName,
          userEmail,
          bookingSeats,
          priceTotal,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(order[0]);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({
      message: error.message || "Order creation failed",
    });
  }
};

// Отримання всіх замовлень з пагінацією
export const getAllOrders = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const data = await Order.find()
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .populate("eventId activeEventID"); // Додаємо дані з пов'язаних колекцій

  const total = await Order.countDocuments();

  res.json({
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    data,
  });
};

// Отримання за ID
export const getOrderById = async (req, res) => {
  const { id } = req.params;
  const result = await Order.findById(id).populate("eventId activeEventID");
  if (!result) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.json(result);
};

// Оновлення замовлення (Коригування)
export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { bookingSeats } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(id).session(session);
    if (!order) throw new Error("Order not found");

    const activeEvent = await ActiveEvents.findById(
      order.activeEventID
    ).session(session);

    if (!activeEvent) throw new Error("Active event not found");

    const diff = bookingSeats - order.bookingSeats;

    // Якщо збільшуємо кількість квитків
    if (diff > 0 && activeEvent.vacancies < diff) {
      throw new Error("Not enough available seats");
    }

    // Коригуємо івент
    activeEvent.booking += diff;
    activeEvent.vacancies = activeEvent.seats - activeEvent.booking;
    await activeEvent.save({ session });

    // Оновлюємо замовлення
    order.bookingSeats = bookingSeats;
    order.priceTotal = bookingSeats * (order.pricePerSeat || 0);

    if (req.body.userName) order.userName = req.body.userName;
    if (req.body.userEmail) order.userEmail = req.body.userEmail;

    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json(order);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};

// Видалення
export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(id).session(session);
    if (!order) throw new Error("Order not found");

    const activeEvent = await ActiveEvents.findById(
      order.activeEventID
    ).session(session);

    if (!activeEvent) throw new Error("Active event not found");

    // Повертаємо місця
    activeEvent.booking -= order.bookingSeats;
    if (activeEvent.booking < 0) activeEvent.booking = 0;

    activeEvent.vacancies = activeEvent.seats - activeEvent.booking;
    await activeEvent.save({ session });

    await order.deleteOne({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Order deleted and seats returned" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};
