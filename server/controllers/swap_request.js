import SwapRequest from '../models/swap_request.js';
import SwapRequestInteraction from '../models/swap_request_interaction.js'; // Import the SwapRequestInteraction model
import Category from '../models/category.js'; // Import Category model
import UserRating from '../models/user_rating.js'; // Import UserRating model
import User from '../models/user.js'; // Import User model
import Notification from '../models/notification.js'; // Import Notification model
import jwt from 'jsonwebtoken';
import { validationResult, body } from 'express-validator';
import { match } from 'assert';
import mongoose from 'mongoose';

// Helper function to get IDs of swap requests that have accepted interactions
const getSwapRequestsWithAcceptedInteractions = async () => {
  return await SwapRequestInteraction.find({ status: 'accepted' }).distinct('swapRequest');
};

// Helper function to calculate skill match score
const calculateSkillMatch = (userSkills, targetSkills) => {
  if (!userSkills || !targetSkills) return 0;

  const userSkillWords = new Set(userSkills.flatMap(s => s.toLowerCase().split(/\s+/)));
  let score = 0;

  targetSkills.forEach(skill => {
    const targetSkillWords = skill.toLowerCase().split(/\s+/);
    targetSkillWords.forEach(word => {
      if (userSkillWords.has(word)) {
        score += 1;
      }
    });
  });
  return score;
};

