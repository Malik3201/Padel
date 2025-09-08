# Padel Booking System - API Integration Guide

This guide explains how to use the comprehensive API integration that has been implemented in the Padel Booking System frontend.

## 🚀 Overview

The frontend now includes a complete API integration layer that connects to the backend API documented in the provided API documentation. All major functionality is now connected to real API endpoints.

## 📁 Project Structure

```
src/
├── services/           # API service layer
│   ├── api.js         # Base API configuration
│   ├── authService.js # Authentication services
│   ├── courtService.js # Court management services
│   ├── bookingService.js # Booking system services
│   ├── tournamentService.js # Tournament services
│   ├── adminService.js # Admin panel services
│   ├── notificationService.js # Notification services
│   └── index.js       # Centralized exports
├── contexts/          # React contexts for state management
│   ├── AuthContext.jsx # Authentication context
│   └── NotificationContext.jsx # Notification context
├── hooks/             # Custom React hooks
│   └── useApi.js      # API hooks for data fetching
└── components/        # Example components using APIs
    ├── CourtsList.jsx # Court listing component
    └── BookingsList.jsx # Booking listing component
```

## 🔧 API Services

### 1. Authentication Service (`authService.js`)

Handles user authentication and profile management.

```javascript
import { authService } from '@/services/authService';

// Register a new user
const response = await authService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  phone: '+1234567890',
  role: 'player' // player, owner, organizer, admin
});

// Login user
const response = await authService.login({
  email: 'john@example.com',
  password: 'password123'
});

// Get current user
const user = await authService.getCurrentUser();

// Update profile
const response = await authService.updateProfile({
  name: 'John Updated',
  phone: '+1234567890',
  address: {
    street: '456 New St',
    city: 'Lahore',
    state: 'Punjab',
    zipCode: '54000'
  }
});

// Change password
await authService.changePassword({
  currentPassword: 'oldpassword',
  newPassword: 'newpassword123'
});
```

### 2. Court Service (`courtService.js`)

Manages court listings, creation, and management.

```javascript
import { courtService } from '@/services/courtService';

// Get all courts with filters
const courts = await courtService.getCourts({
  search: 'indoor',
  location: 'karachi',
  type: 'Indoor',
  surface: 'Synthetic',
  minPrice: 1000,
  maxPrice: 5000,
  isFeatured: true,
  page: 1,
  limit: 10
});

// Get featured courts
const featuredCourts = await courtService.getFeaturedCourts();

// Get court by ID
const court = await courtService.getCourtById('court_id');

// Check court availability
const availability = await courtService.checkAvailability(
  'court_id',
  '2024-01-15',
  '14:00',
  2
);

// Create court (Owner only)
const newCourt = await courtService.createCourt({
  name: 'New Court',
  location: 'Sports Complex',
  address: {
    street: '123 Main St',
    city: 'Karachi',
    state: 'Sindh',
    zipCode: '75000'
  },
  pricePerHour: 2000,
  type: 'Indoor',
  surface: 'Synthetic',
  description: 'High-quality synthetic court',
  amenities: [
    { name: 'Parking', available: true },
    { name: 'Changing Room', available: true }
  ],
  operatingHours: {
    monday: { open: '06:00', close: '22:00', closed: false },
    tuesday: { open: '06:00', close: '22:00', closed: false }
  },
  rules: ['No smoking', 'Proper sports attire required'],
  maxPlayers: 4,
  images: [file1, file2] // File objects
});
```

### 3. Booking Service (`bookingService.js`)

Handles court bookings and payment management.

```javascript
import { bookingService } from '@/services/bookingService';

// Create booking
const booking = await bookingService.createBooking({
  courtId: 'court_id',
  date: '2024-01-15',
  time: '14:00',
  duration: 2,
  players: 4,
  notes: 'Birthday party booking',
  paymentMethod: 'bank_transfer',
  bankDetails: {
    accountName: 'Padel Court Booking',
    accountNumber: '1234567890',
    bankName: 'ABC Bank',
    branchCode: '001'
  }
});

// Upload payment proof
await bookingService.uploadPaymentProof(bookingId, paymentProofFile);

// Get user's bookings
const bookings = await bookingService.getUserBookings({
  status: 'confirmed',
  page: 1,
  limit: 10
});

// Cancel booking
await bookingService.cancelBooking(bookingId, 'Change of plans');

// Get booking by ID
const booking = await bookingService.getBookingById(bookingId);
```

