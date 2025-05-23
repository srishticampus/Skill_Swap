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
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, city, country, gender } = req.body;
    let profilePicturePath = ""; // Initialize profile picture path

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

export default router;