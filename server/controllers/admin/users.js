import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import User from "../../models/user.js";
import { auth } from "../auth/index.js";
import { adminCheck } from "./middleware.js";

const router = express.Router();

// @route   POST api/admin/users
// @desc    Create a new user (Admin only)
// @access  Private (Requires authentication and admin role)
router.post(
  "/users",
  [
    auth,
    adminCheck,
    [
      check("name", "Name is required").not().isEmpty(),
      check("email", "Please include a valid email").isEmail(),
      check(
        "password",
        "Please enter a password with 6 or more characters"
      ).isLength({ min: 6 }),
      check("skills", "Skills are required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, skills } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name,
        email,
        password,
        skills,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      res.json({ msg: "User created successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/admin/users
// @desc    Get all users (Admin only)
// @access  Private (Requires authentication and admin role)
router.get("/users", auth, adminCheck, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/admin/users/:id
// @desc    Get user by ID (Admin only)
// @access  Private (Requires authentication and admin role)
router.get("/users/:id", auth, adminCheck, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/admin/users/:id
// @desc    Update user by ID (Admin only)
// @access  Private (Requires authentication and admin role)
router.put("/users/:id", auth, adminCheck, async (req, res) => {
  const { name, email, role, skills } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (skills) user.skills = skills;

    await user.save();

    res.json({ msg: "User updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/admin/users/:id
// @desc    Delete user by ID (Admin only)
// @access  Private (Requires authentication and admin role)
router.delete("/users/:id", auth, adminCheck, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await user.deleteOne();

    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/admin/users/:id/mentor
// @desc    Update user mentor status by ID (Admin only)
// @access  Private (Requires authentication and admin role)
router.put("/users/:id/mentor", auth, adminCheck, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.mentor = req.body.mentor;

    await user.save();

    res.json({ msg: "User mentor status updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;