# DilseMatchify Backend

Production-ready backend for the DilseMatchify dating app built with Node.js, Express, and MongoDB.

## Features

- 🔐 JWT Authentication (register/login)
- 👤 User profiles with photo uploads
- 💕 Matching system (like/pass/match)
- 💬 Real-time messaging with Socket.IO
- 🔍 User search with filters
- 📁 Image uploads (Cloudinary + local fallback)
- 🛡️ Security (helmet, rate limiting, CORS)
- 📊 MongoDB with Mongoose ODM

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
copy .env.example .env

# Edit .env file with your settings:
# - Set MONGODB_URI (Atlas recommended)
# - Set JWT_SECRET (secure random string)
# - Optional: Set Cloudinary credentials for image uploads
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Verify Setup
- **Frontend**: http://localhost:5001 (should show homepage.html)
- **API Health**: http://localhost:5001/api/health
- **API Base**: http://localhost:5001/api

## API Endpoints

### Authentication
```bash
# Register
POST /api/auth/register
Content-Type: application/json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "gender": "male",
  "dateOfBirth": "1990-01-01"
}

# Login
POST /api/auth/login
Content-Type: application/json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Users (Protected - requires JWT token)
```bash
# Search users
GET /api/users/search?gender=female&minAge=25&maxAge=35&city=Mumbai
Authorization: Bearer <your_jwt_token>

# Get user profile
GET /api/users/:userId

# Update profile
PUT /api/users/:userId
Authorization: Bearer <your_jwt_token>
{
  "bio": "Updated bio",
  "interests": ["travel", "music"]
}
```

### Matching (Protected)
```bash
# Like a user
POST /api/matches/like
Authorization: Bearer <your_jwt_token>
{
  "toUserId": "user_id_here"
}

# Pass a user
POST /api/matches/pass
Authorization: Bearer <your_jwt_token>
{
  "toUserId": "user_id_here"
}

# Get matches
GET /api/matches
Authorization: Bearer <your_jwt_token>
```

### Messaging (Protected)
```bash
# Send message
POST /api/messages
Authorization: Bearer <your_jwt_token>
{
  "to": "user_id_here",
  "text": "Hello!"
}

# Get conversation messages
GET /api/messages/:conversationId
Authorization: Bearer <your_jwt_token>

# Get all conversations
GET /api/messages/conversations
Authorization: Bearer <your_jwt_token>
```

### File Uploads (Protected)
```bash
# Upload photo
POST /api/uploads/photo
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
photo: <image_file>
```

## Testing with cURL

### Register a new user:
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123","gender":"male"}'
```

### Login:
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Use the returned token for protected routes:
```bash
curl -X GET http://localhost:5001/api/matches \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Database Setup

### Option 1: MongoDB Atlas (Recommended)
1. Create account at https://cloud.mongodb.com
2. Create a new cluster (free tier available)
3. Get connection string and update MONGODB_URI in .env
4. Format: `mongodb+srv://username:password@cluster.mongodb.net/dilsematchify`

### Option 2: Local MongoDB
1. Install MongoDB locally
2. Start mongod service
3. Use: `MONGODB_URI=mongodb://localhost:27017/dilsematchify`

## Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/           # Route handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── matchController.js
│   │   ├── messageController.js
│   │   └── uploadController.js
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   ├── models/                # Database schemas
│   │   ├── User.js
│   │   ├── Match.js
│   │   └── Message.js
│   ├── routes/                # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── matches.js
│   │   ├── messages.js
│   │   └── uploads.js
│   └── index.js               # Main server file
├── uploads/                   # Local file storage
├── .env.example               # Environment template
├── .gitignore
├── package.json
└── README.md
```

## Troubleshooting

### Port already in use:
```bash
# Kill process on port 5001
netstat -ano | findstr :5001
taskkill /F /PID <process_id>
```

### MongoDB connection issues:
- Check MONGODB_URI format
- Verify network access (Atlas: whitelist IP)
- Check MongoDB service is running (local)

### File upload issues:
- Check uploads/ folder permissions
- Verify Cloudinary credentials if using cloud storage
- Ensure file size limits (5MB max)

## Production Deployment

1. Set NODE_ENV=production
2. Use strong JWT_SECRET (32+ characters)
3. Configure proper CORS origins
4. Set up MongoDB Atlas with proper security
5. Configure Cloudinary for image hosting
6. Add proper logging and monitoring

## Socket.IO Events

### Client-side usage:
```javascript
const socket = io('http://localhost:5001');

// Join user room
socket.emit('join', userId);

// Listen for new messages
socket.on('newMessage', (data) => {
  console.log('New message:', data);
});

// Send message
socket.emit('sendMessage', {
  to: recipientId,
  message: messageData
});
```