// Get recommended swap requests
export const getRecommendedSwapRequests = async (req, res) => {
  try {
    const userId = req.user.id; // Authenticated user's ID

    // Fetch the current user's profile
    const currentUser = await User.findById(userId).select('skills yearsOfExperience qualifications categories');
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const acceptedSwapRequestIds = await getSwapRequestsWithAcceptedInteractions();

    const baseConditions = [{
      createdBy: { $ne: userId }
    }, {
      _id: { $nin: acceptedSwapRequestIds }
    }, ];

    const matchConditions = [];

    if (currentUser.skills && currentUser.skills.length > 0) {
      const skillRegexes = currentUser.skills.map(skill => new RegExp(skill, 'i'));
      matchConditions.push({
        $or: [{
          serviceRequired: {
            $in: skillRegexes
          }
        }, {
          serviceTitle: {
            $in: skillRegexes
          }
        }, ],
      });
    }

    if (currentUser.categories && currentUser.categories.length > 0) {
      matchConditions.push({
        serviceCategory: {
          $in: currentUser.categories
        }
      });
    }

    // If no skills or categories are defined for the user, return an empty array
    if (matchConditions.length === 0) {
      return res.status(200).json([]);
    }

    // Combine base conditions with an OR of match conditions
    const finalQuery = {
      $and: [
        ...baseConditions, {
          $or: matchConditions
        }
      ]
    };

    const allSwapRequests = await SwapRequest.find(finalQuery)
      .populate('createdBy', 'name profilePicture skills yearsOfExperience qualifications')
      .populate('serviceCategory', 'name');

    let recommendedRequests = await Promise.all(allSwapRequests.map(async (request) => {
      let score = 0;
      let isRequestingSkillMatch = false;

      // 1. Skill Matching
      // Match user's skills with serviceRequired of the request (requesting skill match - highest priority)
      if (currentUser.skills && request.serviceRequired) {
        const serviceRequiredSkills = request.serviceRequired.split(',').map(s => s.trim());
        const directSkillMatchScore = calculateSkillMatch(currentUser.skills, serviceRequiredSkills);
        if (directSkillMatchScore > 0) {
          score += directSkillMatchScore * 100; // Very high weight for direct requesting skill match
          isRequestingSkillMatch = true;
        }
      }

      // Match user's skills with skills of the request creator (for reciprocal swaps)
      if (currentUser.skills && request.createdBy?.skills) {
        score += calculateSkillMatch(currentUser.skills, request.createdBy.skills) * 5; // Increased weight
      }

      // 2. Experience Matching (still relevant for quality of match)
      if (currentUser.yearsOfExperience !== undefined && request.yearsOfExperience !== undefined) {
        if (currentUser.yearsOfExperience >= request.yearsOfExperience) {
          score += 3;
        }
      }

      // 3. Qualifications Matching (as keywords in service title/description - still relevant)
      if (currentUser.qualifications && (request.serviceTitle || request.serviceDescription)) {
        const requestText = `${request.serviceTitle || ''} ${request.serviceDescription || ''}`.toLowerCase();
        currentUser.qualifications.forEach(qualification => {
          if (requestText.includes(qualification.toLowerCase())) {
            score += 1;
          }
        });
      }

      // 4. Category Matching (already part of initial query, but can add to score for finer sorting)
      if (currentUser.categories && request.serviceCategory) {
        const currentUserCategoryIds = new Set(currentUser.categories.map(cat => cat.toString()));
        const requestCategoryIds = request.serviceCategory.map(cat => cat._id.toString());
        requestCategoryIds.forEach(reqCatId => {
          if (currentUserCategoryIds.has(reqCatId)) {
            score += 2;
          }
        });
      }

      // Add hasPlacedRequest flag for consistency with getAllSwapRequests
      const existingInteraction = await SwapRequestInteraction.findOne({
        swapRequest: request._id,
        user: userId
      });

      return {
        ...request.toObject(),
        recommendationScore: score,
        isRequestingSkillMatch: isRequestingSkillMatch,
        hasPlacedRequest: !!existingInteraction
      };
    }));

    // Sort: requesting skill matches first, then by recommendation score
    recommendedRequests.sort((a, b) => {
      if (a.isRequestingSkillMatch && !b.isRequestingSkillMatch) return -1;
      if (!a.isRequestingSkillMatch && b.isRequestingSkillMatch) return 1;
      return b.recommendationScore - a.recommendationScore;
    });

    res.status(200).json(recommendedRequests);

  } catch (error) {
    console.error('Error fetching recommended swap requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

 
// Create a new swap request
export const createSwapRequest = [
  body('serviceTitle')
    .trim()
    .isLength({ min: 2 }).withMessage('Service title must be at least 2 characters long')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Service title can only contain alphabetic characters and spaces'),
  body('serviceRequired')
    .trim()
    .isLength({ min: 2 }).withMessage('Service required must be at least 2 characters long')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Service required can only contain alphabetic characters and spaces'),
  body('serviceDescription')
    .optional()
    .matches(/^(?=.*[a-zA-Z0-9]).+$/).withMessage('Service description must contain at least one letter or number if provided.'),
  body('yearsOfExperience')
    .optional()
    .isNumeric().withMessage('Years of experience must be a number')
    .isInt({ min: 0 }).withMessage('Years of experience cannot be negative'),
  body('preferredLocation')
    .optional()
    .matches(/^[a-zA-Z0-9\s.,'-]+$/).withMessage('Preferred location can only contain alphanumeric characters, spaces, and common punctuation.'),
  body('deadline')
    .optional()
    .isISO8601().toDate().withMessage('Invalid deadline date'),
  body('contactName')
    .trim()
    .isLength({ min: 2 }).withMessage('Contact name must be at least 2 characters long')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Contact name can only contain alphabetic characters and spaces'),
  body('contactEmail')
    .trim()
    .isEmail().withMessage('Invalid contact email address'),
  body('contactPhoneNumber')
    .trim()
    .isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits long')
    .matches(/^\d+$/).withMessage('Phone number must contain only digits'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Extract user ID from token
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
  
      jwt.verify(token, import.meta.env.VITE_JWT_SECRET, async (err, decoded) => { // Use import.meta.env
        if (err) {
          return res.status(403).json({ message: 'Failed to authenticate token' });
        }
  
        const userId = decoded.user.id; // Correctly access user ID from decoded token
  
        let categoryObjectIds = [];
        // Handle serviceCategory strings to ObjectIds conversion
        if (req.body.serviceCategory && Array.isArray(req.body.serviceCategory)) {
          try {
            const categoryIds = req.body.serviceCategory; // Assuming frontend sends array of category _ids
            // Find categories by their _id instead of value
            const categories = await Category.find({ _id: { $in: categoryIds } });
            categoryObjectIds = categories.map(category => category._id);
          } catch (categoryError) {
            console.error('Error converting serviceCategory strings to ObjectIds:', categoryError);
            // If there's an error, categoryObjectIds remains an empty array
          }
        }
  
        // Construct the data object explicitly to ensure correct types
        const swapRequestData = {
          ...req.body, // Copy other fields from req.body
          serviceCategory: categoryObjectIds, // Use the converted ObjectIds array
          createdBy: userId // Use the correctly extracted user ID
        };
  
        const newSwapRequest = new SwapRequest(swapRequestData);
        const savedSwapRequest = await newSwapRequest.save();
        res.status(201).json(savedSwapRequest);
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

/** Get all swap requests with filtering and searching
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {void}
 * @throws {Error} Error if there is an issue with the request
 */
export const getAllSwapRequests = async (req, res) => {
  try {
    // const acceptedSwapRequestIds = await getSwapRequestsWithAcceptedInteractions(); // NEW

    const { createdBy, searchTerm, serviceRequired, serviceCategory } = req.query;
    let query = { 
      // _id: { $nin: acceptedSwapRequestIds }
     }; // Initialize query with exclusion

    // Existing createdBy filter logic (needs to be combined with initial query)
    let createdByFilter = {};
    if (createdBy) {
      createdByFilter.createdBy = createdBy;
    } else {
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, import.meta.env.VITE_JWT_SECRET);
          const userId = decoded.user.id;
          createdByFilter.createdBy = { $ne: userId };
        } catch (err) {
          console.error('Error verifying token:', err);
        }
      }
    }
    if (Object.keys(createdByFilter).length > 0) {
        query = { $and: [query, createdByFilter] };
    }

    // Add searchTerm filter using $or for multiple fields
    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, 'i');
      const searchConditions = {
        $or: [
          { serviceTitle: searchRegex },
          { serviceDescription: searchRegex }, // Changed from serviceDetails to serviceDescription based on schema
        ]
      };
      query = { $and: [query, searchConditions] };
    }

    // Add serviceRequired filter
    if (serviceRequired && serviceRequired !== 'any') {
       query = { $and: [query, { serviceRequired: serviceRequired }] };
    }

    // Add serviceCategory filter
    if (serviceCategory && serviceCategory !== 'any') {
       query = { $and: [query, { serviceCategory: serviceCategory }] };
    }

    const swapRequests = await SwapRequest.find(query) // Use the combined query
      .populate('serviceCategory')
      .populate('createdBy')
      .exec();

    let userId = null;
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, import.meta.env.VITE_JWT_SECRET);
        userId = decoded.user.id;
      } catch (err) {
        console.error('Error verifying token:', err);
      }
    }

    const swapRequestsWithInteraction = await Promise.all(swapRequests.map(async (swapRequest) => {
      const existingInteraction = await SwapRequestInteraction.findOne({
        swapRequest: swapRequest._id,
        user: userId
      });

      return {
        ...swapRequest.toObject(),
        hasPlacedRequest: !!existingInteraction
      };
    }));

    res.status(200).json(swapRequestsWithInteraction);

  } catch (err) {
    console.error('Error fetching swap requests:', err);
    res.status(500).json({ message: 'Failed to fetch swap requests', error: err.message });
  }
};

// Get a specific swap request by ID
export const getSwapRequestById = async (req, res) => {
  try {
    console.log(`Fetching swap request with ID: ${req.params.id}`);
    const swapRequest = await SwapRequest.findById(req.params.id)
      .populate('createdBy')
      .populate({ path: "serviceCategory", select: "_id name" });

    if (!swapRequest) {
      console.log('Swap request not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Swap request not found' });
    }

    console.log(`Found swap request: ${swapRequest._id}. Finding interaction.`);
    // Find the corresponding SwapRequestInteraction to get the updates
    let swapRequestInteraction = await SwapRequestInteraction.findOne({ swapRequest: req.params.id });

    // If no interaction is found, create an empty object
    if (!swapRequestInteraction) {
      console.log(`No interaction found for swap request: ${req.params.id}.`);
      swapRequestInteraction = { updates: [] };
    } else {
      console.log(`Found interaction for swap request: ${req.params.id}. Populating updates.`);
      // Populate the updates array in the swapRequestInteraction
      await swapRequestInteraction.populate('updates.user');
      await swapRequestInteraction.populate('user'); // Populate the user who placed the interaction
      // Ensure updates are populated
      console.log(`Updates populated for interaction: ${swapRequestInteraction._id}.`);
    }

    const swapRequestData = {
      ...swapRequest.toObject(),
      updates: swapRequestInteraction.updates || [],
      interactionStatus: swapRequestInteraction.status || 'pending', // Default to 'pending' if no interaction
      interactionUser: swapRequestInteraction.user || null // User who placed the interaction
    };

    console.log(`Successfully fetched swap request data for ID: ${req.params.id}`);
    res.status(200).json(swapRequestData);
  } catch (err) {
    console.error(`Error in getSwapRequestById for ID ${req.params.id}:`, err);
    res.status(500).json({ message: err.message });
  }
};