### 4. Tournament Service (`tournamentService.js`)

Manages tournaments and registrations.

```javascript
import { tournamentService } from '@/services/tournamentService';

// Get all tournaments
const tournaments = await tournamentService.getTournaments({
  search: 'championship',
  location: 'karachi',
  skillLevel: 'Intermediate',
  status: 'registration_open',
  page: 1,
  limit: 10
});

// Create tournament (Organizer only)
const tournament = await tournamentService.createTournament({
  title: 'Summer Championship 2024',
  description: 'Annual summer padel tournament',
  startDate: '2024-06-15T09:00:00.000Z',
  endDate: '2024-06-17T18:00:00.000Z',
  registrationDeadline: '2024-06-10T23:59:59.000Z',
  location: 'Sports Complex',
  address: {
    street: '123 Sports Ave',
    city: 'Karachi',
    state: 'Sindh',
    zipCode: '75000'
  },
  maxParticipants: 32,
  entryFee: 5000,
  prizePool: {
    winner: 50000,
    runnerUp: 25000,
    thirdPlace: 10000
  },
  skillLevel: 'Intermediate',
  format: 'Doubles',
  rules: ['No smoking', 'Proper attire required'],
  requirements: ['Valid ID', 'Medical certificate'],
  images: [file1, file2] // File objects
});

// Register for tournament
await tournamentService.registerForTournament(tournamentId, {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  teamName: 'Team Alpha',
  skillLevel: 'Intermediate',
  partnerName: 'Jane Smith',
  partnerEmail: 'jane@example.com',
  partnerPhone: '+1234567891',
  emergencyContact: {
    name: 'Emergency Contact',
    phone: '+1234567892',
    relationship: 'Spouse'
  },
  registrationNotes: 'Looking forward to the tournament'
});
```

### 5. Admin Service (`adminService.js`)

Provides admin panel functionality.

```javascript
import { adminService } from '@/services/adminService';

// Get dashboard statistics
const stats = await adminService.getDashboardStats();

// Get all users
const users = await adminService.getUsers({
  role: 'player',
  isActive: true,
  search: 'john',
  page: 1,
  limit: 10
});

// Update user status
await adminService.updateUserStatus(userId, {
  isActive: false,
  role: 'admin'
});

// Toggle court featured status
await adminService.toggleCourtFeatured(courtId);

// Approve tournament
await adminService.approveTournament(tournamentId, 'approve');

// Verify booking payment
await adminService.verifyBookingPayment(bookingId, 'approve');
```

### 6. Notification Service (`notificationService.js`)

Manages user notifications.

```javascript
import { notificationService } from '@/services/notificationService';

// Get user notifications
const notifications = await notificationService.getNotifications({
  read: false,
  type: 'booking',
  page: 1,
  limit: 20
});

// Mark notification as read
await notificationService.markAsRead(notificationId);

// Mark all notifications as read
await notificationService.markAllAsRead();

// Delete notification
await notificationService.deleteNotification(notificationId);
```

## 🎣 React Hooks

### 1. useApi Hook

A custom hook for API calls with loading, error, and data states.

```javascript
import { useApi } from '@/hooks/useApi';
import { courtService } from '@/services/courtService';

const MyComponent = () => {
  // Basic usage
  const { data, loading, error, execute } = useApi(
    () => courtService.getCourts(),
    [],
    true // immediate execution
  );

  // With dependencies
  const { data, loading, error } = useApi(
    () => courtService.getCourts(filters),
    [filters],
    true
  );

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {data && <div>Data: {JSON.stringify(data)}</div>}
    </div>
  );
};
```

### 2. usePaginatedApi Hook

For paginated data with load more functionality.

