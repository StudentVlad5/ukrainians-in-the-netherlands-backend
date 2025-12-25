import { deleteFromCloudinary } from "../middlewares/uploadMiddleware.js";
import Specialist from "../models/specialist.model.js";
import parseIfString from "../helper/parseIfString.js";

/** CREATE */
export const createSpecialist = async (req, res) => {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  [
    "name",
    "specialty",
    "education",
    "description",
    "location",
    "languages",
  ].forEach((field) => {
    if (req.body[field]) {
      req.body[field] = parseIfString(req.body[field]);
    }
  });

  if (req.files?.imageUrl?.[0]) {
    req.body.imageUrl = req.files.imageUrl[0].path;
  }

  if (req.files?.portfolio) {
    req.body.portfolio = req.files.portfolio.map((f) => f.path);
  }

  try {
    const specialist = await Specialist.create({
      ...req.body,
      author: req.user.id,
    });

    res.status(201).json(specialist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/** UPDATE */
export const updateSpecialist = async (req, res) => {
  try {
    const specialist = req.specialist;

    const updateData = { ...req.body };
    [
      "name",
      "specialty",
      "education",
      "description",
      "location",
      "languages",
    ].forEach((field) => {
      if (updateData[field]) {
        updateData[field] = parseIfString(updateData[field]);
      }
    });

    if (req.files?.imageUrl?.[0]) {
      if (specialist.imageUrl) await deleteFromCloudinary(specialist.imageUrl);
      updateData.imageUrl = req.files.imageUrl[0].path;
    }

    if (req.files?.portfolio?.length) {
      if (Array.isArray(specialist.portfolio)) {
        for (const img of specialist.portfolio) {
          await deleteFromCloudinary(img);
        }
      }
      updateData.portfolio = req.files.portfolio.map((f) => f.path);
    }

    const updated = await Specialist.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/** READ ALL */
export const getSpecialists = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let filter = {};
    if (userRole !== "admin") {
      filter = { author: userId };
    }
    const specialists = await Specialist.find(filter);

    res.json(specialists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** READ ONE */
export const getSpecialistById = async (req, res) => {
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

/** DELETE */
export const deleteSpecialist = async (req, res) => {
  try {
    const specialist = req.specialist;

    if (specialist.imageUrl) {
      await deleteFromCloudinary(specialist.imageUrl);
    }

    if (specialist.portfolio && specialist.portfolio.length > 0) {
      await Promise.all(
        specialist.portfolio.map((imgUrl) => deleteFromCloudinary(imgUrl))
      );
    }
    await Specialist.findByIdAndDelete(specialist._id);

    res.json({
      message: "Specialist and all associated images deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