// Update a swap request by ID
export const updateSwapRequestById = async (req, res) => {
  try {
    // Extract user ID from token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
 
    jwt.verify(token, import.meta.env.VITE_JWT_SECRET, async (err, decoded) => { // Use import.meta.env
      if (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
      }

      const userId = decoded.user.id;
      console.log('Update Swap Request: Received ID:', req.params.id);
      console.log('Update Swap Request: Extracted User ID:', userId);
      const swapRequest = await SwapRequest.findById(req.params.id);

      if (!swapRequest) {
        return res.status(404).json({ message: 'Swap request not found' });
      }

      if (!swapRequest) {
        return res.status(404).json({ message: 'Swap request not found' });
      }

      console.log('Update Swap Request: Swap Request Creator ID:', swapRequest.createdBy.toString());
      if (swapRequest.createdBy.toString() !== userId) {
        console.log('Update Swap Request: Authorization failed. Creator ID:', swapRequest.createdBy.toString(), 'User ID:', userId);
        return res.status(403).json({ message: 'Unauthorized' });
      }
      console.log('Update Swap Request: Authorization successful.');

      const updatedSwapRequest = await SwapRequest.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).populate('createdBy');

      res.status(200).json(updatedSwapRequest);
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a swap request by ID
export const deleteSwapRequestById = async (req, res) => {
  try {
    // Extract user ID from token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
 
    jwt.verify(token, import.meta.env.VITE_JWT_SECRET, async (err, decoded) => { // Use import.meta.env
      if (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
      }

      const userId = decoded.user.id;
      console.log('Delete Swap Request: Received ID:', req.params.id);
      console.log('Delete Swap Request: Extracted User ID:', userId);
      const swapRequest = await SwapRequest.findById(req.params.id);

      if (!swapRequest) {
        return res.status(404).json({ message: 'Swap request not found' });
      }

      if (!swapRequest) {
        return res.status(404).json({ message: 'Swap request not found' });
      }

      console.log('Delete Swap Request: Swap Request Creator ID:', swapRequest.createdBy.toString());
      if (swapRequest.createdBy.toString() !== userId) {
        console.log('Delete Swap Request: Authorization failed. Creator ID:', swapRequest.createdBy.toString(), 'User ID:', userId);
        return res.status(403).json({ message: 'Unauthorized' });
      }
      console.log('Delete Swap Request: Authorization successful.');

      const deletedSwapRequest = await SwapRequest.findByIdAndDelete(req.params.id);

      if (!deletedSwapRequest) {
        return res.status(404).json({ message: 'Swap request not found' });
      }

      res.status(200).json({ message: 'Swap request deleted' });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Place a request on a swap request
export const placeRequest = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, import.meta.env.VITE_JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
      }
      console.log("Decoded token:", decoded);
      const userId = decoded.user.id;
      const swapRequestId = req.params.id;

      // Check if the user is trying to place a request on their own swap request
      const swapRequest = await SwapRequest.findById(swapRequestId);
      if (!swapRequest) {
        return res.status(404).json({ message: 'Swap request not found' });
      }

      if (swapRequest.createdBy.toString() === userId) {
        return res.status(400).json({ message: 'You cannot place a request on your own swap request' });
      }

      // Check if the user has already placed a request on this swap request
      const existingInteraction = await SwapRequestInteraction.findOne({
        swapRequest: swapRequestId,
        user: userId
      });

      if (existingInteraction) {
        return res.status(400).json({ message: 'You have already placed a request on this swap request' });
      }

      // Create a new swap request interaction
      const newSwapRequestInteraction = new SwapRequestInteraction({
        swapRequest: swapRequestId,
        user: userId,
        message: req.body.message || '' // Allow the user to send a message with the request
      });

      const savedSwapRequestInteraction = await newSwapRequestInteraction.save();
      console.log("New SwapRequestInteraction saved:", savedSwapRequestInteraction);
      console.log("SwapRequest ID:", swapRequestId);
      // Create a notification for the user who created the swap request
      // Assuming you have a Notification model and controller
      // You might want to move this to a separate function or service
      const notification = {
        user: swapRequest.createdBy,
        type: 'swap_request_placed',
        message: `User ${userId} has placed a request on your swap request: ${swapRequest.serviceTitle}`,
        relatedSwapRequest: swapRequestId,
        relatedUser: userId
      };

      // You'll need to import your Notification model and controller here
      // and use them to save the notification
      // For example:
      // const newNotification = new Notification(notification);
      // await newNotification.save();
      // Replace the above lines with your actual notification creation logic

      res.status(201).json(savedSwapRequestInteraction);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all swap requests created by others which are placed by the current user
export const getSentSwapRequests = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        jwt.verify(token, import.meta.env.VITE_JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Failed to authenticate token' });
            }

            const userId = decoded.user.id;

            // Find swap request interactions for the current user
            const swapRequestInteractions = await SwapRequestInteraction.find({ user: userId })
                .populate({
                    path: 'swapRequest',
                    populate: [
                        { path: 'serviceCategory' },
                        { path: 'createdBy' }
                    ]
                })
                .exec();

            // Extract the swap requests from the interactions
            const swapRequests = swapRequestInteractions.map(interaction => interaction.swapRequest);

            // Filter out any null swap requests (if any interactions are invalid)
            const validSwapRequests = swapRequests.filter(swapRequest => swapRequest !== null);

            res.status(200).json(validSwapRequests);
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all swap request interactions for swap requests created by the current user
export const getReceivedSwapRequests = async (req, res) => {
 try {
   const token = req.headers.authorization?.split(' ')[1];
   if (!token) {
     return res.status(401).json({ message: 'No token provided' });
   }

   jwt.verify(token, import.meta.env.VITE_JWT_SECRET, async (err, decoded) => {
     if (err) {
       return res.status(403).json({ message: 'Failed to authenticate token' });
     }

     const userId = decoded.user.id;

     // Find swap requests created by the current user
     const swapRequests = await SwapRequest.find({ createdBy: userId }).select('_id');

     // Extract the IDs of the swap requests
     const swapRequestIds = swapRequests.map(swapRequest => swapRequest._id);

     // Find swap request interactions for the swap requests created by the current user
     const swapRequestInteractions = await SwapRequestInteraction.find({
       swapRequest: { $in: swapRequestIds }
     })
       .populate({
         path: 'swapRequest',
         populate: [
           { path: 'serviceCategory' },
           { path: 'createdBy' }
         ]
       })
       .populate('user')
       .exec();

     res.status(200).json(swapRequestInteractions);
   });
 } catch (err) {
   res.status(500).json({ message: err.message });
 }
};

// Approve a swap request interaction by ID
export const approveSwapRequestInteraction = async (req, res) => {
 try {
   const { id } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, import.meta.env.VITE_JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    const userId = decoded.user.id;

   const swapRequestInteraction = await SwapRequestInteraction.findById(id);

   if (!swapRequestInteraction) {
     return res.status(404).json({ message: 'Swap request interaction not found' });
   }

   swapRequestInteraction.status = 'accepted';
   
   await swapRequestInteraction.save();

   res.status(200).json({ message: 'Swap request interaction approved' });
    });
 } catch (err) {
   res.status(500).json({ message: err.message });
 }
};

// Reject a swap request interaction by ID
export const rejectSwapRequestInteraction = async (req, res) => {
 try {
   const { id } = req.params;

   const swapRequestInteraction = await SwapRequestInteraction.findById(id);

   if (!swapRequestInteraction) {
     return res.status(404).json({ message: 'Swap request interaction not found' });
   }

   swapRequestInteraction.status = 'rejected';
   await swapRequestInteraction.save();

   res.status(200).json({ message: 'Swap request interaction rejected' });
 } catch (err) {
   res.status(500).json({ message: err.message });
 }
};

// Get all approved swap requests for the current user
export const getApprovedSwapRequests = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, import.meta.env.VITE_JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
      }
      const userId = decoded.user.id;

      const approvedInteractions = await SwapRequestInteraction.aggregate([
        {
          $match: { status: 'accepted' }
        },
        {
          $lookup: {
            from: 'swaprequests',
            localField: 'swapRequest',
            foreignField: '_id',
            as: 'swapRequest'
          }
        },
        { $unwind: '$swapRequest' },
        {
          $match: {
            $or: [
              { user: new mongoose.Types.ObjectId(userId) },
              { 'swapRequest.createdBy': new mongoose.Types.ObjectId(userId) }
            ]
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $lookup: {
            from: 'categories',
            localField: 'swapRequest.serviceCategory',
            foreignField: '_id',
            as: 'swapRequest.serviceCategory'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'swapRequest.createdBy',
            foreignField: '_id',
            as: 'swapRequest.createdBy'
          }
        },
        {
          $unwind: {
            path: '$swapRequest.createdBy',
            preserveNullAndEmptyArrays: true
          }
        }
      ]);

    // Extract the swap requests from the interactions
    const swapRequests = approvedInteractions.map(interaction => {
      if (!interaction.swapRequest) {
        console.warn(`Swap request not found for interaction ID: ${interaction._id}`);
        return null; // Skip this interaction if swapRequest is null
      }
      interaction.swapRequest.interactionUser = interaction.user; // Add interaction user to swapRequest
      interaction.swapRequest.interactionStatus = interaction.status; // Add interaction status to swapRequest
      return interaction.swapRequest
    }).filter(swapRequest => swapRequest !== null);

      res.status(200).json(swapRequests);
    });
  } catch (err) {
    console.error("Error in getApprovedSwapRequests:", err); // Changed to console.error for consistency
    res.status(500).json({ message: err.message });
  }
};

