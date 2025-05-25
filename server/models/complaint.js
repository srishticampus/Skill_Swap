import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema({
  complaintAgainst: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming complaints are linked to a User
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'resolved'],
    default: 'pending',
  },
});

export default mongoose.model("Complaint", ComplaintSchema);