import express from 'express';
import ChatMessage from '../models/chat_message.js';
import User from '../models/user.js';
import Organization from '../models/organization.js'; // Import Organization model
import SwapRequestInteraction from '../models/swap_request_interaction.js';
import SwapRequest from '../models/swap_request.js';
import { verifyToken } from './auth/index.js';
import mongoose from 'mongoose';

const router = express.Router();

// Helper function to get latest message and unread count for a given entity
const getChatMetadata = (currentEntityId, currentEntityType) => ([
  {
    $lookup: {
      from: 'chatmessages',
      let: { entityId: '$_id', entityType: '$type' },
      pipeline: [
        {
          $match: {
            $expr: {
              $or: [
                { $and: [{ $eq: ['$sender', '$$entityId'] }, { $eq: ['$senderType', '$$entityType'] }, { $eq: ['$receiver', new mongoose.Types.ObjectId(currentEntityId)] }, { $eq: ['$receiverType', currentEntityType] }] },
                { $and: [{ $eq: ['$receiver', '$$entityId'] }, { $eq: ['$receiverType', '$$entityType'] }, { $eq: ['$sender', new mongoose.Types.ObjectId(currentEntityId)] }, { $eq: ['$senderType', currentEntityType] }] }
              ]
            }
          }
        },
        { $sort: { timestamp: -1 } },
        { $limit: 1 },
        // Add nested lookups to populate sender and receiver within the latestMessage
        {
          $lookup: {
            from: 'users', // Collection name for User model
            localField: 'sender',
            foreignField: '_id',
            as: 'senderUser'
          }
        },
        {
          $lookup: {
            from: 'organizations', // Collection name for Organization model
            localField: 'sender',
            foreignField: '_id',
            as: 'senderOrganization'
          }
        },
        {
          $lookup: {
            from: 'users', // Collection name for User model
            localField: 'receiver',
            foreignField: '_id',
            as: 'receiverUser'
          }
        },
        {
          $lookup: {
            from: 'organizations', // Collection name for Organization model
            localField: 'receiver',
            foreignField: '_id',
            as: 'receiverOrganization'
          }
        },
        {
          $addFields: {
            sender: {
              $cond: {
                if: { $eq: ['$senderType', 'User'] },
                then: { $arrayElemAt: ['$senderUser', 0] },
                else: { $arrayElemAt: ['$senderOrganization', 0] }
              }
            },
            receiver: {
              $cond: {
                if: { $eq: ['$receiverType', 'User'] },
                then: { $arrayElemAt: ['$receiverUser', 0] },
                else: { $arrayElemAt: ['$receiverOrganization', 0] }
              }
            }
          }
        },
        {
          $project: {
            sender: { name: '$sender.name', email: '$sender.email', profilePicture: '$sender.profilePicture', logo: '$sender.files.0' },
            receiver: { name: '$receiver.name', email: '$receiver.email', profilePicture: '$receiver.profilePicture', logo: '$receiver.files.0' },
            message_text: 1,
            timestamp: 1,
            read_status: 1,
            senderType: 1,
            receiverType: 1
          }
        }
      ],
      as: 'latestMessage'
    }
  },
  {
    $lookup: {
      from: 'chatmessages',
      let: { entityId: '$_id', entityType: '$type' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$sender', '$$entityId'] },
                { $eq: ['$senderType', '$$entityType'] },
                { $eq: ['$receiver', new mongoose.Types.ObjectId(currentEntityId)] },
                { $eq: ['$receiverType', currentEntityType] },
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
  }
]);

// GET /api/chat/conversations: Get list of chat entities (users/organizations)
router.get('/conversations', verifyToken, async (req, res) => {
  try {
    const currentEntityId = req.user.id;
    const currentEntityType = req.user.type;

    let chatEntities = [];

    if (currentEntityType === 'User') {
      const currentUser = await User.findById(currentEntityId);

      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // If current user is admin, fetch all users and organizations
      if (currentUser.email === 'admin@admin.com') {
        const allUsers = await User.aggregate([
          { $match: { _id: { $ne: new mongoose.Types.ObjectId(currentEntityId) } } },
          { $addFields: { type: 'User' } },
          ...getChatMetadata(currentEntityId, currentEntityType),
          {
            $project: {
              name: 1,
              profilePicture: 1,
              skills: 1,
              email: 1,
              type: 1,
              lastMessageTimestamp: 1,
              unreadCount: 1
            }
          }
        ]);

        const allOrganizations = await Organization.aggregate([
          { $addFields: { type: 'Organization' } },
          ...getChatMetadata(currentEntityId, currentEntityType),
          {
            $project: {
              name: 1,
              email: 1,
              type: 1,
              lastMessageTimestamp: 1,
              unreadCount: 1,
              logo: "$files.0" // Assuming the first file in 'files' array is the logo
            }
          }
        ]);
        chatEntities = [...allUsers, ...allOrganizations];

      } else {
        // For regular users, fetch users they have accepted swap interactions with or chat history with
        const usersWithInteractionsOrChat = await User.aggregate([
          {
            $match: { _id: { $ne: new mongoose.Types.ObjectId(currentEntityId) } }
          },
          {
            $lookup: {
              from: 'swaprequestinteractions',
              let: { userId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $in: ['$status', ['accepted', 'pending', 'completed']] },
                        {
                          $or: [
                            { $eq: ['$user', '$$userId'] },
                            { $eq: ['$swapRequest.requester', '$$userId'] }
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
                { $unwind: '$swapRequestDetails' },
                {
                  $match: {
                    $expr: {
                      $or: [
                        { $eq: ['$user', new mongoose.Types.ObjectId(currentEntityId)] },
                        { $eq: ['$swapRequestDetails.requester', new mongoose.Types.ObjectId(currentEntityId)] }
                      ]
                    }
                  }
                }
              ],
              as: 'acceptedSwapInteractions'
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
                      $or: [
                        { $and: [{ $eq: ['$sender', '$$userId'] }, { $eq: ['$senderType', 'User'] }, { $eq: ['$receiver', new mongoose.Types.ObjectId(currentEntityId)] }, { $eq: ['$receiverType', 'User'] }] },
                        { $and: [{ $eq: ['$receiver', '$$userId'] }, { $eq: ['$receiverType', 'User'] }, { $eq: ['$sender', new mongoose.Types.ObjectId(currentEntityId)] }, { $eq: ['$senderType', 'User'] }] }
                      ]
                    }
                  }
                },
                { $limit: 1 }
              ],
              as: 'chatHistory'
            }
          },
          {
            $lookup: {
              from: 'swaprequests',
              let: { userId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $or: [
                        { $and: [{ $eq: ['$requester', new mongoose.Types.ObjectId(currentEntityId)] }, { $eq: ['$recipient', '$$userId'] }] },
                        { $and: [{ $eq: ['$requester', '$$userId'] }, { $eq: ['$recipient', new mongoose.Types.ObjectId(currentEntityId)] }] }
                      ]
                    }
                  }
                },
                { $limit: 1 }
              ],
              as: 'directSwapRequests'
            }
          },
          {
            $match: {
              $or: [
                { 'acceptedSwapInteractions': { $ne: [] } },
                { 'chatHistory': { $ne: [] } },
                { 'directSwapRequests': { $ne: [] } },
                { 'email': 'admin@admin.com' }
              ]
            }
          },
          { $addFields: { type: 'User' } },
          ...getChatMetadata(currentEntityId, currentEntityType),
          {
            $project: {
              name: 1,
              profilePicture: 1,
              skills: 1,
              email: 1,
              type: 1,
              lastMessageTimestamp: 1,
              unreadCount: 1
            }
          }
        ]);
          chatEntities = [...usersWithInteractionsOrChat];

          // If the user belongs to an organization, add the organization to the chat list
          if (currentUser.organization) {
            const userOrganization = await Organization.aggregate([
              { $match: { _id: new mongoose.Types.ObjectId(currentUser.organization) } },
              { $addFields: { type: 'Organization' } },
              ...getChatMetadata(currentEntityId, currentEntityType),
              {
                $project: {
                  name: 1,
                  email: 1,
                  type: 1,
                  lastMessageTimestamp: 1,
                  unreadCount: 1,
                  logo: "$files.0"
                }
              }
            ]);
            chatEntities = [...chatEntities, ...userOrganization];

            // Fetch other members of the same organization
            const otherOrganizationMembers = await User.aggregate([
              {
                $match: {
                  organization: new mongoose.Types.ObjectId(currentUser.organization),
                  _id: { $ne: new mongoose.Types.ObjectId(currentEntityId) } // Exclude current user
                }
              },
              { $addFields: { type: 'User' } },
              ...getChatMetadata(currentEntityId, currentEntityType),
              {
                $project: {
                  name: 1,
                  profilePicture: 1,
                  skills: 1,
                  email: 1,
                  type: 1,
                  lastMessageTimestamp: 1,
                  unreadCount: 1
                }
              }
            ]);
            chatEntities = [...chatEntities, ...otherOrganizationMembers];
          }
        }
      } else if (currentEntityType === 'Organization') {
        const currentOrganization = await Organization.findById(currentEntityId);

      if (!currentOrganization) {
        return res.status(404).json({ message: 'Organization not found' });
      }

      // Fetch all members of the organization
      const organizationMembers = await User.aggregate([
        { $match: { organization: new mongoose.Types.ObjectId(currentEntityId) } },
        { $addFields: { type: 'User' } },
        ...getChatMetadata(currentEntityId, currentEntityType),
        {
          $project: {
            name: 1,
            profilePicture: 1,
            skills: 1,
            email: 1,
            type: 1,
            lastMessageTimestamp: 1,
            unreadCount: 1
          }
        }
      ]);
      chatEntities = organizationMembers;
    }

    // Sort all chat entities by last message timestamp
    chatEntities.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);

    res.status(200).json(chatEntities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/chat/messages/:otherEntityId: Get messages between two entities
router.get('/messages/:otherEntityId', verifyToken, async (req, res) => {
  try {
    const { otherEntityId } = req.params;
    const { otherEntityType } = req.query; // Expect otherEntityType as a query parameter
    const currentEntityId = req.user.id;
    const currentEntityType = req.user.type;

    if (!otherEntityType || !['User', 'Organization'].includes(otherEntityType)) {
      return res.status(400).json({ message: 'Invalid or missing otherEntityType' });
    }

    const messages = await ChatMessage.find({
      $or: [
        { sender: currentEntityId, senderType: currentEntityType, receiver: otherEntityId, receiverType: otherEntityType },
        { sender: otherEntityId, senderType: otherEntityType, receiver: currentEntityId, receiverType: currentEntityType },
      ],
    })
    .populate({
      path: 'sender',
      refPath: 'senderType',
      select: 'name email profilePicture files'
    })
    .populate({
      path: 'receiver',
      refPath: 'receiverType',
      select: 'name email profilePicture files'
    })
    .sort('timestamp');

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/chat/message: Send a new message
router.post('/message', verifyToken, async (req, res) => {
  try {
    const { receiverId, receiverType, messageText } = req.body;
    const senderId = req.user.id;
    const senderType = req.user.type;

    if (!receiverType || !['User', 'Organization'].includes(receiverType)) {
      return res.status(400).json({ message: 'Invalid or missing receiverType' });
    }

    const newMessage = new ChatMessage({
      sender: senderId,
      senderType: senderType,
      receiver: receiverId,
      receiverType: receiverType,
      message_text: messageText,
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully', newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/chat/messages/read/:otherEntityId: Mark messages as read
router.put('/messages/read/:otherEntityId', verifyToken, async (req, res) => {
  try {
    const { otherEntityId } = req.params;
    const { otherEntityType } = req.body; // Expect otherEntityType in body for PUT
    const currentEntityId = req.user.id;
    const currentEntityType = req.user.type;

    if (!otherEntityType || !['User', 'Organization'].includes(otherEntityType)) {
      return res.status(400).json({ message: 'Invalid or missing otherEntityType' });
    }

    await ChatMessage.updateMany(
      {
        sender: otherEntityId,
        senderType: otherEntityType,
        receiver: currentEntityId,
        receiverType: currentEntityType,
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