// Add a status update to a swap request
export const addStatusUpdate = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, import.meta.env.VITE_JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
      }

      const userId = decoded.user.id;
      const swapRequestId = req.params.id;

      // Check if the user is involved in the swap request
      const swapRequestInteraction = await SwapRequestInteraction.findOne({
        swapRequest: swapRequestId,
        $or: [{ user: userId }, { swapRequest: { $in: (await SwapRequest.find({ createdBy: userId })).map(sr => sr._id) } }]
      });

      if (!swapRequestInteraction) {
        return res.status(404).json({ message: 'Swap request interaction not found' });
      }

      const { title, updateContent, percentage } = req.body;

      // Add the status update to the swap request interaction
      swapRequestInteraction.updates.push({
        user: userId,
        title: title,
        message: updateContent,
        percentage: percentage
      });

      // Conditionally set the interaction status based on percentage
      if (percentage === 100) {
        swapRequestInteraction.status = 'completed';
      } else if (percentage < 100) {
        // If an update is added with less than 100%, set status to 'pending'
        // This implies that if a project was completed and a new update is added
        // that brings the percentage below 100%, it reverts to pending.
        swapRequestInteraction.status = 'pending';
      }
      // If percentage is not provided or is null, status remains unchanged.

      await swapRequestInteraction.save();

      res.status(200).json({ message: 'Status update added' });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark a swap request as completed
