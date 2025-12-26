const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

async function debugLogin() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilse-matchify');
        console.log('Connected to MongoDB');

        const email = 'samadpayenda61@gmail.com';
        const password = 'Samad123';
        
        console.log(`\n🔍 Debugging login for: ${email}`);
        
        // Step 1: Find user
        const user = await User.findOne({ email });
        console.log('Step 1 - User found:', user ? '✅ YES' : '❌ NO');
        
        if (!user) {
            console.log('❌ User not found in database!');
            
            // Check if email exists with different casing or spaces
            const allUsers = await User.find({}).select('email name');
            console.log('\nAll emails in database:');
            allUsers.forEach(u => console.log(`- "${u.email}" (${u.name})`));
            return;
        }
        
        console.log(`User found: ${user.name}`);
        console.log(`Stored password hash: ${user.password}`);
        
        // Step 2: Test password
        console.log(`\nStep 2 - Testing password: "${password}"`);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch ? '✅ YES' : '❌ NO');
        
        if (!isMatch) {
            // Test with other potential passwords
            const testPasswords = ['samad123', 'SAMAD123', 'Samad1234', 'samad', '123'];
            console.log('\nTesting other potential passwords:');
            for (const testPass of testPasswords) {
                const testMatch = await bcrypt.compare(testPass, user.password);
                if (testMatch) {
                    console.log(`✅ Password "${testPass}" WORKS!`);
                } else {
                    console.log(`❌ Password "${testPass}" failed`);
                }
            }
        }
        
        // Step 3: Test creating a fresh hash
        console.log('\nStep 3 - Creating fresh hash test:');
        const freshHash = await bcrypt.hash(password, 10);
        console.log(`Fresh hash: ${freshHash}`);
        const freshTest = await bcrypt.compare(password, freshHash);
        console.log('Fresh hash test:', freshTest ? '✅ WORKS' : '❌ FAILED');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

debugLogin();
