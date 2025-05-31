import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  senderType: {
    type: String,
    required: true,
    enum: ['User', 'Organization'],
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  receiverType: {
    type: String,
    required: true,
    enum: ['User', 'Organization'],
  },
  message_text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read_status: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("ChatMessage", ChatMessageSchema);
