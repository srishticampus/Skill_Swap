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
    enum: ['pending', 'accepted', 'rejected'],
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
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

const SwapRequestInteraction = mongoose.model('SwapRequestInteraction', swapRequestInteractionSchema);

export default SwapRequestInteraction;