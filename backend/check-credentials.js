const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

async function checkCredentials() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilse-matchify');
        console.log('Connected to MongoDB');

        // Check all users and their emails
        const allUsers = await User.find({}).select('name email password');
        console.log('All users in database:');
        
        for (const user of allUsers) {
            console.log(`\nUser: ${user.name}`);
            console.log(`Email: ${user.email}`);
            console.log(`Password Hash: ${user.password}`);
            
            // Test password verification
            const testPasswords = ['Samad123', 'Priya123', 'Arjun123', 'Riya123', 'Faziya123'];
            
            for (const testPass of testPasswords) {
                try {
                    const isMatch = await bcrypt.compare(testPass, user.password);
                    if (isMatch) {
                        console.log(`✅ Password '${testPass}' matches for ${user.name}`);
                    }
                } catch (error) {
                    console.log(`❌ Error checking password '${testPass}' for ${user.name}`);
                }
            }
        }

        console.log('\n=== Correct Login Credentials ===');
        console.log('Try these exact credentials:');
        
        for (const user of allUsers) {
            console.log(`${user.name}: ${user.email}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkCredentials();
