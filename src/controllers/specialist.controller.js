import Specialist from "../models/specialist.model.js";

/** CREATE */
export const createSpecialist = async (req, res) => {
  try {
    const specialist = await Specialist.create(req.body);
    res.status(201).json(specialist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/** READ ALL */
export const getSpecialists = async (req, res) => {
  try {
    const specialists = await Specialist.find();
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

/** UPDATE */
export const updateSpecialist = async (req, res) => {
  try {
    const specialist = await Specialist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(specialist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/** SOFT DELETE / HIDE */
export const hideSpecialist = async (req, res) => {
  try {
    const specialist = await Specialist.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    res.json(specialist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/** DELETE */
export const deleteSpecialist = async (req, res) => {
  try {
    await Specialist.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
