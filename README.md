# 🏓 Padel Booking System

A comprehensive web application for managing padel court bookings, tournaments, and user management built with React.js frontend and Node.js backend with MongoDB database.

## ✨ Features

### 🎯 Core Functionality
- **User Management**: Registration, login, role-based access (Player, Owner, Organizer, Admin)
- **Court Management**: Add, edit, delete courts with images and availability
- **Booking System**: Real-time court booking with payment verification
- **Tournament System**: Create and manage tournaments with participant registration
- **Admin Panel**: Comprehensive dashboard for system administration

### 🛠 Technical Features
- **Real-time Data**: Live updates for bookings and availability
- **File Uploads**: Image upload for courts and tournaments
- **Authentication**: JWT-based secure authentication
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **API Integration**: RESTful API with comprehensive error handling

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **Windows 10/11** (for provided setup instructions)
- **Git**

### 1. Clone Repository
```bash
git clone <your-repository-url>
cd Padel
```

### 2. Install MongoDB
```bash
# Using Windows Package Manager (recommended)
winget install MongoDB.Server
winget install MongoDB.Shell

# Create data directory
mkdir C:\data\db -Force

# Add to PATH (current session)
$env:PATH += ";C:\Program Files\MongoDB\Server\8.0\bin"
$env:PATH += ";C:\Users\$env:USERNAME\AppData\Local\Programs\mongosh"
```

### 3. Start MongoDB
```bash
# Start MongoDB server
mongod --dbpath C:\data\db

# Verify connection (in new terminal)
mongosh --eval "db.runCommand({ping: 1})"
```

### 4. Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Create environment file
echo "PORT=5001" > .env
echo "MONGO_URI=mongodb://127.0.0.1:27017/padelbook" >> .env
echo "JWT_SECRET=your_jwt_secret_key_here_change_in_production" >> .env
echo "NODE_ENV=development" >> .env

# Start backend server
npm run dev
```

### 5. Setup Frontend
```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_BASE_URL=http://localhost:5001/api" > .env
echo "VITE_UPLOAD_BASE_URL=http://localhost:5001" >> .env

# Start frontend server
npm run dev
```

### 6. Initialize Database
```bash
# Create database and collections
mongosh --eval "use padelbook; db.createCollection('users'); db.createCollection('courts'); db.createCollection('tournaments'); db.createCollection('bookings');"
```

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Main application interface |
| **Backend API** | http://localhost:5001 | REST API endpoints |
| **API Status** | http://localhost:5001 | API health check |
| **MongoDB** | mongodb://127.0.0.1:27017 | Database connection |

## 📁 Project Structure

```
Padel/
├── backend/                 # Node.js Backend
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & validation
│   │   ├── config/         # Database config
│   │   └── server.js       # Entry point
│   ├── uploads/            # File uploads
│   ├── package.json
│   └── .env               # Environment variables
│
├── frontend/               # React.js Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   └── contexts/      # React contexts
│   ├── public/
│   ├── package.json
│   └── .env              # Environment variables
│
└── README.md             # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Courts
- `GET /api/courts` - Get all courts
- `POST /api/courts` - Create new court (Owner)
- `PUT /api/courts/:id` - Update court (Owner)
- `DELETE /api/courts/:id` - Delete court (Owner)

### Tournaments
- `GET /api/tournaments` - Get all tournaments
- `POST /api/tournaments` - Create tournament (Organizer)
- `POST /api/tournaments/:id/register` - Register for tournament

### Bookings
- `GET /api/bookings/my-bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id/payment-proof` - Upload payment proof

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Manage users
- `PUT /api/admin/courts/:id/toggle-featured` - Toggle featured courts

## 🎭 User Roles

| Role | Permissions |
|------|-------------|
| **Player** | Book courts, register for tournaments, manage profile |
| **Owner** | Manage owned courts, view bookings, upload court images |
| **Organizer** | Create tournaments, manage registrations, view participants |
| **Admin** | Full system access, user management, approve content |

## 🛠 Development

### Backend Commands
```bash
cd backend
npm run dev        # Start development server
npm start         # Start production server
```

### Frontend Commands
```bash
cd frontend
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

### Database Operations
```bash
# Connect to database
mongosh padelbook

# View collections
show collections

# Count users
db.users.countDocuments()

# View all courts
db.courts.find().pretty()
```

## 🔍 Troubleshooting

### Common Issues

**Port 5001 already in use:**
```bash
netstat -ano | findstr :5001
taskkill /PID <process_id> /F
```

**MongoDB connection failed:**
```bash
# Check MongoDB status
mongosh --eval "db.runCommand({ping: 1})"

# Restart MongoDB
mongod --dbpath C:\data\db
```

**Environment variables not loading:**
- Ensure `.env` files exist in both `backend/` and `frontend/` directories
- Restart servers after creating/modifying `.env` files
- Check file encoding (should be UTF-8)

**API 500 errors:**
- Verify MongoDB is running: `mongosh --eval "db.runCommand({ping: 1})"`
- Check backend console for detailed error messages
- Ensure all environment variables are set correctly

## 🧪 Testing the Setup

1. **Backend Health Check**:
   ```bash
   curl http://localhost:5001
   # Should return: {"message":"Padel Court Booking API is running!","status":"OK"}
   ```

2. **Database Connection**:
   ```bash
   mongosh padelbook --eval "db.runCommand({ping: 1})"
   # Should return: { ok: 1 }
   ```

3. **Frontend Access**:
   - Visit http://localhost:5173
   - Register a new account
   - Login and navigate through the application

4. **API Integration**:
   - Check browser console for successful API calls
   - Verify data persistence by refreshing pages

## 🎨 Technology Stack

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the API documentation in `backend/API_DOCUMENTATION.md`

---

**Made with ❤️ for the Padel community**