export const markAsCompleted = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, import.meta.env.VITE_JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
      }

      const userId = decoded.user.id;
      const swapRequestId = req.params.id;

      // Check if the user is involved in the swap request
      const swapRequestInteraction = await SwapRequestInteraction.findOne({
        swapRequest: swapRequestId,
        $or: [{ user: userId }, { swapRequest: { $in: (await SwapRequest.find({ createdBy: userId })).map(sr => sr._id) } }]
      });

      if (!swapRequestInteraction) {
        return res.status(404).json({ message: 'Swap request interaction not found' });
      }

      // Add an automatic update for completion
      swapRequestInteraction.updates.push({
        user: userId, // The user marking it as completed
        title: 'Completed Project',
        message: 'The project has been marked as 100% completed.',
        percentage: 100
      });

      swapRequestInteraction.status = 'completed';
      await swapRequestInteraction.save();

      // Increment completedSwapsCount for both users involved
      const swapRequest = await SwapRequest.findById(swapRequestId);
      if (swapRequest) {
        await User.findByIdAndUpdate(swapRequest.createdBy, { $inc: { completedSwapsCount: 1 } });
        await User.findByIdAndUpdate(swapRequestInteraction.user, { $inc: { completedSwapsCount: 1 } });
      }

      res.status(200).json({ message: 'Swap request marked as completed' });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
