import Court from '../models/Court.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

// Get all courts with search and filtering
export const getCourts = async (req, res) => {
  try {
    const {
      search,
      location,
      type,
      surface,
      minPrice,
      maxPrice,
      isFeatured,
      status = 'Available',
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { status };

    if (search) {
      filter.$text = { $search: search };
    }

    if (location) {
      filter.$or = [
        { location: { $regex: location, $options: 'i' } },
        { 'address.city': { $regex: location, $options: 'i' } }
      ];
    }

    if (type) {
      filter.type = type;
    }

    if (surface) {
      filter.surface = surface;
    }

    if (minPrice || maxPrice) {
      filter.pricePerHour = {};
      if (minPrice) filter.pricePerHour.$gte = parseFloat(minPrice);
      if (maxPrice) filter.pricePerHour.$lte = parseFloat(maxPrice);
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true';
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const courts = await Court.find(filter)
      .populate('owner', 'name email phone')
      .sort(sort)
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
    console.error('Get courts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get featured courts
export const getFeaturedCourts = async (req, res) => {
  try {
    const courts = await Court.find({ 
      isFeatured: true, 
      status: 'Available' 
    })
    .populate('owner', 'name email phone')
    .sort({ createdAt: -1 })
    .limit(6);

    res.json({
      success: true,
      data: courts
    });
  } catch (error) {
    console.error('Get featured courts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get single court by ID
export const getCourtById = async (req, res) => {
  try {
    const { id } = req.params;

    const court = await Court.findById(id)
      .populate('owner', 'name email phone');

    if (!court) {
      return res.status(404).json({
        success: false,
        message: 'Court not found'
      });
    }

    res.json({
      success: true,
      data: court
    });
  } catch (error) {
    console.error('Get court by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Check court availability
export const checkAvailability = async (req, res) => {
  try {
    const { courtId, date, time, duration = 1 } = req.params;

    const court = await Court.findById(courtId);
    if (!court) {
      return res.status(404).json({
        success: false,
        message: 'Court not found'
      });
    }

    // Check if court is available
    if (court.status !== 'Available') {
      return res.json({
        success: true,
        available: false,
        reason: 'Court is not available'
      });
    }

    // Check for existing bookings
    const existingBookings = await Booking.find({
      court: courtId,
      date,
      status: { $in: ['hold', 'pending_verification', 'confirmed'] }
    });

    // Check if requested time slot conflicts with existing bookings
    const requestedTime = time;
    const requestedDuration = parseInt(duration);
    
    const isAvailable = !existingBookings.some(booking => {
      const bookingTime = booking.time;
      const bookingDuration = booking.duration || 1;
      
      // Check for time overlap
      const requestedStart = requestedTime;
      const requestedEnd = addHours(requestedTime, requestedDuration);
      const bookingStart = bookingTime;
      const bookingEnd = addHours(bookingTime, bookingDuration);
      
      return (requestedStart < bookingEnd && requestedEnd > bookingStart);
    });

    res.json({
      success: true,
      available: isAvailable,
      court: {
        id: court._id,
        name: court.name,
        pricePerHour: court.pricePerHour
      }
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create new court (Owner only)
export const createCourt = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const courtData = {
      ...req.body,
      owner: ownerId
    };

    const court = new Court(courtData);
    await court.save();

    await court.populate('owner', 'name email phone');

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

// Update court (Owner only)
export const updateCourt = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.userId;

    const court = await Court.findOne({ _id: id, owner: ownerId });
    if (!court) {
      return res.status(404).json({
        success: false,
        message: 'Court not found or you do not have permission to update it'
      });
    }

    const updatedCourt = await Court.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'name email phone');

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

// Delete court (Owner only)
export const deleteCourt = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.userId;

    const court = await Court.findOne({ _id: id, owner: ownerId });
    if (!court) {
      return res.status(404).json({
        success: false,
        message: 'Court not found or you do not have permission to delete it'
      });
    }

    // Check if there are any active bookings
    const activeBookings = await Booking.countDocuments({
      court: id,
      status: { $in: ['hold', 'pending_verification', 'confirmed'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete court with active bookings'
      });
    }

    await Court.findByIdAndDelete(id);

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

// Get owner's courts
export const getOwnerCourts = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const courts = await Court.find({ owner: ownerId })
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Court.countDocuments({ owner: ownerId });

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
    console.error('Get owner courts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Toggle court featured status (Admin only)
export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    const court = await Court.findById(id);
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
    console.error('Toggle featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Helper function to add hours to time string
function addHours(timeString, hours) {
  const [hoursStr, minutesStr] = timeString.split(':');
  const totalMinutes = parseInt(hoursStr) * 60 + parseInt(minutesStr) + (hours * 60);
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
}