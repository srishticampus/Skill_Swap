import { Router } from "express";
import User from "../../models/user.js";
import Organization from "../../models/organization.js"; // Although not directly used in this endpoint, good to have for context
import organizationAuth from "../../middleware/organizationAuth.js";
import bcrypt from "bcryptjs";
import { check, validationResult } from "express-validator";
import multer from "multer";
import path from 'path'; // Import path module
import fs from 'fs'; // Import fs module

const router = Router();

// Configure multer for file uploads (profile picture)
const storage = multer.memoryStorage(); // Store file in memory as a Buffer
const upload = multer({ storage: storage });

// @route   POST /api/organization/members
// @desc    Add a new member to the organization
// @access  Private (Organization)
router.post(
  "/members",
  organizationAuth,
  upload.single("profilePicture"), // 'profilePicture' is the field name for the file upload
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("phone", "Phone number is required").not().isEmpty(),
    check("city", "City is required").not().isEmpty(),
    check("country", "Country is required").not().isEmpty(),
    check("gender", "Gender is required").not().isEmpty(),
    check("categories", "Categories are required")
      .custom(value => {
        if (Array.isArray(value) && value.length > 0) {
          return true;
        }
        if (typeof value === 'string' && value.trim() !== '') {
          return true;
        }
        return false;
      })
      .withMessage("Categories are required and must be a non-empty array or a non-empty string"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, city, country, gender } = req.body;
    let categories = req.body.categories;
    let profilePicturePath = ""; // Initialize profile picture path

    console.log("Signup: Categories before modification:", categories);
    if (categories && !Array.isArray(categories)) {
      categories = [categories];
    }
    console.log("Signup: Categories after modification:", categories);

    try {
      // Check if user already exists
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      // Handle profile picture upload
      if (req.file) {
        const profilePicFilename = `${Date.now()}-${req.file.originalname}`;
        profilePicturePath = path.join('uploads', profilePicFilename);

        // Create 'uploads' directory if it doesn't exist
        if (!fs.existsSync('uploads')) {
          fs.mkdirSync('uploads');
        }

        // Write the file to the uploads directory
        fs.writeFileSync(profilePicturePath, req.file.buffer);
      }

      // Create new user instance
      user = new User({
        name,
        email,
        password,
        phone,
        city,
        country,
        gender,
        categories,
        profilePicture: profilePicturePath, // Store the file path
        organization: req.organization.id, // Associate user with the organization
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save user to database
      await user.save();

      // Return the created user (excluding password)
      res.status(201).json(user.toJSON());

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET /api/organization/members
// @desc    Get all members for an organization with optional search
// @access  Private (Organization)
router.get("/members", organizationAuth, async (req, res) => {
  try {
    const organizationId = req.organization.id;
    const { search } = req.query;

    let query = { organization: organizationId };

    if (search) {
      // Case-insensitive search on name or email
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const members = await User.find(query).select('-password'); // Exclude password

    res.json(members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/organization/members/:id
// @desc    Get a single member's details by ID
// @access  Private (Organization)
router.get("/members/:id", organizationAuth, async (req, res) => {
  try {
    const organizationId = req.organization.id;
    const memberId = req.params.id;

    const member = await User.findOne({
      _id: memberId,
      organization: organizationId,
    }).select('-password'); // Exclude password

    if (!member) {
      return res.status(404).json({ msg: "Member not found or does not belong to this organization" });
    }

    res.json(member);
  } catch (err) {
    console.error(err.message);
    // Check if the error is a CastError (invalid ID format)
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: "Invalid member ID format" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/organization/members/:id/activate
// @desc    Activate a member
// @access  Private (Organization)
router.put("/members/:id/activate", organizationAuth, async (req, res) => {
  try {
    const organizationId = req.organization.id;
    const memberId = req.params.id;

    const member = await User.findOneAndUpdate(
      { _id: memberId, organization: organizationId },
      { $set: { isActive: true } },
      { new: true }
    ).select('-password');

    if (!member) {
      return res.status(404).json({ msg: "Member not found or does not belong to this organization" });
    }

    res.json(member);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: "Invalid member ID format" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/organization/members/:id/deactivate
// @desc    Deactivate a member
// @access  Private (Organization)
router.put("/members/:id/deactivate", organizationAuth, async (req, res) => {
  try {
    const organizationId = req.organization.id;
    const memberId = req.params.id;

    const member = await User.findOneAndUpdate(
      { _id: memberId, organization: organizationId },
      { $set: { isActive: false } },
      { new: true }
    ).select('-password');

    if (!member) {
      return res.status(404).json({ msg: "Member not found or does not belong to this organization" });
    }

    res.json(member);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: "Invalid member ID format" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/organization/members/ranked
// @desc    Get all members for an organization, ranked by completed swaps and positive reviews
// @access  Private (Organization)
router.get("/members/ranked", organizationAuth, async (req, res) => {
  try {
    const organizationId = req.organization.id;

    const rankedMembers = await User.find({ organization: organizationId })
      .select('-password') // Exclude password
      .sort({ completedSwapsCount: -1, positiveReviewsCount: -1 }); // Sort by completed swaps (desc) then positive reviews (desc)

    res.json(rankedMembers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
