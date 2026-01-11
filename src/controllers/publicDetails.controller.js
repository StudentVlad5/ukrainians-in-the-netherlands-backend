import Specialist from "../models/specialist.model.js";
import Testimonial from "../models/testimonial.model.js";

export const getPublicSpecialists = async (req, res) => {
  try {
    let specialists = [];
    const limit = parseInt(req.query.limit);
    if (limit) {
      specialists = await Specialist.find({ isActive: true })
        .sort({ rating: -1 })
        .limit(limit);
    } else {
      specialists = await Specialist.find({ isActive: true }).sort({
        rating: -1,
      });
    }
    res.json(specialists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublicProductsWithLimits = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8; // Співпадає з фронтендом
    const skip = (page - 1) * limit;

    // Отримуємо продукти
    const products = await Product.find({ status: "active" })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Отримуємо загальну кількість активних продуктів
    const total = await Product.countDocuments({ status: "active" });

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** READ ONE */
export const getPublicSpecialistById = async (req, res) => {
  try {
    const specialist = await Specialist.findById(req.params.id);
    if (!specialist) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(specialist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

import Product from "../models/product.model.js";
import { ActiveEvents } from "../models/activeEvents.model.js";

export const getPublicProducts = async (req, res) => {
  try {
    let products = [];
    const limit = parseInt(req.query.limit);
    if (limit) {
      products = await Product.find({ status: "active" })
        .sort({ updatedAt: -1 })
        .limit(limit);
    } else {
      products = await Product.find({ status: "active" }).sort({
        updatedAt: -1,
      });
    }
    console.log("products", products);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** READ ONE */
export const getPublicProductById = async (req, res) => {
  try {
    // Шукаємо продукт і через populate додаємо дані автора
    // Припускаємо, що модель автора називається User або Specialist
    const product = await Product.findById(req.params.id).populate({
      path: "user",
      select: "name phone telegram whatsapp email", // вибираємо лише потрібні поля
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// SERVICES
export const gePublicServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const specialists = await Specialist.find({ isActive: true })
      .select("name specialty imageUrl minOrder languages location portfolio")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 1 });

    const total = await Specialist.countDocuments({ isActive: true });

    const services = specialists.map((item) => {
      const displayImage =
        item.portfolio && item.portfolio.length > 0
          ? item.portfolio[0]
          : item.imageUrl;

      return {
        id: item._id,
        image: displayImage,
        name: item.name,
        specialty: item.specialty,
        price: item.minOrder,
        languages: item.languages,
        location: item.location?.address || "",
        profileLink: `${item._id}`,
      };
    });

    res.status(200).json({
      success: true,
      data: services,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Помилка при отриманні списку сервісів",
      error: error.message,
    });
  }
};

// ACTIVE EVENTS
export const gePublicActiveEvents = async (req, res) => {
  const { page = 1, limit = 10, search = "", filter = "all" } = req.query;
  const skip = (page - 1) * limit;
  const now = new Date();

  try {
    let matchQuery = {};

    // 1. Фільтрація за статусом та часом
    if (filter === "active") {
      matchQuery.status = "active";
      matchQuery.date = { $gte: now };
    } else if (filter === "archived") {
      matchQuery.$or = [{ status: "archived" }, { date: { $lt: now } }];
    }

    const pipeline = [
      {
        $lookup: {
          from: "events", // назва колекції в БД
          localField: "eventId",
          foreignField: "_id",
          as: "parentEvent",
        },
      },
      { $unwind: "$parentEvent" },
      {
        $match: {
          ...matchQuery,
          // 2. Пошук по всіх мовах одночасно (Title та Description)
          $or: [
            { "parentEvent.title.uk": { $regex: search, $options: "i" } },
            { "parentEvent.title.en": { $regex: search, $options: "i" } },
            { "parentEvent.title.de": { $regex: search, $options: "i" } },
            { "parentEvent.title.nl": { $regex: search, $options: "i" } },
            { "parentEvent.description.uk": { $regex: search, $options: "i" } },
            { "parentEvent.description.en": { $regex: search, $options: "i" } },
            { "parentEvent.description.de": { $regex: search, $options: "i" } },
            { "parentEvent.description.nl": { $regex: search, $options: "i" } },
          ],
        },
      },
      {
        // 3. Передаємо повні об'єкти перекладів та масиви зображень
        $project: {
          _id: 1,
          date: 1,
          time: 1,
          price: 1,
          status: 1,
          "parentEvent.title": 1, // Передасть { uk, en, de, nl }
          "parentEvent.description": 1, // Передасть { uk, en, de, nl }
          "parentEvent.images": 1, // Передає масив рядків
          "parentEvent.category": 1,
          "parentEvent.duration": 1,
        },
      },
      { $sort: { date: 1 } },
      { $skip: Number(skip) },
      { $limit: Number(limit) },
    ];

    const data = await ActiveEvents.aggregate(pipeline);

    const totalCountResult = await ActiveEvents.aggregate([
      ...pipeline.slice(0, 3),
      { $count: "count" },
    ]);

    const total = totalCountResult[0]?.count || 0;

    res.json({
      success: true,
      data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Контролер для отримання одного івенту за ID
import mongoose from "mongoose"; // Переконайтеся, що цей імпорт є зверху файлу

export const getPublicActiveEventById = async (req, res) => {
  const { id } = req.params;

  try {
    // Перевірка чи є ID валідним ObjectId перед запитом
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });
    }

    const data = await ActiveEvents.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "parentEvent",
        },
      },
      { $unwind: "$parentEvent" },
      {
        $lookup: {
          from: "specialists",
          localField: "parentEvent.specialistId",
          foreignField: "_id",
          as: "specialist",
        },
      },
      { $unwind: { path: "$specialist", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          date: 1,
          time: 1,
          price: 1,
          seats: 1,
          booking: 1,
          vacancies: { $subtract: ["$seats", "$booking"] },
          location: 1,
          type: 1,
          status: 1,
          "parentEvent.title": 1,
          "parentEvent.description": 1,
          "parentEvent.article_event": 1,
          "parentEvent.images": 1,
          "parentEvent.duration": 1,
          "parentEvent.category": 1,
          "parentEvent._id": 1,
          "specialist.name": 1,
          "specialist.specialty": 1,
          "specialist.imageUrl": 1,
          "specialist.rating": 1,
          "specialist.description": 1,
        },
      },
    ]);

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res.json({ success: true, data: data[0] });
  } catch (error) {
    console.error("Aggregation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    console.error("Деталі помилки:", error);
    res.status(500).json({
      message: "Помилка при отриманні відгуків",
      error: error.message,
    });
  }
};
