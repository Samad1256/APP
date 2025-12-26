const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

async function copyWorkingPassword() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilsematchify');
        console.log('🔗 Connected to MongoDB');
        
        // Get Samad's working password hash
        const samad = await User.findOne({ email: 'samad_shaik@srmap.edu.in' });
        const riya = await User.findOne({ email: 'riya.sharma@gmail.com' });
        
        if (!samad || !riya) {
            console.log('❌ Could not find users');
            return;
        }
        
        console.log('📋 Samad\'s password hash:', samad.password);
        
        // Test Samad's password
        const samadTest = await bcrypt.compare('password123', samad.password);
        console.log('✅ Samad password works:', samadTest);
        
        // Copy the exact same password hash to Riya
        console.log('\n🔄 Copying Samad\'s working password hash to Riya...');
        riya.password = samad.password;
        await riya.save();
        
        // Test Riya's password now
        const riyaTest = await bcrypt.compare('password123', riya.password);
        console.log('✅ Riya password now works:', riyaTest);
        
        if (riyaTest) {
            console.log('🎉 SUCCESS! Riya can now login with password123');
        } else {
            console.log('❌ Still not working. Let me try the reset-passwords.js approach...');
            
            // Let's see what reset-passwords.js does
            console.log('\n🔍 Checking what the reset-passwords script does...');
        }
        
        console.log('\n🔑 LOGIN CREDENTIALS (SHOULD NOW WORK):');
        console.log('   Email: riya.sharma@gmail.com');
        console.log('   Password: password123');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔚 Disconnected from MongoDB');
    }
}

copyWorkingPassword();
