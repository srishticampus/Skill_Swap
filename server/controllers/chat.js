import express from 'express';
import ChatMessage from '../models/chat_message.js';
import User from '../models/user.js';
import SwapRequestInteraction from '../models/swap_request_interaction.js'; // Import SwapRequestInteraction
import SwapRequest from '../models/swap_request.js'; // Import SwapRequest
import { verifyToken } from './auth/index.js';
import mongoose from 'mongoose';

const router = express.Router();

// GET /api/chat/users: Get list of users for chat
router.get('/users', verifyToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUser = await User.findById(currentUserId);

    let users;

    if (currentUser && currentUser.email === 'admin@admin.com') {
      // If current user is admin, fetch all users except themselves
      users = await User.aggregate([
        {
          $match: { _id: { $ne: new mongoose.Types.ObjectId(currentUserId) } }
        },
        {
          $lookup: {
            from: 'chatmessages',
            let: { userId: '$_id' },
            pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $and: [{ $eq: ['$sender', '$$userId'] }, { $eq: ['$receiver', new mongoose.Types.ObjectId(currentUserId)] }] },
                    { $and: [{ $eq: ['$receiver', '$$userId'] }, { $eq: ['$sender', new mongoose.Types.ObjectId(currentUserId)] }] }
                  ]
                }
              }
            },
            { $sort: { timestamp: -1 } },
            { $limit: 1 }
            ],
            as: 'latestMessage'
          }
        },
        {
          $lookup: {
            from: 'chatmessages',
            let: { userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$sender', '$$userId'] },
                      { $eq: ['$receiver', new mongoose.Types.ObjectId(currentUserId)] },
                      { $eq: ['$read_status', false] }
                    ]
                  }
                }
              },
            { $count: 'unreadCount' }
            ],
            as: 'unreadMessages'
          }
        },
        {
          $addFields: {
            lastMessageTimestamp: { $ifNull: [{ $arrayElemAt: ['$latestMessage.timestamp', 0] }, new Date(0)] },
            unreadCount: { $ifNull: [{ $arrayElemAt: ['$unreadMessages.unreadCount', 0] }, 0] }
          }
        },
        {
          $sort: { lastMessageTimestamp: -1 }
        },
        {
          $project: {
            name: 1,
            profilePicture: 1,
            skills: 1,
            email: 1,
            lastMessageTimestamp: 1,
            unreadCount: 1
          }
        }
      ]);
    } else {
      // Existing logic for non-admin users
      users = await User.aggregate([
        {
          $match: { _id: { $ne: new mongoose.Types.ObjectId(currentUserId) } }
        },
        // Lookup accepted swap request interactions where current user is involved
        {
          $lookup: {
            from: 'swaprequestinteractions',
            let: { userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$status', 'accepted'] },
                      {
                        $or: [
                          { $eq: ['$user', '$$userId'] }, // User accepted current user's request
                          { $eq: ['$swapRequest.requester', '$$userId'] } // Current user accepted user's request
                        ]
                      }
                    ]
                  }
                }
              },
              {
                $lookup: {
                  from: 'swaprequests',
                  localField: 'swapRequest',
                  foreignField: '_id',
                  as: 'swapRequestDetails'
                }
              },
              {
                $unwind: '$swapRequestDetails'
              },
              {
                $match: {
                  $expr: {
                    $or: [
                      { $eq: ['$user', new mongoose.Types.ObjectId(currentUserId)] },
                      { $eq: ['$swapRequestDetails.requester', new mongoose.Types.ObjectId(currentUserId)] }
                    ]
                  }
                }
              }
            ],
            as: 'acceptedSwapInteractions'
          }
        },
        // Lookup chat messages to find users with chat history
        {
          $lookup: {
            from: 'chatmessages',
            let: { userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      { $and: [{ $eq: ['$sender', '$$userId'] }, { $eq: ['$receiver', new mongoose.Types.ObjectId(currentUserId)] }] },
                      { $and: [{ $eq: ['$receiver', '$$userId'] }, { $eq: ['$sender', new mongoose.Types.ObjectId(currentUserId)] }] }
                    ]
                  }
                }
              },
              { $limit: 1 } // Just need to know if any message exists
            ],
            as: 'chatHistory'
          }
        },
        // Filter users based on conditions
        {
          $match: {
            $or: [
              { 'acceptedSwapInteractions': { $ne: [] } }, // Has accepted swap interactions
              { 'chatHistory': { $ne: [] } }, // Has chat history
              { 'email': 'admin@admin.com' } // Is an admin
            ]
          }
        },
        // Re-add latest message and unread count lookups for filtered users
        {
          $lookup: {
            from: 'chatmessages',
            let: { userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      { $and: [{ $eq: ['$sender', '$$userId'] }, { $eq: ['$receiver', new mongoose.Types.ObjectId(currentUserId)] }] },
                      { $and: [{ $eq: ['$receiver', '$$userId'] }, { $eq: ['$sender', new mongoose.Types.ObjectId(currentUserId)] }] }
                    ]
                  }
                }
            },
            { $sort: { timestamp: -1 } },
            { $limit: 1 }
            ],
            as: 'latestMessage'
          }
        },
        {
          $lookup: {
            from: 'chatmessages',
            let: { userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$sender', '$$userId'] },
                      { $eq: ['$receiver', new mongoose.Types.ObjectId(currentUserId)] },
                      { $eq: ['$read_status', false] }
                    ]
                  }
                }
            },
            { $count: 'unreadCount' }
            ],
            as: 'unreadMessages'
          }
        },
        {
          $addFields: {
            lastMessageTimestamp: { $ifNull: [{ $arrayElemAt: ['$latestMessage.timestamp', 0] }, new Date(0)] },
            unreadCount: { $ifNull: [{ $arrayElemAt: ['$unreadMessages.unreadCount', 0] }, 0] }
          }
        },
        {
          $sort: { lastMessageTimestamp: -1 }
        },
        {
          $project: {
            name: 1,
            profilePicture: 1,
            skills: 1,
            email: 1,
            lastMessageTimestamp: 1,
            unreadCount: 1
          }
        }
      ]);
    }

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

// PUT /api/chat/messages/read/:otherUserId: Mark messages as read
router.put('/messages/read/:otherUserId', verifyToken, async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.user.id;

    await ChatMessage.updateMany(
      {
        sender: otherUserId,
        receiver: currentUserId,
        read_status: false,
      },
      { $set: { read_status: true } }
    );

    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export { router };
