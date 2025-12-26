const mongoose = require('mongoose');
const User = require('./src/models/User');

async function checkUserData() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilsematchify');
        console.log('🔍 Checking user data...');
        
        const user = await User.findOne({email: 'samad_shaik@srmap.edu.in'});
        
        if (user) {
            console.log('👤 User details:');
            console.log('  Name:', user.name);
            console.log('  Email:', user.email);
            console.log('  Gender:', user.gender);
            console.log('  Date of Birth:', user.dateOfBirth);
            console.log('  Bio:', user.bio || 'Not set');
            console.log('  Location:', user.location || 'Not set');
            console.log('  Interests:', user.interests || []);
            console.log('  Occupation:', user.occupation || 'Not set');
            console.log('  IsActive:', user.isActive);
            
            // Test API endpoint
            console.log('\n🧪 Testing API response...');
            const jwt = require('jsonwebtoken');
            const token = jwt.sign({ userId: user._id }, 'fallback_secret_key');
            console.log('Generated test token for API...');
            
        } else {
            console.log('❌ User not found!');
        }
        
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkUserData();
