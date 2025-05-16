import SwapRequest from '../models/swap_request.js';
import SwapRequestInteraction from '../models/swap_request_interaction.js'; // Import the SwapRequestInteraction model
import Category from '../models/category.js'; // Import Category model
import jwt from 'jsonwebtoken';
 
// Create a new swap request
export const createSwapRequest = async (req, res) => {
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
};

/** Get all swap requests with filtering and searching
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {void}
 * @throws {Error} Error if there is an issue with the request
 */
export const getAllSwapRequests = async (req, res) => {
  try {
    const { createdBy, searchTerm, serviceRequired, serviceCategory } = req.query;
    let query = {};

    // Filter by createdBy (either specific user or exclude logged-in user)
    if (createdBy) {
      query.createdBy = createdBy;
    } else {
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, import.meta.env.VITE_JWT_SECRET);
          const userId = decoded.user.id;
          query.createdBy = { $ne: userId };
        } catch (err) {
          console.error('Error verifying token:', err);
          // If token is invalid, proceed without filtering by logged-in user
          // No createdBy filter added to query
        }
      }
    }

    // Add searchTerm filter using $or for multiple fields
    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, 'i'); // Case-insensitive regex
      const searchConditions = {
        $or: [
          { serviceTitle: searchRegex },
          { serviceDetails: searchRegex },
          // You could potentially add searching on populated user fields here
          // but it would require Mongoose aggregation which is more complex.
          // For simplicity, sticking to SwapRequest fields for now.
        ]
      };

      // Combine search conditions with existing query conditions
      if (Object.keys(query).length > 0) {
        query = { $and: [query, searchConditions] };
      } else {
        query = searchConditions;
      }
    }

    // Add serviceRequired filter
    if (serviceRequired && serviceRequired !== 'any') {
       const serviceRequiredCondition = { serviceRequired: serviceRequired };
       if (Object.keys(query).length > 0) {
           query = { $and: [query, serviceRequiredCondition] };
       } else {
           query = serviceRequiredCondition;
       }
    }

    // Add serviceCategory filter
    // serviceCategory in the query is expected to be a single category ID string
    if (serviceCategory && serviceCategory !== 'any') {
       const serviceCategoryCondition = { serviceCategory: serviceCategory };
       if (Object.keys(query).length > 0) {
           query = { $and: [query, serviceCategoryCondition] };
       } else {
           query = serviceCategoryCondition;
       }
    }

    // Find swap requests based on the constructed query
    const swapRequests = await SwapRequest.find(query)
      .populate('serviceCategory')
      .populate('createdBy')
      .exec();
    
    // Extract user ID from token
    let userId = null;
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, import.meta.env.VITE_JWT_SECRET);
        userId = decoded.user.id;
      } catch (err) {
        console.error('Error verifying token:', err);
        // If token is invalid, proceed without filtering by logged-in user
        // No createdBy filter added to query
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
    console.error('Error fetching swap requests:', err); // Log the error details on the server
    res.status(500).json({ message: 'Failed to fetch swap requests', error: err.message });
  }
};

// Get a specific swap request by ID
export const getSwapRequestById = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id)
      .populate('createdBy')
      .populate({ path: "serviceCategory", select: "_id name" });

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Find the corresponding SwapRequestInteraction to get the updates
    const swapRequestInteraction = await SwapRequestInteraction.findOne({ swapRequest: req.params.id });

    if (!swapRequestInteraction) {
      return res.status(404).json({ message: 'Swap request interaction not found' });
    }

    // Populate the updates array in the swapRequestInteraction
    await swapRequestInteraction.populate('updates.user');

    const swapRequestData = {
      ...swapRequest.toObject(),
      updates: swapRequestInteraction.updates || []
    };

    res.status(200).json(swapRequestData);
  } catch (err) {
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

   const swapRequestInteraction = await SwapRequestInteraction.findById(id);

   if (!swapRequestInteraction) {
     return res.status(404).json({ message: 'Swap request interaction not found' });
   }

   swapRequestInteraction.status = 'accepted';
   await swapRequestInteraction.save();

   res.status(200).json({ message: 'Swap request interaction approved' });
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
    console.log("getApprovedSwapRequests: token:", token);
    jwt.verify(token, import.meta.env.VITE_JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
      }
      console.log("getApprovedSwapRequests: decoded:", decoded);
      const userId = decoded.user.id;

      // Find swap request interactions where the user is involved and the status is 'accepted'
      const approvedInteractions = await SwapRequestInteraction.find({
        $or: [
          { user: userId },
          { 'swapRequest.createdBy': userId }
        ],
        status: 'accepted'
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

    // Extract the swap requests from the interactions
    const swapRequests = approvedInteractions.map(interaction => interaction.swapRequest);

      res.status(200).json(swapRequests);
    });
  } catch (err) {
    console.log("Error in getApprovedSwapRequests:", err);
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

      // Add the status update to the swap request interaction
      swapRequestInteraction.updates.push({
        user: userId,
        content: req.body.updateContent
      });

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

      swapRequestInteraction.status = 'completed';
      await swapRequestInteraction.save();

      res.status(200).json({ message: 'Swap request marked as completed' });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};