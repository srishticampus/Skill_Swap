import Workshop from '../../models/workshop.js';
import Organization from '../../models/organization.js';
import User from '../../models/user.js';
import Notification from '../../models/notification.js';

// @route   POST /api/organization/workshops
// @desc    Create a new workshop
// @access  Private (Organization only)
export const createWorkshop = async (req, res) => {
  try {
    const { title, description, date, time, location, maxAttendees } = req.body;
    const organizationId = req.organization.id; // Assuming organization ID is available from auth middleware

    const newWorkshop = new Workshop({
      organization: organizationId,
      title,
      description,
      date,
      time,
      location,
      maxAttendees: maxAttendees || null,
    });

    const workshop = await newWorkshop.save();

    // Notify all members of the organization about the new workshop
    const organizationMembers = await User.find({ organization: organizationId });
    const notifications = organizationMembers.map(member => ({
      user: member._id,
      type: 'New Workshop',
      message: `A new workshop "${title}" has been added by your organization.`,
      status: 'unread'
    }));
    await Notification.insertMany(notifications);

    res.status(201).json(workshop);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET /api/organization/workshops/my
// @desc    Get all workshops created by the organization
// @access  Private (Organization only)
export const getOrganizationWorkshops = async (req, res) => {
  try {
    const organizationId = req.organization.id;
    const workshops = await Workshop.find({ organization: organizationId }).populate('rsvpList.user', 'name email');
    res.json(workshops);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET /api/organization/workshops/members
// @desc    Get all workshops for organization members (from their organization)
// @access  Private (User only)
export const getAllWorkshopsForMembers = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from auth middleware
    const user = await User.findById(userId);

    if (!user || !user.organization) {
      return res.status(404).json({ msg: 'User not found or not part of an organization' });
    }

    const workshops = await Workshop.find({ organization: user.organization }).populate('organization', 'name');
    res.json(workshops);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST /api/organization/workshops/:id/rsvp
// @desc    RSVP to a workshop
// @access  Private (User only)
export const rsvpToWorkshop = async (req, res) => {
  try {
    const workshopId = req.params.id;
    const userId = req.user.id;

    const workshop = await Workshop.findById(workshopId);

    if (!workshop) {
      return res.status(404).json({ msg: 'Workshop not found' });
    }

    // Check if the workshop date and time has passed
    const workshopDateTime = new Date(`${workshop.date.toISOString().split('T')[0]}T${workshop.time}:00`);
    if (workshopDateTime < new Date()) {
      return res.status(400).json({ msg: 'Cannot RSVP to a workshop that has already ended.' });
    }

    // Check if user is already RSVP'd
    const isAlreadyRSVPd = workshop.rsvpList.some(rsvp => rsvp.user.toString() === userId);
    if (isAlreadyRSVPd) {
      return res.status(400).json({ msg: 'Already RSVPd to this workshop' });
    }

    // Check if max attendees limit is reached
    if (workshop.maxAttendees && workshop.rsvpList.length >= workshop.maxAttendees) {
      return res.status(400).json({ msg: 'Workshop is full, cannot RSVP' });
    }

    workshop.rsvpList.push({ user: userId });
    await workshop.save();

    // Notify the organization about the new RSVP
    const organization = await Organization.findById(workshop.organization);
    if (organization) {
      const notification = new Notification({
        user: organization._id, // Assuming organization ID can be used as user ID for notifications
        type: 'Workshop RSVP',
        message: `A user has RSVPd to your workshop "${workshop.title}".`,
        status: 'unread'
      });
      await notification.save();
    }

    res.json({ msg: 'RSVP successful', workshop });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @route   DELETE /api/organization/workshops/:id/rsvp
// @desc    Cancel RSVP to a workshop
// @access  Private (User only)
export const cancelRsvp = async (req, res) => {
  try {
    const workshopId = req.params.id;
    const userId = req.user.id;

    const workshop = await Workshop.findById(workshopId);

    if (!workshop) {
      return res.status(404).json({ msg: 'Workshop not found' });
    }

    // Check if the workshop date and time has passed
    const workshopDateTime = new Date(`${workshop.date.toISOString().split('T')[0]}T${workshop.time}:00`);
    if (workshopDateTime < new Date()) {
      return res.status(400).json({ msg: 'Cannot cancel RSVP for a workshop that has already ended.' });
    }

    // Remove user from rsvpList
    const initialLength = workshop.rsvpList.length;
    workshop.rsvpList = workshop.rsvpList.filter(
      rsvp => rsvp.user.toString() !== userId
    );

    if (workshop.rsvpList.length === initialLength) {
      return res.status(400).json({ msg: 'User not RSVPd to this workshop' });
    }

    await workshop.save();
    res.json({ msg: 'RSVP cancelled successfully', workshop });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT /api/organization/workshops/:id
// @desc    Update a workshop
// @access  Private (Organization only)
export const updateWorkshop = async (req, res) => {
  try {
    const { title, description, date, time, location, maxAttendees } = req.body;
    const workshopId = req.params.id;
    const organizationId = req.organization.id;

    let workshop = await Workshop.findById(workshopId);

    if (!workshop) {
      return res.status(404).json({ msg: 'Workshop not found' });
    }

    // Ensure organization owns the workshop
    if (workshop.organization.toString() !== organizationId) {
      return res.status(401).json({ msg: 'Not authorized to update this workshop' });
    }

    workshop.title = title || workshop.title;
    workshop.description = description || workshop.description;
    workshop.date = date || workshop.date;
    workshop.time = time || workshop.time;
    workshop.location = location || workshop.location;
    workshop.maxAttendees = maxAttendees !== undefined ? maxAttendees : workshop.maxAttendees;

    await workshop.save();
    res.json(workshop);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @route   DELETE /api/organization/workshops/:id
// @desc    Delete a workshop
// @access  Private (Organization only)
export const deleteWorkshop = async (req, res) => {
  try {
    const workshopId = req.params.id;
    const organizationId = req.organization.id;

    const workshop = await Workshop.findById(workshopId);

    if (!workshop) {
      return res.status(404).json({ msg: 'Workshop not found' });
    }

    // Ensure organization owns the workshop
    if (workshop.organization.toString() !== organizationId) {
      return res.status(401).json({ msg: 'Not authorized to delete this workshop' });
    }

    await Workshop.deleteOne({ _id: workshopId }); // Use deleteOne for Mongoose 6+
    res.json({ msg: 'Workshop removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
