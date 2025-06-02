import express from "express";
import User from "../../models/user.js";
import Complaint from "../../models/complaint.js";
import SwapRequest from "../../models/swap_request.js";
import Organization from "../../models/organization.js";
import { verifyToken as auth } from "../auth/index.js";
import organizationAuth from "../../middleware/organizationAuth.js";

const router = express.Router();

// @route   GET /api/organization/stats/members/total
// @desc    Get total number of members for the organization
// @access  Private (Requires authentication and organization role)
router.get("/members/total", auth, organizationAuth, async (req, res) => {
  try {
    const organizationId = req.organization.id; // Assuming organization ID is available in req.organization
    const totalMembers = await User.countDocuments({ organization: organizationId });
    res.json({ totalMembers });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/organization/stats/complaints/total
// @desc    Get total number of complaints for the organization
// @access  Private (Requires authentication and organization role)
router.get("/complaints/total", auth, organizationAuth, async (req, res) => {
  try {
    const organizationId = req.organization.id;
    const totalComplaints = await Complaint.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $match: {
          'user.organization': organizationId
        }
      },
      {
        $count: 'totalComplaints'
      }
    ]);

    res.json({ totalComplaints: totalComplaints.length > 0 ? totalComplaints[0].totalComplaints : 0 });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/organization/stats/complaints/overview
// @desc    Get overview of complaint statuses for the organization (Total, Pending, In Progress, Resolved, Rejected)
// @access  Private (Requires authentication and organization role)
router.get("/complaints/overview", auth, organizationAuth, async (req, res) => {
  try {
    const organizationId = req.organization.id;

    const complaintStats = await Complaint.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $match: {
          'user.organization': organizationId
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalComplaints = complaintStats.reduce((acc, curr) => acc + curr.count, 0);
    const pendingComplaints = complaintStats.find(c => c._id === 'pending')?.count || 0;
    const inProgressComplaints = complaintStats.find(c => c._id === 'in_progress')?.count || 0;
    const resolvedComplaints = complaintStats.find(c => c._id === 'resolved')?.count || 0;
    const rejectedComplaints = complaintStats.find(c => c._id === 'rejected')?.count || 0;

    res.json({
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      rejectedComplaints,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/organization/stats/swaps/overview
// @desc    Get overview of swap request statuses for the organization (Total, Open, In Progress, Completed, Cancelled)
// @access  Private (Requires authentication and organization role)
router.get("/swaps/overview", auth, organizationAuth, async (req, res) => {
  try {
    const organizationId = req.organization.id;

    const swapStats = await SwapRequest.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'creator'
        }
      },
      {
        $unwind: '$creator'
      },
      {
        $match: {
          'creator.organization': organizationId
        }
      },
      {
        $group: {
          _id: '$requestStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalSwaps = swapStats.reduce((acc, curr) => acc + curr.count, 0);
    const openSwaps = swapStats.find(s => s._id === 'Open')?.count || 0;
    const inProgressSwaps = swapStats.find(s => s._id === 'In Progress')?.count || 0;
    const completedSwaps = swapStats.find(s => s._id === 'Completed')?.count || 0;
    const cancelledSwaps = swapStats.find(s => s._id === 'Cancelled')?.count || 0;

    res.json({
      totalSwaps,
      openSwaps,
      inProgressSwaps,
      completedSwaps,
      cancelledSwaps,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/organization/stats/performers
// @desc    Get best performers for the organization (e.g., users with most completed swaps)
// @access  Private (Requires authentication and organization role)
router.get("/performers", auth, organizationAuth, async (req, res) => {
  try {
    const organizationId = req.organization.id;

    const performers = await SwapRequest.aggregate([
      {
        $match: {
          requestStatus: 'Completed'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'creator'
        }
      },
      {
        $unwind: '$creator'
      },
      {
        $match: {
          'creator.organization': organizationId
        }
      },
      {
        $group: {
          _id: '$createdBy',
          completedSwaps: { $sum: 1 },
          name: { $first: '$creator.name' },
          profilePicture: { $first: '$creator.profilePicture' },
          skills: { $first: '$creator.skills' },
          city: { $first: '$creator.city' },
          yearsOfExperience: { $first: '$creator.yearsOfExperience' },
        }
      },
      {
        $sort: { completedSwaps: -1 }
      },
      {
        $limit: 3
      }
    ]);

    res.json({ performers });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


export default router;
