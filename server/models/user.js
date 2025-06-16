import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  resume: {
    type: String,
    default: "",
  },
  qualifications: {
    type: [String],
    default: [],
  },
  mentor: {
    type: Boolean,
    default: false,
  },
  yearsOfExperience: {
    type: Number,
    default: 0,
  },
  experienceLevel: {
    type: String,
    default: "",
  },
  skills: {
    type: [String],
    default: [],
  },
  certifications: {
    type: [String],
    default: [],
  },
  responseTime: {
    type: String,
    default: "",
  },
  availability: {
    type: String,
    default: "",
  },
  serviceDescription: {
    type: String,
    default: "",
  },
  profilePicture: {
    type: String,
    default: "",
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  completedSwapsCount: {
    type: Number,
    default: 0,
  },
  positiveReviewsCount: {
    type: Number,
    default: 0,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }],
});

UserSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.password;
    delete ret.resetPasswordToken
    delete ret.resetPasswordExpires
    return ret;
  },
});

export default mongoose.model("User", UserSchema);
