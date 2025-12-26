const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

async function createCleanTestUsers() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilse-matchify');
        console.log('Connected to MongoDB');

        // Remove all existing test users
        await User.deleteMany({ 
            email: { 
                $in: ['priya.test@gmail.com', 'arjun.test@gmail.com'] 
            } 
        });
        console.log('Cleaned up existing test users');

        // Create Samad first if he doesn't exist
        let samad = await User.findOne({ email: 'samadpayenda61@gmail.com' });
        if (!samad) {
            const samadData = {
                name: 'Samad Payenda',
                email: 'samadpayenda61@gmail.com',
                password: await bcrypt.hash('Samad123', 10),
                dateOfBirth: new Date('1995-01-15'),
                gender: 'male',
                location: {
                    city: 'Kabul',
                    state: 'Kabul Province',
                    country: 'Afghanistan'
                },
                interests: ['Technology', 'Travel', 'Music', 'Reading', 'Photography'],
                bio: 'Software developer passionate about technology and travel.',
                preferences: {
                    ageRange: { min: 22, max: 32 },
                    gender: 'female',
                    maxDistance: 50
                }
            };
            samad = await User.create(samadData);
            console.log('Created Samad');
        }

        // Create female test user with same location and shared interests
        const priyaData = {
            name: 'Priya Sharma',
            email: 'priya.test@gmail.com',
            password: await bcrypt.hash('Priya123', 10),
            dateOfBirth: new Date('1996-05-15'),
            gender: 'female',
            location: {
                city: 'Kabul',  // Same city as Samad
                state: 'Kabul Province',
                country: 'Afghanistan'
            },
            interests: ['Technology', 'Travel', 'Photography', 'Reading', 'Music'], // Shared interests
            bio: 'Software engineer who loves technology and travel. Looking for meaningful connections.',
            preferences: {
                ageRange: { min: 25, max: 35 },
                gender: 'male',
                maxDistance: 50
            },
            photos: [{
                url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
                public_id: 'priya_test_photo'
            }]
        };

        await User.create(priyaData);
        console.log('Created Priya');

        // Create male test user for female accounts to see
        const arjunData = {
            name: 'Arjun Mehta',
            email: 'arjun.test@gmail.com',
            password: await bcrypt.hash('Arjun123', 10),
            dateOfBirth: new Date('1994-08-20'),
            gender: 'male',
            location: {
                city: 'Kabul',  // Same city
                state: 'Kabul Province',
                country: 'Afghanistan'
            },
            interests: ['Technology', 'Sports', 'Music', 'Cooking', 'Travel'],
            bio: 'Tech enthusiast and sports lover. Always up for new adventures.',
            preferences: {
                ageRange: { min: 22, max: 30 },
                gender: 'female',
                maxDistance: 50
            },
            photos: [{
                url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
                public_id: 'arjun_test_photo'
            }]
        };

        await User.create(arjunData);
        console.log('Created Arjun');

        // Display all users
        const allUsers = await User.find({}).select('name email gender location.city interests');
        console.log('\n=== All Users ===');
        allUsers.forEach(user => {
            console.log(`${user.name} (${user.gender}) - ${user.email} - ${user.location?.city} - Interests: ${user.interests?.join(', ')}`);
        });

        console.log('\n=== Login Credentials ===');
        console.log('Samad (Male): samadpayenda61@gmail.com / Samad123');
        console.log('Priya (Female): priya.test@gmail.com / Priya123');
        console.log('Arjun (Male): arjun.test@gmail.com / Arjun123');
        console.log('Riya (Female): riya@gmail.com / Riya123');
        console.log('Faziya (Female): faziya@gmail.com / Faziya123');

        console.log('\n=== Matching Test ===');
        console.log('• Samad should see: Priya, Riya, Faziya (females)');
        console.log('• Priya should see: Samad, Arjun (males)');
        console.log('• Arjun should see: Priya, Riya, Faziya (females)');
        console.log('• Riya should see: Samad, Arjun (males)');
        console.log('• Faziya should see: Samad, Arjun (males)');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createCleanTestUsers();
