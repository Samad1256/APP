const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

async function fixUserPasswords() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilse-matchify');
        console.log('Connected to MongoDB');

        // Define correct passwords for each user
        const userUpdates = [
            { email: 'samadpayenda61@gmail.com', password: 'Samad123', name: 'Samad' },
            { email: 'priya.test@gmail.com', password: 'Priya123', name: 'Priya' },
            { email: 'arjun.test@gmail.com', password: 'Arjun123', name: 'Arjun' },
            { email: 'riya@gmail.com', password: 'Riya123', name: 'Riya' },
            { email: 'faziya@gmail.com', password: 'Faziya123', name: 'Faziya' }
        ];

        for (const userUpdate of userUpdates) {
            // Hash the password properly
            const hashedPassword = await bcrypt.hash(userUpdate.password, 10);
            
            // Update user directly in database (bypass pre-save hooks)
            await User.findOneAndUpdate(
                { email: userUpdate.email },
                { password: hashedPassword },
                { new: true }
            );
            
            console.log(`✅ Updated password for ${userUpdate.name}`);
            
            // Verify the password works
            const user = await User.findOne({ email: userUpdate.email });
            const isMatch = await bcrypt.compare(userUpdate.password, user.password);
            console.log(`   Password verification: ${isMatch ? '✅ WORKS' : '❌ FAILED'}`);
        }

        console.log('\n🎉 All passwords have been fixed!');
        console.log('\n=== Working Login Credentials ===');
        userUpdates.forEach(user => {
            console.log(`${user.name}: ${user.email} / ${user.password}`);
        });

        console.log('\n📋 Quick Copy-Paste for Samad:');
        console.log('Email: samadpayenda61@gmail.com');
        console.log('Password: Samad123');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixUserPasswords();
