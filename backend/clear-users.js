const mongoose = require('mongoose');
const User = require('./src/models/User');

async function clearAllUsers() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilse-matchify');
        console.log('Connected to MongoDB');

        const result = await User.deleteMany({});
        console.log(`Deleted ${result.deletedCount} users`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

clearAllUsers();
