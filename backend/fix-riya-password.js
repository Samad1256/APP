const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

async function fixRiyaPasswordProperly() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilsematchify');
        console.log('🔗 Connected to MongoDB');
        
        // Check Samad's password to see what method works
        const samad = await User.findOne({ email: 'samad_shaik@srmap.edu.in' });
        if (samad) {
            console.log('🔍 Testing Samad\'s password (known working):');
            const samadTest = await bcrypt.compare('password123', samad.password);
            console.log('Samad password test:', samadTest);
            console.log('Samad password hash length:', samad.password.length);
            console.log('Samad password hash format:', samad.password.substring(0, 10) + '...');
        }
        
        const riya = await User.findOne({ email: 'riya.sharma@gmail.com' });
        if (!riya) {
            console.log('❌ Riya user not found');
            return;
        }
        
        console.log('\n👤 Current Riya password details:');
        console.log('Password hash length:', riya.password.length);
        console.log('Password hash format:', riya.password.substring(0, 10) + '...');
        
        // Use the exact same method that worked for Samad
        console.log('\n🔄 Resetting Riya\'s password using same method as Samad...');
        
        // Method 1: Simple bcrypt hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        
        console.log('New hash length:', hashedPassword.length);
        console.log('New hash format:', hashedPassword.substring(0, 10) + '...');
        
        riya.password = hashedPassword;
        await riya.save();
        
        // Test the new password
        const testPassword = await bcrypt.compare('password123', riya.password);
        console.log('✅ New password test result:', testPassword);
        
        if (testPassword) {
            console.log('🎉 Riya\'s password is now fixed!');
        } else {
            console.log('❌ Password still not working. Trying different approach...');
            
            // Try method 2: Direct hash without salt
            const directHash = await bcrypt.hash('password123', 10);
            riya.password = directHash;
            await riya.save();
            
            const testPassword2 = await bcrypt.compare('password123', riya.password);
            console.log('Method 2 test result:', testPassword2);
        }
        
        console.log('\n🔑 UPDATED LOGIN CREDENTIALS:');
        console.log('   Email: riya.sharma@gmail.com');
        console.log('   Password: password123');
        console.log('   Status:', testPassword ? 'WORKING ✅' : 'NEEDS MORE FIXING ❌');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔚 Disconnected from MongoDB');
    }
}

fixRiyaPasswordProperly();
