import express from "express";
export const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import User from "../../models/user.js";
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Organization from "../../models/organization.js";
import pdfParse from 'pdf-parse-debugging-disabled';
import mammoth from 'mammoth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
// Multer configuration
const storage = multer.memoryStorage(); // Store the file in memory
export const upload = multer({ storage: storage }); // Export upload for use in routes

// Middleware function to verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Try to verify as a user token
    const decoded = jwt.verify(token, import.meta.env.VITE_JWT_SECRET);
    if (decoded.user) {
      req.user = { ...decoded.user, type: 'User' };
    } else if (decoded.organization) {
      req.user = { ...decoded.organization, type: 'Organization' }; // Using req.user for consistency, but with a 'type' field
    } else {
      return res.status(401).json({ msg: "Token is not valid or payload is malformed" });
    }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// @route   POST api/auth/signup
// @desc    Register user
// @access  Public
router.post(
  "/signup",
  upload.single('profilePic'),
  [
    check("firstName", "First Name is required").not().isEmpty(),
    check("lastName", "Last Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("newPassword", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
    check("phone", "Phone number is required").not().isEmpty().matches(/^[1-9]\d*$/).withMessage("Phone number cannot start with zero"),
    check("country", "Country is required").not().isEmpty().matches(/^[^0-9]*$/).withMessage("Country name cannot contain digits"),
    check("city", "City is required").not().isEmpty().matches(/^[^0-9]*$/).withMessage("City name cannot contain digits"),
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

    let { firstName, lastName, email, newPassword, phone, country, city, gender, categories } = req.body;

    if (categories && !Array.isArray(categories)) {
      categories = [categories];
    }

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
        gender,
        categories,
        lastLogin: Date.now()
      });

      if (req.file) {
        const profilePicFilename = `${Date.now()}-${req.file.originalname}`;
        const profilePicPath = path.join('uploads', profilePicFilename);

        if (!fs.existsSync('uploads')) {
          fs.mkdirSync('uploads');
        }

        fs.writeFileSync(profilePicPath, req.file.buffer);
        user.profilePicture = profilePicPath;
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      const payload = {
        user: {
          id: user.id,
          isAdmin: user.isAdmin || false,
        },
      };

      console.log("VITE_JWT_SECRET:", import.meta.env.VITE_JWT_SECRET);
      jwt.sign(
        payload,
        import.meta.env.VITE_JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ user: { id: user.id, isAdmin: user.isAdmin || false, type: 'User' },token });
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
        if (email === "admin@admin.com") {
          const isMatch = password === "admin";
          if (isMatch) {
            user = new User({
              name: "Admin User",
              email: "admin@admin.com",
              password: "admin",
              isAdmin: true,
              lastLogin: Date.now()
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash("admin", salt);
            user.isAdmin = true;
            await user.save();

            const payload = {
              user: {
                id: user.id,
                isAdmin: true,
                type: 'User',
              },
            };

            jwt.sign(
              payload,
              import.meta.env.VITE_JWT_SECRET,
              { expiresIn: 604800 }, // Set expiration to 7 days (in seconds)
              (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, profilePicture: user.profilePicture, isAdmin: true, type: 'User' } });
              }
            );
            return;
          }
        }
        return res
          .status(400)
          .json({ errors: [{ msg: "User not found" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Incorrect password" }] });
      }

      if (user.email === "admin@admin.com") {
        user.isAdmin = true;
        await user.save();
      }

      user.lastLogin = Date.now();
      await user.save();

      const payload = {
        user: {
          id: user.id,
          isAdmin: user.isAdmin || false,
          type: 'User',
        },
      };

      jwt.sign(
        payload,
        import.meta.env.VITE_JWT_SECRET,
        { expiresIn: 604800 }, // Set expiration to 7 days (in seconds)
        async (err, token) => {
          if (err) throw err;
          if (!user.isActive) {
            return res.status(400).json({ errors: [{ msg: "Your account is not active. Please contact the administrator." }] });
          }

          if (user.organization) {
            const organization = await Organization.findById(user.organization);
            if (!organization) {
              return res.status(500).send("Server error: Organization not found");
            }
            if (!organization.active) {
              return res.status(400).json({ errors: [{ msg: "Your organization is not active. Please contact the administrator." }] });
            }
          }

          res.json({ token, user: { id: user.id, name: user.name, profilePicture: user.profilePicture, isAdmin: user.isAdmin || false, type: 'User', organization: user.organization || null } });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST api/auth/forgot-password
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
          .json({ msg: "If an account exists with that email, we've sent password reset instructions to your inbox." });
      }

      const resetToken = jwt.sign({ userId: user._id }, import.meta.env.VITE_JWT_SECRET, { expiresIn: '1h' });

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000;
      await user.save();

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

// @route   POST api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post(
  "/reset-password",
  [
    check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
    check("confirmPassword", "Passwords do not match").custom((value, { req }) => value === req.body.password),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password, confirmPassword, token } = req.body;

    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ msg: "Password reset token is invalid or has expired" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({ msg: "Password reset successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/auth/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate('organization', 'name'); // Populate organization and select only the name field
    const profilePictureUrl = user.profilePicture ? `${user.profilePicture}` : null;
    res.json({...user.toObject(), profilePictureUrl});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/auth/users/:id
// @desc    Get user by ID (Authenticated users)
// @access  Private
router.get("/users/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").populate('categories');

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const profilePictureUrl = user.profilePicture ? `/uploads/${path.basename(user.profilePicture)}` : null;
    res.json({...user.toObject(), profilePictureUrl});
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server Error");
  }
});


// @route   POST api/auth/update-profile
// @desc    Update user profile
// @access  Private
router.post(
  "/update-profile",
  verifyToken,
  upload.single('profilePic'),
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("phone", "Phone number is required").not().isEmpty().matches(/^[1-9]\d*$/).withMessage("Phone number cannot start with zero"),
    check("country", "Country is required").not().isEmpty().matches(/^[^0-9]*$/).withMessage("Country name cannot contain digits"),
    check("city", "City is required").not().isEmpty().matches(/^[^0-9]*$/).withMessage("City name cannot contain digits"),
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

    let { name, email, phone, country, city, gender, categories } = req.body;

    if (categories && !Array.isArray(categories)) {
      categories = [categories];
    }

    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      user.name = name;
      user.email = email;
      user.phone = phone;
      user.country = country;
      user.city = city;
      user.gender = gender;
      user.categories = categories;

      if (req.file) {
        const profilePicFilename = `${Date.now()}-${req.file.originalname}`;
        const profilePicPath = path.join('uploads', profilePicFilename);

        if (!fs.existsSync('uploads')) {
          fs.mkdirSync('uploads');
        }

        fs.writeFileSync(profilePicPath, req.file.buffer);
        user.profilePicture = profilePicPath;
      }

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
  verifyToken,
  upload.any(),
  [
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

    let { categories } = req.body;

    if (categories && !Array.isArray(categories)) {
      categories = [categories];
    }

    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      if (req.files) {
        req.files.forEach(file => {
          if (file.fieldname === 'resume') {
            const resumeFilename = `${Date.now()}-${file.originalname}`;
            const resumePath = path.join('uploads', resumeFilename);

            if (!fs.existsSync('uploads')) {
              fs.mkdirSync('uploads');
            }

            fs.writeFileSync(resumePath, file.buffer);
            user.resume = resumePath;
          }
        });
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
      if (req.body.responseTime) {
        user.responseTime = req.body.responseTime;
      }
      if (req.body.availability) {
        user.availability = req.body.availability;
      }
      user.categories = categories;

      await user.save();

      res.json({ msg: "Technical information updated successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST api/auth/parse-resume
// @desc    Parse resume and extract data using LLM
// @access  Private
export const parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No resume file uploaded." });
    }

    const fileBuffer = req.file.buffer;
    const fileMimeType = req.file.mimetype;
    let resumeText = '';

    if (fileMimeType === 'application/pdf') {
      const data = await pdfParse(fileBuffer);
      resumeText = data.text;
    } else if (fileMimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      resumeText = result.value;
    } else {
      return res.status(400).json({ msg: "Unsupported file type. Please upload a PDF or DOCX." });
    }

    if (!resumeText) {
      return res.status(400).json({ msg: "Could not extract text from resume." });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `Extract the following information from the resume text provided below and return it as a JSON object. If a field is not found or cannot be determined, return null for that field. Ensure the output is a valid JSON object.

Fields to extract:
- qualifications (string, comma-separated list of key qualifications or educational background)
- skills (string, comma-separated list of technical and soft skills)
- experienceLevel (string, e.g., 'Entry-level', 'Junior', 'Mid-level', 'Senior', 'Lead', 'Manager', 'Executive')
- yearsOfExperience (number, total years of professional experience)

Resume Text:
${resumeText}

JSON Output:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let parsedData = {};
    try {
      parsedData = JSON.parse(text);
    } catch (jsonError) {
      console.error('Error parsing LLM response as JSON:', jsonError);
      console.error('LLM raw response:', text);
      return res.status(500).json({ msg: "Failed to parse resume data from LLM. Invalid JSON response.", llmResponse: text });
    }

    res.status(200).json(parsedData);

  } catch (err) {
    console.error('Error in parseResume:', err.message);
    res.status(500).send("Server error during resume parsing.");
  }
};

// @route   POST api/auth/add-certification
// @desc    Add a new certification to the user
// @access  Private
router.post(
  "/add-certification",
  verifyToken,
  upload.single('certificationFile'),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      let certificationPath = null;

      if (req.file) {
        // Handle file upload
        const certificationFilename = `${Date.now()}-${req.file.originalname}`;
        certificationPath = path.join('uploads', certificationFilename);

        if (!fs.existsSync('uploads')) {
          fs.mkdirSync('uploads');
        }

        fs.writeFileSync(certificationPath, req.file.buffer);
      } else if (req.body.certificationURL) {
        // Handle URL
        certificationPath = req.body.certificationURL;
      } else if (req.body.certificationText) {
        // Handle plain text
        certificationPath = req.body.certificationText;
      } else {
        return res.status(400).json({ msg: "No certification data provided" });
      }

      if (!user.certifications) {
        user.certifications = [];
      }

      user.certifications.push(certificationPath);
      await user.save();

      res.json({ msg: "Certification added successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   DELETE api/auth/delete-certification
// @desc    Delete a user certification
// @access  Private
router.delete(
  "/delete-certification",
  verifyToken,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      const { certification } = req.body;

      if (!user.certifications) {
        return res.status(400).json({ msg: "No certifications found for this user" });
      }

      user.certifications = user.certifications.filter(
        (cert) => cert !== certification
      );

      await user.save();

      res.json({ msg: "Certification deleted successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
