import SwapRequest from '../models/swap_request.js';
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

// Get all swap requests
export const getAllSwapRequests = async (req, res) => {
  try {
    const { createdBy } = req.query; // Get createdBy from query parameters
    let query = {};

    if (createdBy) {
      // If createdBy query parameter is present, filter by that user ID
      query = { createdBy: createdBy };
    } else {
      // If no createdBy parameter, filter out requests created by the logged-in user
      // Extract user ID from token
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, import.meta.env.VITE_JWT_SECRET);
          const userId = decoded.user.id;
          query = { createdBy: { $ne: userId } };
        } catch (err) {
          // If token is invalid, proceed without filtering by logged-in user
          console.error('Error verifying token:', err);
        }
      }
    }

    // Find swap requests based on the constructed query
    const swapRequests = await SwapRequest.find(query)
      .populate('createdBy')
      .populate('serviceCategory');

    res.status(200).json(swapRequests);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific swap request by ID
export const getSwapRequestById = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id).populate('createdBy');
    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }
    res.status(200).json(swapRequest);
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