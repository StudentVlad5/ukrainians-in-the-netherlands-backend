import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwt";

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
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token, user: { email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

// Логаут
export async function logout(req, res) {
  res.status(200).json({ message: "Logged out successfully" });
}
