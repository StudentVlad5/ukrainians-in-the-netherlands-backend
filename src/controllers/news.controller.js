import { News } from "../models/news.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createNews = async (req, res) => {
  try {
    // Дані з форми приходять у полі "data" як рядок
    const data = JSON.parse(req.body.data);

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    if (req.files?.imageUrl?.[0]) {
      req.body.imageUrl = req.files.imageUrl[0].path;
    }

    await newNews.save();
    res.status(201).json(newNews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Error fetching news" });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "Not found" });

    // Видаляємо картинку з Cloudinary
    if (news.publicId) {
      await cloudinary.uploader.destroy(news.publicId);
    }

    await news.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting news" });
  }
};
