import mongoose from 'mongoose';

const swapRequestSchema = new mongoose.Schema({
  serviceTitle: {
    type: String,
    required: true
  },
  serviceCategory: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
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