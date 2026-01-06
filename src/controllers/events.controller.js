import { Events } from "../models/event.model.js";
import { deleteFromCloudinary } from "../middlewares/uploadMiddleware.js";

// --- CREATE ---
export const addEvent = async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);

    // Обробка декількох файлів (якщо використовуєте upload.array('images', 3))
    if (req.files && req.files.length > 0) {
      data.images = req.files.map((file) => file.path);
    }

    const newEvent = await Events.create(data);
    res.status(201).json(newEvent);
  } catch (error) {
    if (error.name === "ValidationError")
      return res.status(400).json({ details: error.message });
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- GET ALL (з пагінацією) ---
export const getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Events.countDocuments();
    const events = await Events.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      events,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalEvents: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
};

// --- UPDATE ---
export const updateEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = JSON.parse(req.body.data);

    let existingEvent = await Events.findById(id);
    if (!existingEvent)
      return res.status(404).json({ message: "Event not found" });

    // Якщо завантажено нові фото
    if (req.files && req.files.length > 0) {
      // Видаляємо старі фото з Cloudinary
      if (existingEvent.images && existingEvent.images.length > 0) {
        await Promise.all(
          existingEvent.images.map((img) => deleteFromCloudinary(img))
        );
      }
      data.images = req.files.map((file) => file.path);
    }

    const updatedEvent = await Events.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating event", error: error.message });
  }
};

// --- DELETE ---
export const deleteEventById = async (req, res) => {
  try {
    const event = await Events.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Not found" });

    // Видаляємо всі фото івенту з Cloudinary
    if (event.images && event.images.length > 0) {
      await Promise.all(event.images.map((img) => deleteFromCloudinary(img)));
    }

    await event.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event" });
  }
};

// --- GET BY ID ---
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Events.findById(id);
    if (!event) return res.status(404).json({ message: "Not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event" });
  }
};
