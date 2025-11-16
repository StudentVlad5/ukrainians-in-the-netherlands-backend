import User from "../models/user.model.js";

export async function getMyProfile(req, res) {
  // req.user.id додається вашим authMiddleware після перевірки JWT
  const user = await User.findById(req.user.id).select("-password"); // Знову '-password'
  if (!user) {
    return res.status(404).json({ message: "Користувача не знайдено" });
  }
  res.status(200).json(user);
}

export async function updateMyProfile(req, res) {
  // Деструктуруємо всі можливі поля з req.body
  const { firstName, lastName, city, phone, contacts, locale, role, status } =
    req.body;

  const fieldsToUpdate = {};

  if (firstName !== undefined) fieldsToUpdate.firstName = firstName;
  if (lastName !== undefined) fieldsToUpdate.lastName = lastName;
  if (city !== undefined) fieldsToUpdate.city = city;
  if (phone !== undefined) fieldsToUpdate.phone = phone;
  if (locale !== undefined) fieldsToUpdate.locale = locale;
  if (role !== undefined) fieldsToUpdate.role = role;
  if (status !== undefined) fieldsToUpdate.status = status;
  if (
    typeof contacts === "object" &&
    contacts !== null &&
    !Array.isArray(contacts)
  ) {
    for (const key in contacts) {
      if (Object.prototype.hasOwnProperty.call(contacts, key)) {
        fieldsToUpdate[`contacts.${key}`] = contacts[key];
      }
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: fieldsToUpdate },
    { new: true, runValidators: true }
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
