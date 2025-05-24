import express from 'express';
import Category from '../models/category.js';
import organizationAuth from '../middleware/organizationAuth.js';

export const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Find global categories
    const globalCategories = await Category.find({ organizationId: null });

    // Find organization-specific categories if user is authenticated and part of an organization
    let organizationCategories = [];
    // Assuming user information (including organization) is available in req.user after authentication
    // Also check if organizationAuth middleware has populated req.organization for organization members
    if (req.user && req.user.organization) {
      organizationCategories = await Category.find({ organizationId: req.user.organization });
    } else if (req.organization && req.organization.id) { // Fallback for organizationAuth middleware
       organizationCategories = await Category.find({ organizationId: req.organization.id });
    }


    // Combine and return categories
    const allCategories = [...globalCategories, ...organizationCategories];
    res.json(allCategories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/categories/organization
// @desc    Create an organization-specific category
// @access  Private (Organization Members)
router.post('/organization', organizationAuth, async (req, res) => {
  try {
    const { name, description } = req.body;
    // Use req.organization.id as populated by the organizationAuth middleware
    const organizationId = req.organization.id;

    const newCategory = new Category({
      name,
      description,
      organizationId
    });

    const category = await newCategory.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;