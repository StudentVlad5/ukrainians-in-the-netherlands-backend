import { Categories } from "../models/categories.model.js";

export const addCategory = async (req, res) => {
  try {
    const newCategory = await Categories.create(req.body);

    res.status(201).json(newCategory);
  } catch (error) {
    if (error.name === "ValidationError")
      return res.status(400).json({ details: error.message });
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const result = await Categories.find().sort({ "title.uk": 1 });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

export const updateCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCategory = await Categories.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedCategory)
      return res.status(404).json({ message: "Category not found" });
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Error updating category" });
  }
};

export const deleteCategoryById = async (req, res) => {
  try {
    const result = await Categories.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
};

export const getCategoriesById = async (req, res) => {
  try {
    const result = await Categories.findById(req.params.id);
    if (!result) return res.status(404).json({ message: "Not found" });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category" });
  }
};