```javascript
import { usePaginatedApi } from '@/hooks/useApi';
import { courtService } from '@/services/courtService';

const CourtsPage = () => {
  const {
    data,
    pagination,
    loading,
    error,
    filters,
    fetchData,
    loadMore,
    refresh,
    updateFilters
  } = usePaginatedApi(courtService.getCourts, { page: 1, limit: 10 });

  return (
    <div>
      {data.map(court => (
        <div key={court.id}>{court.name}</div>
      ))}
      {pagination && pagination.current < pagination.pages && (
        <button onClick={loadMore}>Load More</button>
      )}
    </div>
  );
};
```

### 3. useFormSubmit Hook

For form submissions with loading and error states.

```javascript
import { useFormSubmit } from '@/hooks/useApi';
import { authService } from '@/services/authService';

const LoginForm = () => {
  const { loading, error, success, submit, reset } = useFormSubmit(authService.login);

  const handleSubmit = async (formData) => {
    try {
      await submit(formData);
      // Handle success
    } catch (err) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};
```

## 🎯 React Contexts

### 1. AuthContext

Provides authentication state and methods throughout the app.

```javascript
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError
  } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  return <div>Welcome, {user.name}!</div>;
};
```

### 2. NotificationContext

Manages notifications throughout the app.

```javascript
import { useNotifications } from '@/contexts/NotificationContext';

const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  return (
    <div>
      <span>Notifications ({unreadCount})</span>
      {notifications.map(notification => (
        <div key={notification.id}>
          {notification.title}
          <button onClick={() => markAsRead(notification.id)}>
            Mark as Read
          </button>
        </div>
      ))}
    </div>
  );
};
```

## 📱 Example Components

### 1. CourtsList Component

A complete court listing component with search and filters.

```javascript
import CourtsList from '@/components/CourtsList';

const CourtsPage = () => {
  const handleCourtSelect = (court) => {
    // Navigate to court details
    navigate(`/court/${court.id}`);
  };

  const handleAddCourt = () => {
    // Open add court dialog
  };

  return (
    <CourtsList
      onCourtSelect={handleCourtSelect}
      showAddButton={true}
      onAddCourt={handleAddCourt}
    />
  );
};
```

### 2. BookingsList Component

A complete booking listing component with status filters.

```javascript
import BookingsList from '@/components/BookingsList';

const BookingsPage = () => {
  const handleBookingSelect = (booking) => {
    // Navigate to booking details
    navigate(`/booking/${booking.id}`);
  };

  return (
    <BookingsList
      onBookingSelect={handleBookingSelect}
      showFilters={true}
    />
  );
};
```

## 🔧 Configuration

### API Base URL

The API base URL is configured in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### Authentication

Authentication is handled automatically through the AuthContext. Tokens are stored in localStorage and included in API requests.

### Error Handling

All API services include comprehensive error handling with user-friendly error messages.

### File Uploads

File uploads are handled through the `uploadFile` helper function in the base API service.

## 🚀 Getting Started

1. **Start the backend server** on `http://localhost:5000`
2. **Start the frontend** with `npm run dev`
3. **Use the API services** in your components as shown in the examples above

## 📝 Best Practices

1. **Use the provided hooks** (`useApi`, `usePaginatedApi`, `useFormSubmit`) for consistent data fetching
2. **Handle loading and error states** in your components
3. **Use the contexts** for global state management
4. **Follow the API documentation** for request/response formats
5. **Implement proper error handling** with user feedback
6. **Use TypeScript** for better type safety (optional)

## 🔍 Debugging

- Check the browser console for API errors
- Use the React DevTools to inspect context state
- Verify API endpoints are working with tools like Postman
- Check network requests in browser DevTools

## 📚 Additional Resources

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [React Context Documentation](https://reactjs.org/docs/context.html)
- [Custom Hooks Guide](https://reactjs.org/docs/hooks-custom.html)

---

This integration provides a complete, production-ready API layer for the Padel Booking System frontend. All major functionality is connected to real backend endpoints with proper error handling, loading states, and user feedback.
