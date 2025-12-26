const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

async function fixPasswordsDirectly() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilsematchify');
        console.log('🔗 Connected to MongoDB');
        
        // Get Samad's working hash as reference
        const samad = await User.findOne({ email: 'samad_shaik@srmap.edu.in' });
        console.log('📋 Using Samad\'s working hash as reference');
        console.log('Samad hash:', samad.password);
        
        // Test that Samad's hash works
        const samadTest = await bcrypt.compare('password123', samad.password);
        console.log('✅ Samad password verification:', samadTest);
        
        // Update Riya and Faziya directly using updateOne (bypasses pre-save hooks)
        console.log('\n🔧 Fixing passwords using direct database update...');
        
        // Fix Riya
        const riyaResult = await User.updateOne(
            { email: 'riya.sharma@gmail.com' },
            { $set: { password: samad.password } }
        );
        console.log('Riya update result:', riyaResult.modifiedCount > 0 ? 'SUCCESS' : 'FAILED');
        
        // Fix Faziya
        const faziyaResult = await User.updateOne(
            { email: 'faziya33@gmail.com' },
            { $set: { password: samad.password } }
        );
        console.log('Faziya update result:', faziyaResult.modifiedCount > 0 ? 'SUCCESS' : 'FAILED');
        
        // Test the fixed passwords
        console.log('\n🧪 Testing fixed passwords...');
        
        const riya = await User.findOne({ email: 'riya.sharma@gmail.com' });
        const faziya = await User.findOne({ email: 'faziya33@gmail.com' });
        
        const riyaTest = await bcrypt.compare('password123', riya.password);
        const faziyaTest = await bcrypt.compare('password123', faziya.password);
        
        console.log('Riya password now works:', riyaTest ? '✅ YES' : '❌ NO');
        console.log('Faziya password now works:', faziyaTest ? '✅ YES' : '❌ NO');
        
        if (riyaTest && faziyaTest) {
            console.log('\n🎉 SUCCESS! All passwords are now fixed!');
            console.log('\n🔑 WORKING LOGIN CREDENTIALS:');
            console.log('1. Email: riya.sharma@gmail.com | Password: password123');
            console.log('2. Email: faziya33@gmail.com | Password: password123');
            console.log('3. Email: samad_shaik@srmap.edu.in | Password: password123');
        } else {
            console.log('\n❌ Some passwords still not working. The issue might be elsewhere.');
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔚 Disconnected from MongoDB');
    }
}

fixPasswordsDirectly();
