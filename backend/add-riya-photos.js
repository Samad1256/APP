const mongoose = require('mongoose');
const User = require('./src/models/User');

async function addMorePhotosToRiya() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilsematchify');
        console.log('🔗 Connected to MongoDB');
        
        const riya = await User.findOne({ email: 'riya.sharma@gmail.com' });
        if (!riya) {
            console.log('❌ Riya user not found');
            return;
        }
        
        // Add additional photos to Riya's profile
        const additionalPhotos = [
            {
                url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
                public_id: 'riya_photo_2'
            },
            {
                url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
                public_id: 'riya_photo_3'
            }
        ];
        
        // Add to existing photos array
        riya.photos.push(...additionalPhotos);
        await riya.save();
        
        console.log('✅ Additional photos added to Riya\'s profile!');
        console.log('📸 Total photos now:', riya.photos.length);
        
        riya.photos.forEach((photo, index) => {
            console.log(`   Photo ${index + 1}:`, photo.url);
        });
        
        console.log('\n👤 Riya\'s complete profile is now ready!');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔚 Disconnected from MongoDB');
    }
}

addMorePhotosToRiya();
