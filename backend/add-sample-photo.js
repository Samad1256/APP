const mongoose = require('mongoose');
const User = require('./src/models/User');

async function addSamplePhoto() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilsematchify');
        console.log('🔗 Connected to MongoDB');
        
        const user = await User.findOne({ email: 'samad_shaik@srmap.edu.in' });
        if (!user) {
            console.log('❌ User not found');
            return;
        }
        
        // Add a sample profile photo
        const samplePhoto = {
            url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            public_id: 'sample_profile_photo'
        };
        
        user.photos = [samplePhoto];
        await user.save();
        
        console.log('✅ Sample profile photo added successfully!');
        console.log('📸 Photo URL:', samplePhoto.url);
        console.log('👤 User:', user.name);
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔚 Disconnected from MongoDB');
    }
}

addSamplePhoto();
