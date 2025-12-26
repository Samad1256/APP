const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

async function diagnoseLoginIssues() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilsematchify');
        console.log('🔗 Connected to MongoDB');
        
        // Check if faziya33@gmail.com exists
        console.log('\n🔍 Checking faziya33@gmail.com account...');
        const faziya = await User.findOne({ email: 'faziya33@gmail.com' });
        
        if (faziya) {
            console.log('✅ Faziya account found:');
            console.log('   Name:', faziya.name);
            console.log('   Email:', faziya.email);
            console.log('   Password hash length:', faziya.password.length);
            console.log('   Password hash starts with:', faziya.password.substring(0, 10));
            console.log('   Date created:', faziya.createdAt || 'Not set');
            
            // Test password comparison
            console.log('\n🧪 Testing faziya password...');
            const faziyaPasswordTest = await bcrypt.compare('password123', faziya.password);
            console.log('   Password "password123" works:', faziyaPasswordTest);
            
            if (!faziyaPasswordTest) {
                console.log('❌ Password doesn\'t work. Let\'s fix it...');
                
                // Reset password using the working method
                const salt = await bcrypt.genSalt(10);
                const newHash = await bcrypt.hash('password123', salt);
                faziya.password = newHash;
                await faziya.save();
                
                const retestPassword = await bcrypt.compare('password123', faziya.password);
                console.log('   After reset, password works:', retestPassword);
            }
        } else {
            console.log('❌ Faziya account not found');
        }
        
        // Check Riya account
        console.log('\n🔍 Checking Riya account...');
        const riya = await User.findOne({ email: 'riya.sharma@gmail.com' });
        
        if (riya) {
            console.log('✅ Riya account found');
            const riyaPasswordTest = await bcrypt.compare('password123', riya.password);
            console.log('   Riya password works:', riyaPasswordTest);
            
            if (!riyaPasswordTest) {
                console.log('❌ Riya password doesn\'t work. Fixing...');
                const salt = await bcrypt.genSalt(10);
                const newHash = await bcrypt.hash('password123', salt);
                riya.password = newHash;
                await riya.save();
                
                const retestRiya = await bcrypt.compare('password123', riya.password);
                console.log('   After reset, Riya password works:', retestRiya);
            }
        }
        
        // Check Samad account (known working)
        console.log('\n🔍 Checking Samad account (reference)...');
        const samad = await User.findOne({ email: 'samad_shaik@srmap.edu.in' });
        
        if (samad) {
            const samadPasswordTest = await bcrypt.compare('password123', samad.password);
            console.log('✅ Samad password works:', samadPasswordTest);
            console.log('   Samad hash format:', samad.password.substring(0, 15) + '...');
        }
        
        // Test the signup process to see if there's an issue there
        console.log('\n🧪 Testing password hashing consistency...');
        const testPassword = 'password123';
        
        // Method 1: Same as auth controller
        const salt1 = await bcrypt.genSalt(10);
        const hash1 = await bcrypt.hash(testPassword, salt1);
        const test1 = await bcrypt.compare(testPassword, hash1);
        console.log('Method 1 (genSalt + hash):', test1);
        
        // Method 2: Direct hash
        const hash2 = await bcrypt.hash(testPassword, 10);
        const test2 = await bcrypt.compare(testPassword, hash2);
        console.log('Method 2 (direct hash):', test2);
        
        console.log('\n📊 Summary:');
        console.log('- Faziya account:', faziya ? 'EXISTS' : 'NOT FOUND');
        console.log('- Riya account:', riya ? 'EXISTS' : 'NOT FOUND');
        console.log('- Samad account:', samad ? 'EXISTS' : 'NOT FOUND');
        
        console.log('\n🔑 ALL ACCOUNTS SHOULD NOW WORK WITH:');
        console.log('   Password: password123');
        console.log('   Emails: faziya33@gmail.com, riya.sharma@gmail.com, samad_shaik@srmap.edu.in');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔚 Disconnected from MongoDB');
    }
}

diagnoseLoginIssues();
