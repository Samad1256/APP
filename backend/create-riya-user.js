const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

async function createRiyaUser() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilsematchify');
        console.log('🔗 Connected to MongoDB');
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: 'riya.sharma@gmail.com' });
        if (existingUser) {
            console.log('❌ User Riya already exists');
            await mongoose.disconnect();
            return;
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        // Create new user - Riya
        const newUser = new User({
            name: 'Riya Sharma',
            email: 'riya.sharma@gmail.com',
            password: hashedPassword,
            dateOfBirth: new Date('2004-03-15'), // 21 years old
            gender: 'female',
            location: {
                city: 'Mumbai, Maharashtra',
                state: 'Maharashtra',
                country: 'India'
            },
            bio: "I'm a creative design student who loves art, photography, and exploring new places. I enjoy reading novels, watching movies, and spending time with friends. Looking for someone genuine and fun-loving!",
            interests: ['Photography', 'Art', 'Travel', 'Reading', 'Movies', 'Dancing'],
            preferences: {
                ageRange: {
                    min: 19,
                    max: 28
                },
                gender: 'male',
                maxDistance: 50
            },
            photos: [{
                url: 'https://images.unsplash.com/photo-1494790108755-2616b169ad14?w=400&h=400&fit=crop&crop=face',
                public_id: 'riya_profile_photo'
            }],
            isActive: true
        });
        
        await newUser.save();
        
        console.log('✅ User Riya created successfully!');
        console.log('👤 User Details:');
        console.log('   Name:', newUser.name);
        console.log('   Email:', newUser.email);
        console.log('   Password: password123');
        console.log('   Age:', new Date().getFullYear() - new Date(newUser.dateOfBirth).getFullYear());
        console.log('   Gender:', newUser.gender);
        console.log('   Location:', newUser.location.city);
        console.log('   Bio:', newUser.bio.substring(0, 80) + '...');
        console.log('   Interests:', newUser.interests.join(', '));
        console.log('   Profile Photo:', newUser.photos[0].url);
        console.log('');
        console.log('🔑 LOGIN CREDENTIALS:');
        console.log('   Email: riya.sharma@gmail.com');
        console.log('   Password: password123');
        
    } catch (error) {
        console.error('❌ Error creating user:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔚 Disconnected from MongoDB');
    }
}

createRiyaUser();
