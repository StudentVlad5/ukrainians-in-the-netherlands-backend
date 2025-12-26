import Specialist from "../models/specialist.model.js";

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
