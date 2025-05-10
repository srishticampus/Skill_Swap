import express from "express";
export const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import Organization from "../../models/organization.js"; // Import Organization model
import nodemailer from 'nodemailer';
import path from 'path'; // Import path for potential future use, though not strictly needed for this logic

// @route   POST api/organizations/register
// @desc    Register organization
// @access  Public
router.post(
  "/register",
  [
    check("name", "Organization Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
    check("phone", "Phone number is required").not().isEmpty().matches(/^[1-9]\d*$/).withMessage("Phone number cannot start with zero"),
    check("registrationNumber", "Registration Number is required").not().isEmpty(),
    check("address", "Address is required").not().isEmpty(),
    check("pincode", "Pincode is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, registrationNumber, address, pincode } = req.body;

    try {
      let organization = await Organization.findOne({ $or: [{ email }, { registrationNumber }] });

      if (organization) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Organization with this email or registration number already exists" }] });
      }

      organization = new Organization({
        name,
        email,
        password,
        phone,
        registrationNumber,
        address,
        pincode,
        lastLogin: Date.now(),
        status: 'pending'
      });

      const salt = await bcrypt.genSalt(10);
      organization.password = await bcrypt.hash(password, salt);
      await organization.save();

      const payload = {
        organization: {
          id: organization.id,
        },
      };

      jwt.sign(
        payload,
        import.meta.env.VITE_JWT_SECRET, // Use import.meta.env for environment variables
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ organization: { id: organization.id }, token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST api/organizations/login
// @desc    Authenticate organization & get token
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
      let organization = await Organization.findOne({ email });

      if (!organization) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, organization.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      organization.lastLogin = Date.now();
      await organization.save();

      const payload = {
        organization: {
          id: organization.id,
        },
      };

      jwt.sign(
        payload,
        import.meta.env.VITE_JWT_SECRET, // Use process.env for environment variables
        { expiresIn: 604800 }, // Set expiration to 7 days (in seconds)
        (err, token) => {
          if (err) throw err;
          res.json({ token, organization: { id: organization.id } });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST api/organizations/forgot-password
// @desc    Send organization password reset email
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
      let organization = await Organization.findOne({ email });

      if (!organization) {
        // Return success even if organization not found to prevent email enumeration
        return res
          .status(200)
          .json({ msg: "If an account exists with that email, we've sent password reset instructions to your inbox." });
      }

      const resetToken = jwt.sign({ organizationId: organization._id }, import.meta.env.VITE_JWT_SECRET, { expiresIn: '1h' });

      organization.resetPasswordToken = resetToken;
      organization.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await organization.save();

      // Nodemailer configuration and email sending logic
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Example using Gmail SMTP
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER, // Your email address from environment variables
          pass: process.env.EMAIL_PASS // Your email password from environment variables
        }
      });

      const mailOptions = {
        to: email,
        from: process.env.EMAIL_USER, // Sender address
        subject: 'Organization Password Reset',
        html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your organization account.</p>
               <p>Please click on the following link, or paste this into your browser to complete the process:</p>
               <p><a href="${process.env.CLIENT_URL}/organization/reset-password/${resetToken}">${process.env.CLIENT_URL}/organization/reset-password/${resetToken}</a></p>
               <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          // Log the error but still send a success response to the client
          return res.status(200).json({ msg: "If an account exists with that email, we've sent password reset instructions to your inbox." });
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

// @route   POST api/organizations/reset-password
// @desc    Reset organization password with token
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
      const organization = await Organization.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!organization) {
        return res.status(400).json({ msg: "Password reset token is invalid or has expired" });
      }

      const salt = await bcrypt.genSalt(10);
      organization.password = await bcrypt.hash(password, salt);
      organization.resetPasswordToken = undefined;
      organization.resetPasswordExpires = undefined;
      await organization.save();

      res.json({ msg: "Password reset successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

export default router;