const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

async function resetAllPasswords() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilsematchify');
        console.log('📊 Connected to database');
        
        // Get all users
        const users = await User.find({}, 'name email');
        console.log('👥 Found users:');
        users.forEach(u => console.log('  📧', u.email, '-', u.name));
        
        // Set password to 'password123' for all users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        
        console.log('\n🔧 Setting password "password123" for all users...');
        
        const result = await User.updateMany({}, { password: hashedPassword });
        console.log(`✅ Updated ${result.modifiedCount} users`);
        
        // Test login for each user
        console.log('\n🧪 Testing login for each user:');
        for (const user of users) {
            const testUser = await User.findOne({ email: user.email });
            const match = await bcrypt.compare('password123', testUser.password);
            console.log(`  ${match ? '✅' : '❌'} ${user.email} - password123`);
        }
        
        console.log('\n🎉 All users now have password: password123');
        console.log('🔑 You can login with any of these emails and password123');
        
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

resetAllPasswords();
