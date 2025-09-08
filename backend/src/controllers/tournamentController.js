import Tournament from '../models/Tournament.js';
import Registration from '../models/Registration.js';
import User from '../models/User.js';
import Notification from '../models/notification.model.js';

// Get all tournaments with search and filtering
export const getTournaments = async (req, res) => {
  try {
    const {
      search,
      location,
      skillLevel,
      status = 'upcoming',
      isApproved = true,
      page = 1,
      limit = 10,
      sortBy = 'startDate',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = { isApproved };

    if (search) {
      filter.$text = { $search: search };
    }

    if (location) {
      filter.$or = [
        { location: { $regex: location, $options: 'i' } },
        { 'address.city': { $regex: location, $options: 'i' } }
      ];
    }

    if (skillLevel) {
      filter.skillLevel = skillLevel;
    }

    if (status) {
      filter.status = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const tournaments = await Tournament.find(filter)
      .populate('organizer', 'name email phone')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Tournament.countDocuments(filter);

    res.json({
      success: true,
      data: tournaments,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get tournaments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get single tournament by ID
export const getTournamentById = async (req, res) => {
  try {
    const { id } = req.params;

    const tournament = await Tournament.findById(id)
      .populate('organizer', 'name email phone')
      .populate('approvedBy', 'name email');

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    res.json({
      success: true,
      data: tournament
    });
  } catch (error) {
    console.error('Get tournament by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create new tournament (Organizer only)
export const createTournament = async (req, res) => {
  try {
    const organizerId = req.user.userId;
    const tournamentData = {
      ...req.body,
      organizer: organizerId
    };

    // Validate dates
    const { startDate, endDate, registrationDeadline } = tournamentData;
    const now = new Date();

    if (new Date(startDate) <= now) {
      return res.status(400).json({
        success: false,
        message: 'Start date must be in the future'
      });
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    if (new Date(registrationDeadline) <= now) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline must be in the future'
      });
    }

    if (new Date(registrationDeadline) >= new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline must be before start date'
      });
    }

    const tournament = new Tournament(tournamentData);
    await tournament.save();

    await tournament.populate('organizer', 'name email phone');

    // Create notification for admin
    const adminUsers = await User.find({ role: 'admin' });
    for (const admin of adminUsers) {
      await Notification.create({
        userId: admin._id,
        type: 'booking',
        message: `New tournament "${tournament.title}" submitted for approval`
      });
    }

    res.status(201).json({
      success: true,
      message: 'Tournament created successfully. Awaiting admin approval.',
      data: tournament
    });
  } catch (error) {
    console.error('Create tournament error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update tournament (Organizer only)
export const updateTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const organizerId = req.user.userId;

    const tournament = await Tournament.findOne({ 
      _id: id, 
      organizer: organizerId 
    });

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found or you do not have permission to update it'
      });
    }

    // Check if tournament can be updated
    if (tournament.status === 'ongoing' || tournament.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update tournament that is ongoing or completed'
      });
    }

    const updatedTournament = await Tournament.findByIdAndUpdate(
      id,
      { ...req.body, isApproved: false }, // Reset approval status
      { new: true, runValidators: true }
    ).populate('organizer', 'name email phone');

    res.json({
      success: true,
      message: 'Tournament updated successfully. Awaiting admin approval.',
      data: updatedTournament
    });
  } catch (error) {
    console.error('Update tournament error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete tournament (Organizer only)
export const deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const organizerId = req.user.userId;

    const tournament = await Tournament.findOne({ 
      _id: id, 
      organizer: organizerId 
    });

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found or you do not have permission to delete it'
      });
    }

    // Check if tournament can be deleted
    if (tournament.status === 'ongoing' || tournament.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete tournament that is ongoing or completed'
      });
    }

    // Check if there are any registrations
    const registrationsCount = await Registration.countDocuments({ tournament: id });
    if (registrationsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete tournament with existing registrations'
      });
    }

    await Tournament.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Tournament deleted successfully'
    });
  } catch (error) {
    console.error('Delete tournament error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Register for tournament
export const registerForTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const {
      name,
      email,
      phone,
      teamName,
      skillLevel,
      partnerName,
      partnerEmail,
      partnerPhone,
      emergencyContact,
      registrationNotes
    } = req.body;

    const userId = req.user.userId;

    // Check if tournament exists and is open for registration
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    if (!tournament.isRegistrationOpen) {
      return res.status(400).json({
        success: false,
        message: 'Registration is not open for this tournament'
      });
    }

    // Check if user is already registered
    if (tournament.isUserRegistered(email)) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this tournament'
      });
    }

    // Create registration
    const registration = new Registration({
      tournament: tournamentId,
      user: userId,
      name,
      email,
      phone,
      teamName,
      skillLevel,
      partnerName,
      partnerEmail,
      partnerPhone,
      emergencyContact,
      paymentAmount: tournament.entryFee,
      registrationNotes
    });

    await registration.save();

    // Add participant to tournament
    await tournament.addParticipant({
      name,
      email,
      phone,
      teamName,
      skillLevel,
      registrationDate: new Date()
    });

    // Create notification for organizer
    await Notification.create({
      userId: tournament.organizer,
      type: 'booking',
      message: `New registration for tournament "${tournament.title}"`
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please complete payment to confirm your spot.',
      data: registration
    });
  } catch (error) {
    console.error('Register for tournament error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get tournament registrations (Organizer only)
export const getTournamentRegistrations = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const organizerId = req.user.userId;

    // Check if user is the organizer
    const tournament = await Tournament.findOne({ 
      _id: tournamentId, 
      organizer: organizerId 
    });

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found or you do not have permission to view registrations'
      });
    }

    const registrations = await Registration.find({ tournament: tournamentId })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: registrations
    });
  } catch (error) {
    console.error('Get tournament registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get organizer's tournaments
export const getOrganizerTournaments = async (req, res) => {
  try {
    const organizerId = req.user.userId;
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { organizer: organizerId };
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tournaments = await Tournament.find(filter)
      .populate('organizer', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Tournament.countDocuments(filter);

    res.json({
      success: true,
      data: tournaments,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get organizer tournaments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Approve/Reject tournament (Admin only)
export const approveTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { action, rejectionReason } = req.body; // 'approve' or 'reject'

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    if (action === 'approve') {
      tournament.isApproved = true;
      tournament.approvedBy = req.user.userId;
      tournament.approvedAt = new Date();
      tournament.status = 'registration_open';
      
      // Create notification for organizer
      await Notification.create({
        userId: tournament.organizer,
        type: 'booking',
        message: `Your tournament "${tournament.title}" has been approved!`
      });
    } else if (action === 'reject') {
      tournament.isApproved = false;
      tournament.rejectionReason = rejectionReason;
      
      // Create notification for organizer
      await Notification.create({
        userId: tournament.organizer,
        type: 'cancellation',
        message: `Your tournament "${tournament.title}" was rejected. Reason: ${rejectionReason}`
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use "approve" or "reject"'
      });
    }

    await tournament.save();

    res.json({
      success: true,
      message: `Tournament ${action}d successfully`,
      data: tournament
    });
  } catch (error) {
    console.error('Approve tournament error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get tournament statistics
export const getTournamentStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    let matchFilter = {};
    
    if (userRole === 'organizer') {
      matchFilter = { organizer: userId };
    }

    const stats = await Tournament.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalTournaments = await Tournament.countDocuments(matchFilter);
    const totalRegistrations = await Registration.countDocuments({
      tournament: { $in: await Tournament.find(matchFilter).select('_id') }
    });

    res.json({
      success: true,
      data: {
        totalTournaments,
        totalRegistrations,
        statusBreakdown: stats
      }
    });
  } catch (error) {
    console.error('Get tournament stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};