import Order from "../models/orders.model.js";

// Створення замовлення (Бронювання)
export const createOrder = async (req, res) => {
  const result = await Order.create(req.body);
  res.status(201).json(result);
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
  const result = await Order.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.json(result);
};

// Видалення
export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  const result = await Order.findByIdAndDelete(id);
  if (!result) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.json({ message: "Order deleted" });
};
