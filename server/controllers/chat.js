import express from 'express';
import ChatMessage from '../models/chat_message.js';
import User from '../models/user.js';
import { verifyToken } from './auth/index.js';

const router = express.Router();

// GET /api/chat/users: Get list of users for chat
router.get('/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select('name profilePicture skills');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/chat/messages/:otherUserId: Get messages between two users
router.get('/messages/:otherUserId', verifyToken, async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.user.id;

    const messages = await ChatMessage.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    }).sort('timestamp');

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/chat/message: Send a new message
router.post('/message', verifyToken, async (req, res) => {
  try {
    const { receiverId, messageText } = req.body;
    const senderId = req.user.id;

    const newMessage = new ChatMessage({
      sender: senderId,
      receiver: receiverId,
      message_text: messageText,
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully', newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export { router };
