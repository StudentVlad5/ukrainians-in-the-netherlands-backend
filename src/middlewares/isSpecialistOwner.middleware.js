import Specialist from "../models/specialist.model.js";
import User from "../models/user.model.js";

export const isSpecialistOwner = async (req, res, next) => {
  try {
    const userId = req.user.id; // Отримано з verifyToken
    const { id } = req.params;

    const specialist = await Specialist.findById(id);

    if (!specialist) {
      return res.status(404).json({ message: "Specialist not found" });
    }

    // Отримуємо повні дані користувача (якщо роль не зашита в токен)
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "User not found" });

    // ЛОГІКА ДОСТУПУ:
    // 1. Адмін може все
    // 2. Селлер може редагувати тільки своє
    const isAdmin = user.role === "admin";
    const isOwner = specialist.author.toString() === userId;

    if (isAdmin || isOwner) {
      // Зберігаємо об'єкт спеціаліста в req, щоб не шукати його знову в контролері
      req.specialist = specialist;
      return next();
    }

    return res.status(403).json({
      message: "Access denied. You are not the owner or an admin.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during authorization" });
  }
};
