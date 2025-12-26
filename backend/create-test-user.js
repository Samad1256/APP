const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

async function createTestUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/dilse-matchify');
        console.log('Connected to MongoDB');

        // First, let's check Samad's details to match them
        const samad = await User.findOne({ email: 'samadpayenda61@gmail.com' });
        console.log('Samad details:', JSON.stringify(samad, null, 2));

        // Create a female test user with similar interests and location as Samad
        const testUserData = {
            name: 'Priya Sharma',
            email: 'priya.test@gmail.com',
            password: 'Priya123',
            phone: '+91-9876543210',
            dateOfBirth: new Date('1996-05-15'), // 29 years old
            gender: 'female',
            location: {
                city: samad?.location?.city || 'Kabul',
                state: samad?.location?.state || 'Kabul Province',
                country: samad?.location?.country || 'Afghanistan'
            },
            interests: samad?.interests || ['Technology', 'Travel', 'Music', 'Reading', 'Photography'],
            bio: 'Software engineer who loves technology and travel. Looking for meaningful connections.',
            preferences: {
                ageRange: {
                    min: 25,
                    max: 35
                },
                gender: 'male',
                maxDistance: 50
            },
            photos: [
                {
                    url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
                    public_id: 'priya_test_photo'
                }
            ]
        };

        // Check if user already exists
        const existingUser = await User.findOne({ email: testUserData.email });
        if (existingUser) {
            console.log('Test user already exists');
            await User.findByIdAndUpdate(existingUser._id, testUserData);
            console.log('Updated existing test user');
        } else {
            // Hash password manually to avoid pre-save hook issues
            const hashedPassword = await bcrypt.hash(testUserData.password, 10);
            testUserData.password = hashedPassword;
            
            const newUser = new User(testUserData);
            // Skip validation to avoid pre-save hook
            await newUser.save({ validateBeforeSave: false });
            console.log('Created new test user');
        }

        // Create another male test user if Samad needs more options
        const maleTestUserData = {
            name: 'Arjun Mehta',
            email: 'arjun.test@gmail.com',
            password: 'Arjun123',
            phone: '+91-9876543211',
            dateOfBirth: new Date('1994-08-20'), // 31 years old
            gender: 'male',
            location: {
                city: samad?.location?.city || 'Kabul',
                state: samad?.location?.state || 'Kabul Province',
                country: samad?.location?.country || 'Afghanistan'
            },
            interests: ['Technology', 'Sports', 'Music', 'Cooking', 'Travel'],
            bio: 'Tech enthusiast and sports lover. Always up for new adventures.',
            preferences: {
                ageRange: {
                    min: 22,
                    max: 30
                },
                gender: 'female',
                maxDistance: 50
            },
            photos: [
                {
                    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
                    public_id: 'arjun_test_photo'
                }
            ]
        };

        const existingMaleUser = await User.findOne({ email: maleTestUserData.email });
        if (existingMaleUser) {
            console.log('Male test user already exists');
            await User.findByIdAndUpdate(existingMaleUser._id, maleTestUserData);
            console.log('Updated existing male test user');
        } else {
            const hashedPasswordMale = await bcrypt.hash(maleTestUserData.password, 10);
            maleTestUserData.password = hashedPasswordMale;
            
            const newMaleUser = new User(maleTestUserData);
            await newMaleUser.save({ validateBeforeSave: false });
            console.log('Created new male test user');
        }

        // Display all users for verification
        const allUsers = await User.find({}).select('name email gender location.city interests');
        console.log('\n=== All Users ===');
        allUsers.forEach(user => {
            console.log(`${user.name} (${user.gender}) - ${user.email} - ${user.location?.city} - Interests: ${user.interests?.join(', ')}`);
        });

        console.log('\n=== Test User Credentials ===');
        console.log('Female Test User: priya.test@gmail.com / Priya123');
        console.log('Male Test User: arjun.test@gmail.com / Arjun123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating test user:', error);
        process.exit(1);
    }
}

createTestUser();
