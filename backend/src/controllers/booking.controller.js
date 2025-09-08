import Booking from '../models/Booking.js';
import Court from '../models/Court.js';
import User from '../models/User.js';
import Notification from '../models/notification.model.js';

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const {
      courtId,
      date,
      time,
      duration = 1,
      players = 2,
      notes,
      paymentMethod = 'bank_transfer',
      bankDetails
    } = req.body;

    const userId = req.user.userId;

    // Validation
    if (!courtId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Court, date, and time are required'
      });
    }

    // Check if court exists and is available
    const court = await Court.findById(courtId);
    if (!court) {
      return res.status(404).json({
        success: false,
        message: 'Court not found'
      });
    }

    if (court.status !== 'Available') {
      return res.status(400).json({
        success: false,
        message: 'Court is not available for booking'
      });
    }

    // Check for existing bookings at the same time
    const existingBooking = await Booking.findOne({
      court: courtId,
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

    // Calculate total amount
    const totalAmount = court.pricePerHour * duration;

    // Set hold expiry time (10 minutes from now)
    const holdExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Create booking
    const booking = new Booking({
      court: courtId,
      user: userId,
      date,
      time,
      duration,
      players,
      totalAmount,
      holdExpiresAt,
      notes,
      paymentMethod,
      bankDetails
    });

    await booking.save();

    // Populate the booking with court and user details
    await booking.populate([
      { path: 'court', select: 'name location pricePerHour owner' },
      { path: 'user', select: 'name email phone' }
    ]);

    // Create notification for court owner
    if (court.owner) {
      await Notification.create({
        userId: court.owner,
        type: 'booking',
        message: `New booking request for ${court.name} on ${date} at ${time}`
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully. You have 10 minutes to complete payment.',
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

// Upload payment proof
export const uploadPaymentProof = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentProofUrl } = req.body;

    if (!paymentProofUrl) {
      return res.status(400).json({
        success: false,
        message: 'Payment proof URL is required'
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.userId,
      status: 'hold'
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or cannot be updated'
      });
    }

    // Check if booking is still within hold period
    if (new Date() > booking.holdExpiresAt) {
      booking.status = 'expired';
      await booking.save();
      return res.status(400).json({
        success: false,
        message: 'Booking has expired. Please create a new booking.'
      });
    }

    booking.paymentProofUrl = paymentProofUrl;
    booking.status = 'pending_verification';
    await booking.save();

    // Create notification for admin
    const adminUsers = await User.find({ role: 'admin' });
    for (const admin of adminUsers) {
      await Notification.create({
        userId: admin._id,
        type: 'payment',
        message: `Payment proof uploaded for booking #${booking._id}`
      });
    }

    res.json({
      success: true,
      message: 'Payment proof uploaded successfully. Your booking is pending verification.',
      data: booking
    });
  } catch (error) {
    console.error('Upload payment proof error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Verify booking payment (Admin only)
export const verifyBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { action } = req.body; // 'approve' or 'reject'

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
      
      // Create notification for user
      await Notification.create({
        userId: booking.user,
        type: 'booking',
        message: `Your booking for ${booking.court.name} has been confirmed!`
      });
    } else if (action === 'reject') {
      booking.status = 'cancelled';
      booking.cancellationReason = 'Payment verification failed';
      
      // Create notification for user
      await Notification.create({
        userId: booking.user,
        type: 'cancellation',
        message: `Your booking for ${booking.court.name} was rejected due to payment verification failure.`
      });
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

// Get user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { user: userId };
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(filter)
      .populate('court', 'name location pricePerHour images')
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
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get court owner's bookings
export const getCourtBookings = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const { courtId, status, page = 1, limit = 10 } = req.query;

    // Get owner's courts
    const courts = await Court.find({ owner: ownerId }).select('_id');
    const courtIds = courts.map(court => court._id);

    const filter = { court: { $in: courtIds } };
    if (courtId) {
      filter.court = courtId;
    }
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(filter)
      .populate('court', 'name location pricePerHour')
      .populate('user', 'name email phone')
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
    console.error('Get court bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.userId
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (!booking.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled. Less than 2 hours remaining.'
      });
    }

    const refundAmount = booking.calculateRefund();
    
    booking.status = 'cancelled';
    booking.cancellationReason = reason;
    booking.refundAmount = refundAmount;
    booking.refundStatus = refundAmount > 0 ? 'pending' : 'none';

    await booking.save();

    // Create notification for court owner
    const court = await Court.findById(booking.court);
    if (court && court.owner) {
      await Notification.create({
        userId: court.owner,
        type: 'cancellation',
        message: `Booking cancelled for ${court.name} on ${booking.date} at ${booking.time}`
      });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        ...booking.toObject(),
        refundAmount
      }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate('court', 'name location pricePerHour images owner')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user has permission to view this booking
    const userId = req.user.userId;
    const userRole = req.user.role;

    if (userRole !== 'admin' && 
        booking.user._id.toString() !== userId && 
        booking.court.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Expire bookings (called by cron job)
export const expireBookings = async () => {
  try {
    const expiredBookings = await Booking.find({
      status: 'hold',
      holdExpiresAt: { $lt: new Date() }
    });

    if (expiredBookings.length > 0) {
      await Booking.updateMany(
        { _id: { $in: expiredBookings.map(b => b._id) } },
        { status: 'expired' }
      );

      console.log(`Expired ${expiredBookings.length} bookings`);
    }
  } catch (error) {
    console.error('Error expiring bookings:', error);
  }
};

// Get booking statistics
export const getBookingStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    let matchFilter = {};
    
    if (userRole === 'owner') {
      const courts = await Court.find({ owner: userId }).select('_id');
      const courtIds = courts.map(court => court._id);
      matchFilter = { court: { $in: courtIds } };
    } else if (userRole === 'player') {
      matchFilter = { user: userId };
    }

    const stats = await Booking.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalBookings = await Booking.countDocuments(matchFilter);
    const totalRevenue = await Booking.aggregate([
      { $match: { ...matchFilter, status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        statusBreakdown: stats
      }
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};