import express from "express";
export const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import User from "../../models/user.js";
import nodemailer from 'nodemailer';
import multer from 'multer';

// Multer configuration
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

// Middleware function to verify JWT token
export const auth = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, import.meta.env.VITE_JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export const verifyToken = auth;


// @route   POST api/auth/signup
// @desc    Register user
// @access  Public
router.post(
  "/signup",
  upload.single('profilePic'), // Use multer middleware to handle file upload
  [
    check("firstName", "First Name is required").not().isEmpty(),
    check("lastName", "Last Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("newPassword", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
    check("phone", "Phone number is required").not().isEmpty(),
    check("country", "Country is required").not().isEmpty(),
    check("city", "City is required").not().isEmpty(),
    check("gender", "Gender is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, newPassword, phone, country, city, gender } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name: `${firstName} ${lastName}`,
        email,
        password: newPassword,
        phone,
        country,
        city,
        gender
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(newPassword, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
          isAdmin: user.isAdmin || false,
        },
      };

      jwt.sign(
        payload,
        import.meta.env.VITE_JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        // Check for admin user
        if (email === "admin@admin.com") {
          const isMatch = password === "admin";
          if (isMatch) {
            // Create a new admin user
            user = new User({
              name: "Admin User",
              email: "admin@admin.com",
              password: "admin",
              isAdmin: true,
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash("admin", salt);
            user.isAdmin = true;

            await user.save();

            const payload = {
              user: {
                id: user.id,
                isAdmin: true,
              },
            };

            jwt.sign(
              payload,
              import.meta.env.VITE_JWT_SECRET,
              { expiresIn: 360000 },
              (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, isAdmin: true } }); // Modified response
              }
            );
            return;
          }
        }
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      if(user.email === "admin@admin.com") {
        // set isAdmin to true
        user.isAdmin = true;
        await user.save();
      }

      const payload = {
        user: {
          id: user.id,
          isAdmin: user.isAdmin || false,
        },
      };

      jwt.sign(
        payload,
        import.meta.env.VITE_JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token, user: { id: user.id, isAdmin: user.isAdmin || false } }); // Modified response
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST api/forgot-password
// @desc    Send password reset email
// @access  Public
router.post(
  "/forgot-password",
  [
    check("email", "Please include a valid email").isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(200)
          .json({ msg: "If an account exists with that email, we've sent password reset instructions to your inbox." }); // Don't reveal that the user doesn't exist
      }

      // Generate password reset token
      const resetToken = jwt.sign({ userId: user._id }, import.meta.env.VITE_JWT_SECRET, { expiresIn: '1h' });

      // Save reset token to user model
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      // Send email with reset token
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: import.meta.env.VITE_EMAIL,
            pass: import.meta.env.VITE_PASSWORD
        }
      });

      const mailOptions = {
        to: email,
        from: 'jayde.boehm@ethereal.email',
        subject: 'Password Reset',
        html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
               <p>Please click on the following link, or paste this into your browser to complete the process:</p>
               <p><a href="${import.meta.env.VITE_CLIENT_URL}/reset-password/${resetToken}">${import.meta.env.VITE_CLIENT_URL}/reset-password/${resetToken}</a></p>
               <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).send("Error sending email");
        } else {
          console.log('Email sent: ' + info.response);
          return res
            .status(200)
            .json({ msg: "If an account exists with that email, we've sent password reset instructions to your inbox." });
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/auth/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/auth/update-profile
// @desc    Update user profile
// @access  Private
router.post(
  "/update-profile",
  auth,
  [
    check("firstName", "First Name is required").not().isEmpty(),
    check("lastName", "Last Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("phone", "Phone number is required").not().isEmpty(),
    check("country", "Country is required").not().isEmpty(),
    check("city", "City is required").not().isEmpty(),
    check("gender", "Gender is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, phone, country, city, gender, profilePicture } = req.body;

    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Update user fields
      user.name = `${firstName} ${lastName}`;
      user.email = email;
      user.phone = phone;
      user.country = country;
      user.city = city;
      user.gender = gender;
      user.profilePicture = profilePicture;

      await user.save();

      res.json({ msg: "Profile updated successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST api/auth/update-technical
// @desc    Update user technical information
// @access  Private
router.post(
  "/update-technical",
  auth,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Update user fields
      if (req.body.resume) {
        user.resume = req.body.resume;
      }
      if (req.body.qualifications) {
        user.qualifications = req.body.qualifications;
      }
      if (req.body.skills) {
        user.skills = req.body.skills;
      }
      if (req.body.experienceLevel) {
        user.experienceLevel = req.body.experienceLevel;
      }
      if (req.body.yearsOfExperience) {
        user.yearsOfExperience = req.body.yearsOfExperience;
      }
      if (req.body.serviceDescription) {
        user.serviceDescription = req.body.serviceDescription;
      }
      if (req.body.certifications) {
        user.certifications = req.body.certifications;
      }
      if (req.body.responseTime) {
        user.responseTime = req.body.responseTime;
      }
      if (req.body.availability) {
        user.availability = req.body.availability;
      }

      await user.save();

      res.json({ msg: "Technical information updated successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
