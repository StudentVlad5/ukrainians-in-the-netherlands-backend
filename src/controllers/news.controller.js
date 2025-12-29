import { deleteFromCloudinary } from "../middlewares/uploadMiddleware.js";
import { News } from "../models/news.model.js";
import mongoose from "mongoose";

// --- CREATE ---
export const createNews = async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Створюємо новий об'єкт на основі даних з JSON + шлях до картинки
    const newNews = new News({
      ...data,
      imageUrl: req.file.path, // Cloudinary зазвичай повертає path або secure_url
    });

    await newNews.save();
    res.status(201).json(newNews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- GET ALL (з пагінацією) ---
export const getAllNews = async (req, res) => {
  try {
    // Отримуємо параметри з URL: /api/news?page=1&limit=10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await News.countDocuments();
    const news = await News.find()
      .sort({ date: -1 }) // Свіжі спочатку
      .skip(skip)
      .limit(limit);

    res.json({
      news,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalNews: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching news" });
  }
};

// --- UPDATE ---
export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const data = JSON.parse(req.body.data);

    let existingNews = await News.findById(id);
    if (!existingNews)
      return res.status(404).json({ message: "News not found" });

    // Якщо завантажено нове фото
    if (req.file) {
      // Видаляємо старе фото з Cloudinary
      if (existingNews.imageUrl) {
        await deleteFromCloudinary(existingNews.imageUrl);
      }
      data.imageUrl = req.file.path;
    }

    const updatedNews = await News.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true } // Повернути вже оновлений об'єкт
    );

    res.json(updatedNews);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating news", error: error.message });
  }
};

// --- DELETE ---
export const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "Not found" });

    if (news.imageUrl) {
      await deleteFromCloudinary(news.imageUrl);
    }

    await news.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting news" });
  }
};

export const getNewsBySlugOrId = async (req, res) => {
  const { idOrSlug } = req.params;

  console.log("idOrSlug:", idOrSlug);

  let query;

  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    query = { _id: idOrSlug };
  } else {
    query = { slug: idOrSlug };
  }

  const news = await News.findOne(query);

  if (!news) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(news);
};
