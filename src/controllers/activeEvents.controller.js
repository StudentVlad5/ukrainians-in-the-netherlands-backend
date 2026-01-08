import { ActiveEvents } from "../models/activeEvents.model.js";
import mongoose from "mongoose";

/**
 * GET /active-events
 * Список активованих івентів (з пагінацією, пошуком, фільтрами)
 */
export const getActiveEvents = async (req, res) => {
  const { page = 1, limit = 10, search = "", filter = "all" } = req.query;
  const skip = (page - 1) * limit;
  const now = new Date();

  try {
    let matchQuery = {};

    // Фільтрація
    if (filter === "active") {
      matchQuery.status = "active";
      matchQuery.date = { $gte: now };
    }

    if (filter === "archived") {
      matchQuery.$or = [{ status: "archived" }, { date: { $lt: now } }];
    }

    const pipeline = [
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
        $match: {
          ...matchQuery,
          "parentEvent.title.uk": { $regex: search, $options: "i" },
        },
      },
      { $sort: { date: 1 } },
      { $skip: Number(skip) },
      { $limit: Number(limit) },
    ];

    const data = await ActiveEvents.aggregate(pipeline);

    const total = await ActiveEvents.aggregate([
      ...pipeline.slice(0, 3),
      { $count: "count" },
    ]);

    res.json({
      data,
      total: total[0]?.count || 0,
      totalPages: Math.ceil((total[0]?.count || 0) / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /active-events/:id
 * Отримати один сеанс
 */
export const getActiveEventById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const event = await ActiveEvents.findById(id).populate("eventId");

    if (!event) {
      return res.status(404).json({ message: "Active event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /active-events
 * Створення нового сеансу
 */
export const addActiveEvent = async (req, res) => {
  try {
    const newEvent = await ActiveEvents.create(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * PUT /active-events/:id
 * Оновлення сеансу
 */
export const updateActiveEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await ActiveEvents.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Active event not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * DELETE /active-events/:id
 * Видалення або архівація
 */
export const deleteActiveEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // М'яке видалення (рекомендовано)
    const deleted = await ActiveEvents.findByIdAndUpdate(
      id,
      { status: "archived" },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ message: "Active event not found" });
    }

    res.json({ message: "Active event archived", deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
