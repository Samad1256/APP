const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

async function fixRiyaLogin() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilsematchify');
        console.log('🔗 Connected to MongoDB');
        
        const riya = await User.findOne({ email: 'riya.sharma@gmail.com' });
        if (!riya) {
            console.log('❌ Riya user not found');
            return;
        }
        
        console.log('👤 Found Riya:', riya.name);
        console.log('📧 Email:', riya.email);
        
        // Test current password
        console.log('\n🔍 Testing current password...');
        const currentPasswordTest = await bcrypt.compare('password123', riya.password);
        console.log('Current password works:', currentPasswordTest);
        
        if (!currentPasswordTest) {
            console.log('❌ Current password is incorrect. Resetting...');
            
            // Reset password with proper hashing
            const newHashedPassword = await bcrypt.hash('password123', 12);
            riya.password = newHashedPassword;
            await riya.save();
            
            console.log('✅ Password reset successfully');
            
            // Test new password
            const newPasswordTest = await bcrypt.compare('password123', riya.password);
            console.log('New password works:', newPasswordTest);
        }
        
        // Test login API call
        console.log('\n🧪 Testing login API...');
        const fetch = require('node-fetch');
        
        try {
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'riya.sharma@gmail.com',
                    password: 'password123'
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                console.log('✅ API Login successful!');
                console.log('Token received:', result.token ? 'Yes' : 'No');
                console.log('User data:', result.user ? result.user.name : 'None');
            } else {
                console.log('❌ API Login failed:', result.message);
                console.log('Full response:', result);
            }
        } catch (apiError) {
            console.log('❌ API call failed:', apiError.message);
        }
        
        console.log('\n🔑 FINAL LOGIN CREDENTIALS:');
        console.log('   Email: riya.sharma@gmail.com');
        console.log('   Password: password123');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔚 Disconnected from MongoDB');
    }
}

fixRiyaLogin();
