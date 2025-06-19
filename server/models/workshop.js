import mongoose from "mongoose";

const WorkshopSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String, // Storing time as a string for simplicity, e.g., "10:00 AM"
    required: true
  },
  location: {
    type: String,
    required: true
  },
  rsvpList: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rsvpDate: {
      type: Date,
      default: Date.now
    }
  }],
  maxAttendees: {
    type: Number,
    default: null // Null means no limit
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Workshop", WorkshopSchema);
