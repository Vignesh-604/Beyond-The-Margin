import mongoose from "mongoose";
import ApiResponse from "../utils/ApiResponse.js";
import Category from "../models/categories.model.js";

// Add a new category
export const addCategory = async (req, res) => {
  const { category, subcategories = [] } = req.body;

  try {
    const existing = await Category.findOne({ category });
    if (existing) {
      return res.status(400).json(new ApiResponse(400, null, "Category already exists"));
    }

    const newCategory = await Category.create({ category, subcategories });
    return res.status(201).json(new ApiResponse(201, newCategory, "Category created successfully"));
  } catch (err) {
    return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
};

// Add subcategories to an existing category
export const addSubcategories = async (req, res) => {
  const { categoryId } = req.params;
  const { subcategories } = req.body;

  if (!mongoose.isValidObjectId(categoryId)) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid category ID"));
  }

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json(new ApiResponse(404, null, "Category not found"));
    }

    const uniqueSubs = subcategories.filter(sub => !category.subcategories.includes(sub));
    category.subcategories.push(...uniqueSubs);
    await category.save();

    return res.status(200).json(new ApiResponse(200, category, "Subcategories added successfully"));
  } catch (err) {
    return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
};

// Update category or subcategories
export const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { category, subcategories } = req.body;

  if (!mongoose.isValidObjectId(categoryId)) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid category ID"));
  }

  try {
    const updated = await Category.findByIdAndUpdate(
      categoryId,
      { ...(category && { category }), ...(subcategories && { subcategories }) },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json(new ApiResponse(404, null, "Category not found"));
    }

    return res.status(200).json(new ApiResponse(200, updated, "Category updated successfully"));
  } catch (err) {
    return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
};

// Delete category or specific subcategory
export const deleteCategoryOrSubcategory = async (req, res) => {
  const { categoryId } = req.params;
  const { subcategory } = req.query;

  if (!mongoose.isValidObjectId(categoryId)) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid category ID"));
  }

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json(new ApiResponse(404, null, "Category not found"));
    }

    if (subcategory) {
      // Delete subcategory
      const index = category.subcategories.indexOf(subcategory);
      if (index === -1) {
        return res.status(404).json(new ApiResponse(404, null, "Subcategory not found"));
      }

      category.subcategories.splice(index, 1);
      await category.save();

      return res.status(200).json(new ApiResponse(200, category, "Subcategory removed successfully"));
    } else {
      // Delete entire category
      await category.deleteOne();
      return res.status(200).json(new ApiResponse(200, null, "Category deleted successfully"));
    }
  } catch (err) {
    return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).select("category subcategories");

    const formatted = categories.map((cat) => ({
      category: cat.category,
      subcategories: cat.subcategories,
    }));

    return res.status(200).json(new ApiResponse(200, formatted, "Categories fetched successfully"));
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
};