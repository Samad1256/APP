const mongoose = require('mongoose');

async function dropPhoneIndex() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilse-matchify');
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('users');
        
        try {
            await collection.dropIndex('phone_1');
            console.log('Dropped phone index');
        } catch (error) {
            if (error.code === 27) {
                console.log('Phone index not found - that\'s okay');
            } else {
                throw error;
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

dropPhoneIndex();
