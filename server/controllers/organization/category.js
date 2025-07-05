import Category from '../../models/category.js';
import organizationAuth from '../../middleware/organizationAuth.js';
import express from "express";

const router = express.Router();

// Get all categories for the organization
router.get('/', organizationAuth, async (req, res) => {
  try {
    // Assuming organization ID is available in req.organization.id from organizationAuth middleware
    const categories = await Category.find({ organization: req.organization.id });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new category for the organization
router.post('/', organizationAuth, async (req, res) => {
  try {
    if(!req.body.name || !req.body.description) {
      return res.status(400).json({ message: 'Name or description are required' });
    }
    if(!req.organization.id) {
      return res.status(400).json({ message: 'Organization ID is required' });
    }
    const category = new Category({
      ...req.body,
      organization: req.organization.id, // Assign category to the organization
    });
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    // send error if the dbfinds a duplicate
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Category already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

// Delete a category by ID for the organization
router.delete('/:id', organizationAuth, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      organization: req.organization.id, // Ensure category belongs to the organization
    });
    if (!category) {
      return res.status(404).json({ message: 'Category not found or not authorized to delete' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
