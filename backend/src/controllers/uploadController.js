const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const User = require('../models/User');

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload photo
const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    let photoUrl;
    let publicId;

    // Use Cloudinary if configured, otherwise use local storage
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'dilsematchify/photos',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto' }
          ]
        });
        
        photoUrl = result.secure_url;
        publicId = result.public_id;
        
        // Delete local file after upload to Cloudinary
        const fs = require('fs');
        fs.unlinkSync(req.file.path);
      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed:', cloudinaryError);
        // Fallback to local storage
        photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      }
    } else {
      // Use local storage
      photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Add photo to user's photos array
    const user = await User.findById(req.user._id);
    user.photos.push({
      url: photoUrl,
      public_id: publicId
    });
    await user.save();

    res.json({
      success: true,
      message: 'Photo uploaded successfully',
      data: {
        url: photoUrl,
        public_id: publicId
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
};

module.exports = {
  upload: upload.single('photo'),
  uploadPhoto
};
