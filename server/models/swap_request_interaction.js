import mongoose from 'mongoose'

const swapRequestInteractionSchema = new mongoose.Schema({
  swapRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SwapRequest',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updates: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: {
      type: String
    },
    title: {
      type: String
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

const SwapRequestInteraction = mongoose.model('SwapRequestInteraction', swapRequestInteractionSchema);

export default SwapRequestInteraction;
