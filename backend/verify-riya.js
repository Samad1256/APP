const mongoose = require('mongoose');
const User = require('./src/models/User');

async function verifyRiyaAccount() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilsematchify');
        console.log('🔗 Connected to MongoDB');
        
        const riya = await User.findOne({ email: 'riya.sharma@gmail.com' });
        
        if (!riya) {
            console.log('❌ Riya user not found');
            return;
        }
        
        console.log('✅ Riya user found successfully!');
        console.log('📊 Profile Details:');
        console.log('   Name:', riya.name);
        console.log('   Email:', riya.email);
        console.log('   Age:', new Date().getFullYear() - new Date(riya.dateOfBirth).getFullYear());
        console.log('   Gender:', riya.gender);
        console.log('   Location:', `${riya.location.city}, ${riya.location.country}`);
        console.log('   Bio:', riya.bio);
        console.log('   Interests:', riya.interests.join(', '));
        console.log('   Photos:', riya.photos.length, 'photo(s)');
        if (riya.photos.length > 0) {
            console.log('   Profile Photo URL:', riya.photos[0].url);
        }
        console.log('   Preferences:');
        console.log('     - Age Range:', `${riya.preferences.ageRange.min}-${riya.preferences.ageRange.max}`);
        console.log('     - Looking for:', riya.preferences.gender);
        console.log('     - Max Distance:', riya.preferences.maxDistance + ' km');
        console.log('   Account Status:', riya.isActive ? 'Active' : 'Inactive');
        
        console.log('');
        console.log('🔑 LOGIN CREDENTIALS FOR TESTING:');
        console.log('   Email: riya.sharma@gmail.com');
        console.log('   Password: password123');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔚 Disconnected from MongoDB');
    }
}

verifyRiyaAccount();
