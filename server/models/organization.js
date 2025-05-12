import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    default: "",
  },
  registrationNumber: {
    type: String,
    unique: true,
  },
  address: {
    type: String,
    default: "",
  },
  pincode: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
  },
  certificates: {
    type: [String],
    default: [],
  },
  files: {
    type: [String],
    default: [],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  active:{
    type: Boolean,
    default: true,
  },

  lastLogin: {
    type: Date,
  },
});

OrganizationSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

export default mongoose.model("Organization", OrganizationSchema);
