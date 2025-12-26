# DilSe Matchify - Dating App with Advanced Matchmaking

A complete full-stack dating application built with Node.js, Express, MongoDB, and modern frontend technologies. Features intelligent matchmaking algorithm, real-time messaging, and user profile management.

## 🎯 Project Overview

DilSe Matchify is an Indian-focused dating platform that connects users based on compatibility, interests, and location-based preferences.

### Tech Stack
- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Real-time**: Socket.io for instant messaging
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MongoDB Local
- **File Storage**: Local uploads (user photos)

## 📁 Project Structure

```
DilseMatchify/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js     # Auth logic
│   │   │   ├── matchController.js    # Matching algorithm
│   │   │   ├── messageController.js  # Messaging
│   │   │   ├── uploadController.js   # Photo uploads
│   │   │   └── userController.js     # User management
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT authentication
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   ├── Match.js             # Match schema
│   │   │   └── Message.js           # Message schema
│   │   ├── routes/
│   │   │   ├── auth.js              # Auth endpoints
│   │   │   ├── matches.js           # Matching endpoints
│   │   │   ├── messages.js          # Messaging endpoints
│   │   │   ├── uploads.js           # Upload endpoints
│   │   │   └── users.js             # User endpoints
│   │   ├── socket.js                # Real-time messaging
│   │   └── index.js                 # Main server file
│   ├── scripts/
│   │   ├── updateLocations.js       # Update user locations
│   │   └── listUsers.js             # List database users
│   ├── uploads/                     # User photo storage
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Example env file
│   ├── package.json                 # Dependencies
│   └── README.md                    # Backend documentation
│
├── frontend/
│   ├── loginpage.html              # User login
│   ├── signuppage.html             # User registration
│   ├── homepage.html               # Main dashboard
│   ├── matchamate.html             # Matching interface
│   ├── myprofile.html              # User profile
│   ├── message.html                # Messaging interface
│   ├── blog.html                   # Blog/content
│   ├── work.html                   # Work/career section
│   ├── B1-featured.html            # Featured profiles
│   ├── B2-DatingTips.html          # Dating tips
│   ├── B3-Relationships.html       # Relationships guide
│   ├── B4-IndianCulture.html       # Cultural content
│   ├── B5-marriage.html            # Marriage guide
│   ├── B6-Selflove.html            # Self-love content
│   └── admin.html                  # Admin panel
│
├── .gitignore                      # Git ignore rules
├── .env                            # Root environment file
└── README.md                       # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Samad1256/APP.git
cd DilseMatchify
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Configure environment variables**
```bash
# Create .env file in backend folder
cp .env.example .env

# Edit .env with your configuration:
MONGODB_URI=mongodb://localhost:27017/dilse-matchify
PORT=5001
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
```

4. **Start MongoDB**
```bash
# Windows
net start MongoDB

# Mac/Linux
brew services start mongodb-community
```

5. **Start the backend server**
```bash
npm start
# or with nodemon for development
npm run dev
```

6. **Open frontend in browser**
```
http://localhost:5001
```

## 🔑 Key Features

### User Authentication
- Secure signup and login
- JWT-based session management
- Password hashing with bcrypt

### Smart Matchmaking
- Location-based matching
- Interest compatibility scoring
- Age and preference filtering
- Real-time suggestion updates

### Profile Management
- Multi-photo uploads
- Bio and interest customization
- Activity status tracking
- Profile completion scoring

### Real-time Messaging
- Socket.io powered chat
- Message history
- Online status indicators
- Typing indicators

### Blog & Content
- Dating tips and advice
- Relationship guides
- Cultural content
- Self-love articles

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Matching
- `GET /api/matches/suggestions` - Get match suggestions
- `POST /api/matches/like` - Like a profile
- `POST /api/matches/pass` - Skip a profile
- `GET /api/matches/conversations` - Get conversations

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Messages
- `GET /api/messages/:conversationId` - Get messages
- `POST /api/messages` - Send message

### Uploads
- `POST /api/uploads/photo` - Upload user photo

## 🗄️ Database Schema

### User Model
- Email, Password (hashed)
- Profile: Name, Age, Bio
- Photos (multiple)
- Location: City, State
- Interests Array
- Created/Updated timestamps

### Match Model
- From User ID
- To User ID
- Match Type (like, pass, superlike)
- Timestamp

### Message Model
- From User ID
- To User ID
- Content
- Timestamp
- Read status

## 🔒 Security Features
- JWT authentication
- Password encryption (bcrypt)
- CORS enabled
- Input validation
- SQL injection prevention

## 📱 Frontend Features
- Responsive design
- Modern UI with animations
- Swipe-based interactions
- Real-time updates
- Profile customization

## 🛠️ Development Tools

### Available Scripts
```bash
npm start           # Start production server
npm run dev        # Start with nodemon
npm test           # Run tests
npm run seed       # Seed database with test data
```

### Database Scripts
```bash
node backend/scripts/updateLocations.js    # Update user locations
node backend/scripts/listUsers.js          # List all users
```

## 📝 Environment Variables

```
MONGODB_URI=mongodb://localhost:27017/dilse-matchify
PORT=5001
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
CLOUDINARY_NAME=your_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Samad1256**
- GitHub: [@Samad1256](https://github.com/Samad1256)
- Repository: [APP](https://github.com/Samad1256/APP)

## 🐛 Issues & Support

Found a bug? Please create an issue on GitHub or contact the developer.

## 🎯 Future Enhancements

- [ ] Video call integration
- [ ] Advanced AI-based matching
- [ ] Mobile app (React Native)
- [ ] Payment integration
- [ ] Advanced analytics
- [ ] Machine learning recommendations
- [ ] AWS deployment
- [ ] Docker containerization

---

**Last Updated**: December 2025
**Version**: 1.0.0
