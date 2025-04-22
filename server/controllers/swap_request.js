import SwapRequest from '../models/swap_request.js';
import jwt from 'jsonwebtoken';

// Create a new swap request
export const createSwapRequest = async (req, res) => {
  try {
    // Extract user ID from token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
      }

      const userId = decoded.id;
      const newSwapRequest = new SwapRequest({ ...req.body, createdBy: userId });
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
    const swapRequests = await SwapRequest.find();
    res.status(200).json(swapRequests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific swap request by ID
export const getSwapRequestById = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id);
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

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
      }

      const userId = decoded.id;
      const swapRequest = await SwapRequest.findById(req.params.id);

      if (!swapRequest) {
        return res.status(404).json({ message: 'Swap request not found' });
      }

      if (swapRequest.createdBy.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const updatedSwapRequest = await SwapRequest.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

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

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
      }

      const userId = decoded.id;
      const swapRequest = await SwapRequest.findById(req.params.id);

      if (!swapRequest) {
        return res.status(404).json({ message: 'Swap request not found' });
      }

      if (swapRequest.createdBy.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

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