const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

// Import models
const User = require('./models/User');

const app = express();
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store io instance in app for use in controllers
app.set('io', io);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: false // Disable for development
}));
app.use(cors({
  origin: ['http://localhost:5001', 'http://127.0.0.1:5001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  optionsSuccessStatus: 200
}));
app.use(morgan('combined'));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from project root (HTML files)
app.use(express.static(path.join(__dirname, '../..')));

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/messages', require('./routes/messages'));

// Upload route
const { upload, uploadPhoto } = require('./controllers/uploadController');
app.post('/api/uploads/photo', require('./middleware/auth'), upload, uploadPhoto);

// Serve blhp.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../blhp.html'));
});

// Serve other HTML pages
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../loginpage.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../../signuppage.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../../myprofile.html'));
});

app.get('/messages', (req, res) => {
  res.sendFile(path.join(__dirname, '../../message.html'));
});

app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, '../../blog.html'));
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their personal room
  socket.on('join', async (userId) => {
    try {
      socket.join(`user_${userId}`);
      socket.userId = userId;
      
      // Update user online status
      await User.findByIdAndUpdate(userId, { 
        isActive: true,
        lastActive: new Date() 
      });
      
      console.log(`User ${userId} joined their room`);
      
      // Notify matches that user is online
      const Match = require('./models/Match');
      const matches = await Match.find({
        $or: [
          { from: userId, status: 'matched' },
          { to: userId, status: 'matched' }
        ]
      });
      
      matches.forEach(match => {
        const otherUserId = match.from.toString() === userId ? match.to : match.from;
        socket.to(`user_${otherUserId}`).emit('userOnline', { userId });
      });
      
    } catch (error) {
      console.error('Socket join error:', error);
    }
  });

  // Handle real-time messaging
  socket.on('sendMessage', async (data) => {
    try {
      const { to, text } = data;
      const from = socket.userId;
      
      if (!from || !to || !text) return;
      
      // Check if users are matched
      const Match = require('./models/Match');
      const match = await Match.findOne({
        $or: [
          { from: from, to: to, status: 'matched' },
          { from: to, to: from, status: 'matched' }
        ]
      });
      
      if (!match) {
        socket.emit('error', { message: 'Can only message matched users' });
        return;
      }
      
      // Create conversation ID
      const conversationId = [from, to].sort().join('_');
      
      // Save message to database
      const Message = require('./models/Message');
      const message = new Message({
        conversationId,
        from,
        to,
        text
      });
      
      await message.save();
      await message.populate('from', 'name photos');
      
      // Emit to recipient
      socket.to(`user_${to}`).emit('newMessage', {
        message,
        conversationId
      });
      
      // Confirm to sender
      socket.emit('messageSent', {
        message,
        conversationId
      });
      
    } catch (error) {
      console.error('Socket message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    
    if (socket.userId) {
      try {
        // Update user offline status
        await User.findByIdAndUpdate(socket.userId, { 
          isActive: false,
          lastActive: new Date() 
        });
        
        // Notify matches that user is offline
        const Match = require('./models/Match');
        const matches = await Match.find({
          $or: [
            { from: socket.userId, status: 'matched' },
            { to: socket.userId, status: 'matched' }
          ]
        });
        
        matches.forEach(match => {
          const otherUserId = match.from.toString() === socket.userId ? match.to : match.from;
          socket.to(`user_${otherUserId}`).emit('userOffline', { userId: socket.userId });
        });
        
      } catch (error) {
        console.error('Socket disconnect error:', error);
      }
    }
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Function to start server
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    const PORT = process.env.PORT || 5001;
    
    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📱 API endpoints available at http://localhost:${PORT}/api`);
      console.log(`🌐 Frontend available at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('❌ Unhandled Promise Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Start the server
startServer();
