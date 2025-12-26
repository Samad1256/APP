const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

async function addRemainingUsers() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilse-matchify');
        console.log('Connected to MongoDB');

        // Create Riya
        const riyaData = {
            name: 'Riya Singh',
            email: 'riya@gmail.com',
            password: await bcrypt.hash('Riya123', 10),
            dateOfBirth: new Date('1997-03-20'),
            gender: 'female',
            location: {
                city: 'Kabul',
                state: 'Kabul Province',
                country: 'Afghanistan'
            },
            interests: ['Music', 'Dancing', 'Art', 'Travel', 'Food'],
            bio: 'Creative soul who loves music and art. Always looking for new experiences.',
            preferences: {
                ageRange: { min: 24, max: 34 },
                gender: 'male',
                maxDistance: 50
            },
            photos: [{
                url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
                public_id: 'riya_photo'
            }]
        };

        await User.create(riyaData);
        console.log('Created Riya');

        // Create Faziya
        const faziyaData = {
            name: 'Faziya Ahmed',
            email: 'faziya@gmail.com',
            password: await bcrypt.hash('Faziya123', 10),
            dateOfBirth: new Date('1995-11-10'),
            gender: 'female',
            location: {
                city: 'Kabul',
                state: 'Kabul Province',
                country: 'Afghanistan'
            },
            interests: ['Books', 'Photography', 'Yoga', 'Technology', 'Meditation'],
            bio: 'Book lover and yoga enthusiast. Passionate about personal growth and meaningful connections.',
            preferences: {
                ageRange: { min: 26, max: 36 },
                gender: 'male',
                maxDistance: 50
            },
            photos: [{
                url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
                public_id: 'faziya_photo'
            }]
        };

        await User.create(faziyaData);
        console.log('Created Faziya');

        // Display all users
        const allUsers = await User.find({}).select('name email gender location.city interests');
        console.log('\n=== All Users ===');
        allUsers.forEach(user => {
            console.log(`${user.name} (${user.gender}) - ${user.email} - ${user.location?.city} - Interests: ${user.interests?.join(', ')}`);
        });

        console.log('\n=== Complete Login Credentials ===');
        console.log('Samad (Male): samadpayenda61@gmail.com / Samad123');
        console.log('Priya (Female): priya.test@gmail.com / Priya123');
        console.log('Arjun (Male): arjun.test@gmail.com / Arjun123');
        console.log('Riya (Female): riya@gmail.com / Riya123');
        console.log('Faziya (Female): faziya@gmail.com / Faziya123');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

addRemainingUsers();
