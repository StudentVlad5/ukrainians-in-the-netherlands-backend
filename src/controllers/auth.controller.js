import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const JWT_SECRET = process.env.SECRET_KEY || "supersecretjwt";

// Реєстрація
export const register = async (req, res) => {
  try {
    const { email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashed,
      phone,
      emailVerified: false,
      phoneVerified: false,
      role: "user",
    });

    res
      .status(201)
      .json({ message: "User created", user: { email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Registration error", error: err.message });
  }
};

//  Логін
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email та пароль є обов'язковими" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Неправильний email або пароль" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Неправильний email або пароль" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });
    user.password = undefined;
    res.status(200).json({
      token,
      user: {
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Помилка сервера під час входу",
      error: error.message,
    });
  }
};

// Логаут
export async function logout(req, res) {
  res.status(200).json({ message: "Logged out successfully" });
}
