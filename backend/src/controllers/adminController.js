import User from '../models/User.js';
import Court from '../models/Court.js';
import Tournament from '../models/Tournament.js';
import Booking from '../models/Booking.js';
import Registration from '../models/Registration.js';
import Notification from '../models/notification.model.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCourts,
      totalTournaments,
      totalBookings,
      pendingBookings,
      pendingTournaments
    ] = await Promise.all([
      User.countDocuments(),
      Court.countDocuments(),
      Tournament.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending_verification' }),
      Tournament.countDocuments({ isApproved: false })
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalCourts,
        totalTournaments,
        totalBookings,
        pendingBookings,
        pendingTournaments
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const { role, isActive, search, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update user status
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive, role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const updateData = {};
    if (isActive !== undefined) updateData.isActive = isActive;
    if (role) updateData.role = role;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Toggle court featured status
export const toggleCourtFeatured = async (req, res) => {
  try {
    const { courtId } = req.params;

    const court = await Court.findById(courtId);
    if (!court) {
      return res.status(404).json({
        success: false,
        message: 'Court not found'
      });
    }

    court.isFeatured = !court.isFeatured;
    await court.save();

    res.json({
      success: true,
      message: `Court ${court.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      data: court
    });
  } catch (error) {
    console.error('Toggle court featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Approve/Reject tournament
export const approveTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { action, rejectionReason } = req.body;

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
    } else if (action === 'reject') {
      tournament.isApproved = false;
      tournament.rejectionReason = rejectionReason;
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

// Verify booking payment
export const verifyBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { action } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'pending_verification') {
      return res.status(400).json({
        success: false,
        message: 'Booking is not pending verification'
      });
    }

    if (action === 'approve') {
      booking.status = 'confirmed';
    } else if (action === 'reject') {
      booking.status = 'cancelled';
      booking.cancellationReason = 'Payment verification failed';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use "approve" or "reject"'
      });
    }

    await booking.save();

    res.json({
      success: true,
      message: `Booking ${action}d successfully`,
      data: booking
    });
  } catch (error) {
    console.error('Verify booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// === COURT CRUD OPERATIONS ===

// Get all courts for admin
export const getAllCourts = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const courts = await Court.find(filter)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Court.countDocuments(filter);

    res.json({
      success: true,
      data: courts,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all courts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create court (Admin)
export const createCourt = async (req, res) => {
  try {
    const courtData = {
      ...req.body,
      owner: req.user.userId,
      images: req.files ? req.files.map(file => file.path) : []
    };

    const court = new Court(courtData);
    await court.save();

    await court.populate('owner', 'name email');

    res.status(201).json({
      success: true,
      message: 'Court created successfully',
      data: court
    });
  } catch (error) {
    console.error('Create court error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update court (Admin)
export const updateCourt = async (req, res) => {
  try {
    const { courtId } = req.params;
    const updateData = {
      ...req.body,
      images: req.files ? req.files.map(file => file.path) : undefined
    };

    const court = await Court.findById(courtId);
    if (!court) {
      return res.status(404).json({
        success: false,
        message: 'Court not found'
      });
    }

    const updatedCourt = await Court.findByIdAndUpdate(
      courtId,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner', 'name email');

    res.json({
      success: true,
      message: 'Court updated successfully',
      data: updatedCourt
    });
  } catch (error) {
    console.error('Update court error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete court (Admin)
export const deleteCourt = async (req, res) => {
  try {
    const { courtId } = req.params;

    const court = await Court.findById(courtId);
    if (!court) {
      return res.status(404).json({
        success: false,
        message: 'Court not found'
      });
    }

    // Check if court has active bookings
    const activeBookings = await Booking.countDocuments({
      court: courtId,
      status: { $in: ['confirmed', 'pending_verification'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete court with active bookings'
      });
    }

    await Court.findByIdAndDelete(courtId);

    res.json({
      success: true,
      message: 'Court deleted successfully'
    });
  } catch (error) {
    console.error('Delete court error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// === TOURNAMENT CRUD OPERATIONS ===

// Get all tournaments for admin
export const getAllTournaments = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const tournaments = await Tournament.find(filter)
      .populate('organizer', 'name email')
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
    console.error('Get all tournaments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create tournament (Admin)
export const createTournament = async (req, res) => {
  try {
    const tournamentData = {
      ...req.body,
      organizer: req.user.userId,
      images: req.files ? req.files.map(file => file.path) : [],
      isApproved: true, // Admin created tournaments are auto-approved
      approvedBy: req.user.userId,
      approvedAt: new Date()
    };

    const tournament = new Tournament(tournamentData);
    await tournament.save();

    await tournament.populate('organizer', 'name email');

    res.status(201).json({
      success: true,
      message: 'Tournament created successfully',
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

// Update tournament (Admin)
export const updateTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const updateData = {
      ...req.body,
      images: req.files ? req.files.map(file => file.path) : undefined
    };

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    const updatedTournament = await Tournament.findByIdAndUpdate(
      tournamentId,
      updateData,
      { new: true, runValidators: true }
    ).populate('organizer', 'name email');

    res.json({
      success: true,
      message: 'Tournament updated successfully',
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

// Delete tournament (Admin)
export const deleteTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Check if tournament has registrations
    const registrations = await Registration.countDocuments({ tournament: tournamentId });
    if (registrations > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete tournament with existing registrations'
      });
    }

    await Tournament.findByIdAndDelete(tournamentId);

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

// === BOOKING CRUD OPERATIONS ===

// Get all bookings for admin
export const getAllBookings = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { 'court.name': { $regex: search, $options: 'i' } },
        { 'user.name': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const bookings = await Booking.find(filter)
      .populate('court', 'name location')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create booking (Admin)
export const createBooking = async (req, res) => {
  try {
    const {
      courtId,
      userId,
      date,
      time,
      duration = 1,
      players = 2,
      notes,
      paymentMethod = 'cash',
      totalAmount
    } = req.body;

    // Find court by name or ID
    let court;
    if (courtId.match(/^[0-9a-fA-F]{24}$/)) {
      // If it's a valid ObjectId, find by ID
      court = await Court.findById(courtId);
    } else {
      // Otherwise, find by name
      court = await Court.findOne({ name: courtId });
    }

    if (!court) {
      return res.status(404).json({
        success: false,
        message: 'Court not found'
      });
    }

    // Find user by name or ID
    let user;
    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
      // If it's a valid ObjectId, find by ID
      user = await User.findById(userId);
    } else {
      // Otherwise, find by name
      user = await User.findOne({ name: userId });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check for existing bookings
    const existingBooking = await Booking.findOne({
      court: court._id,
      date,
      time,
      status: { $in: ['hold', 'pending_verification', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    // Calculate total amount if not provided
    const finalAmount = totalAmount || (court.pricePerHour * duration);

    // Create booking
    const booking = new Booking({
      court: court._id,
      user: user._id,
      date,
      time,
      duration,
      players,
      totalAmount: finalAmount,
      status: 'confirmed', // Admin created bookings are auto-confirmed
      notes,
      paymentMethod,
      paymentProofUrl: 'admin_created' // Mark as admin created
    });

    await booking.save();

    // Populate the booking
    await booking.populate([
      { path: 'court', select: 'name location pricePerHour' },
      { path: 'user', select: 'name email phone' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update booking (Admin)
export const updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const updateData = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Handle court and user name resolution for updates
    if (updateData.courtId) {
      let court;
      if (updateData.courtId.match(/^[0-9a-fA-F]{24}$/)) {
        court = await Court.findById(updateData.courtId);
      } else {
        court = await Court.findOne({ name: updateData.courtId });
      }

      if (!court) {
        return res.status(404).json({
          success: false,
          message: 'Court not found'
        });
      }
      updateData.court = court._id;
    }

    if (updateData.userId) {
      let user;
      if (updateData.userId.match(/^[0-9a-fA-F]{24}$/)) {
        user = await User.findById(updateData.userId);
      } else {
        user = await User.findOne({ name: updateData.userId });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      updateData.user = user._id;
    }

    // If changing court, date, or time, check for conflicts
    if (updateData.court || updateData.date || updateData.time) {
      const conflictFilter = {
        _id: { $ne: bookingId },
        status: { $in: ['hold', 'pending_verification', 'confirmed'] }
      };

      if (updateData.court) conflictFilter.court = updateData.court;
      else conflictFilter.court = booking.court;

      if (updateData.date) conflictFilter.date = updateData.date;
      else conflictFilter.date = booking.date;

      if (updateData.time) conflictFilter.time = updateData.time;
      else conflictFilter.time = booking.time;

      const existingBooking = await Booking.findOne(conflictFilter);
      if (existingBooking) {
        return res.status(400).json({
          success: false,
          message: 'This time slot is already booked'
        });
      }
    }

    // Remove the name fields from updateData since we're using the resolved IDs
    delete updateData.courtId;
    delete updateData.userId;

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'court', select: 'name location pricePerHour' },
      { path: 'user', select: 'name email phone' }
    ]);

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete booking (Admin)
export const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    await Booking.findByIdAndDelete(bookingId);

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
