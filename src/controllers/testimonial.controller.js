import Testimonial from "../models/testimonial.model.js";

// Отримати всі відгуки
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    і;
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Помилка при отриманні відгуків", error });
  }
};

// Додати новий відгук (опціонально)
export const createTestimonial = async (req, res) => {
  try {
    const { name, quote, service } = req.body;
    const newTestimonial = new Testimonial({ name, quote, service });
    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (error) {
    res.status(400).json({ message: "Помилка при створенні відгуку", error });
  }
};
