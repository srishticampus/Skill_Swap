import mongoose from 'mongoose';

const swapRequestSchema = new mongoose.Schema({
  serviceTitle: {
    type: String,
    required: true
  },
  serviceCategory: {
    type: [String], // Array of strings
    default: []
  },
  serviceRequired: {
    type: String,
    required: true
  },
  serviceDescription: {
    type: String
  },
  yearsOfExperience: {
    type: Number,
    min: 0
  },
  preferredLocation: {
    type: String
  },
  deadline: {
    type: Date
  },
  contactName: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
      },
      message: "Please enter a valid email"
    }
  },
  contactPhoneNumber: {
    type: String,
    required: true
  },
  requestStatus: {
    type: String,
    enum: ['Open', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Open'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);

export default SwapRequest;