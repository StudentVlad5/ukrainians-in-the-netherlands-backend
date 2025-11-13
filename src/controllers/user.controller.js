import User from "../models/user.model.js";

export async function getMyProfile(req, res) {
  // req.user.id додається вашим authMiddleware після перевірки JWT
  const user = await User.findById(req.user.id).select("-password"); // Знову '-password'
  if (!user) {
    return res.status(404).json({ message: "Користувача не знайдено" });
  }
  res.status(200).json(user);
}

// Контролер для PUT /api/profile/me
export async function updateMyProfile(req, res) {
  // Забороняємо оновлювати email, role, password через цей маршрут
  const { firstName, lastName, city, phone, contacts, locale } = req.body;

  const fieldsToUpdate = {
    firstName,
    lastName,
    city,
    phone,
    contacts,
    locale,
  };

  // Тут також можна додати логіку для 'status', якщо користувач сам себе деактивує
  if (req.body.status === "inactive") {
    fieldsToUpdate.status = "inactive";
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: fieldsToUpdate },
    { new: true, runValidators: true } // 'new: true' - повернути оновлений документ
  ).select("-password");

  res.status(200).json(user);
}

// Контролер для POST /api/profile/avatar
export async function uploadAvatar(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Файл не надано." });
    }

    const avatarUrl = req.file.path;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatarUrl: avatarUrl },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Аватар оновлено",
      avatarUrl: updatedUser.avatarUrl,
    });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    res
      .status(500)
      .json({ message: "Помилка сервера під час завантаження аватара." });
  }
}
