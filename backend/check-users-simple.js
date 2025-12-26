const mongoose = require('mongoose');
const User = require('./src/models/User');

async function checkUsers() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilse-matchify');
        console.log('Connected to MongoDB');

        const allUsers = await User.find({}).select('name email gender location phone');
        console.log('All users in database:');
        allUsers.forEach(user => {
            console.log(`${user.name} - ${user.email} - ${user.gender} - Phone: ${user.phone}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkUsers();
