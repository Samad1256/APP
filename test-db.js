const mongoose = require('mongoose');

async function testDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/dilse-matchify');
        console.log('✅ Connected to MongoDB');

        // Test user creation with full data
        const testUserData = {
            name: 'Test Female User',
            email: 'test.female@gmail.com',
            password: 'Test123',
            dateOfBirth: new Date('1995-05-15'),
            gender: 'female',
            location: {
                city: 'Guntur',
                state: 'Andhra Pradesh',
                country: 'India'
            },
            bio: 'I am a very good girl who loves technology',
            interests: ['Technology', 'Programming', 'Music', 'Travel'],
            preferences: {
                ageRange: { min: 20, max: 35 },
                gender: 'male',
                maxDistance: 50
            }
        };

        // Test registration endpoint
        console.log('🧪 Testing registration with full data...');
        const response = await fetch('http://localhost:5001/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testUserData)
        });

        const result = await response.json();
        console.log('📋 Registration result:', result);

        if (result.success) {
            console.log('✅ Registration successful!');
            const token = result.data.token;

            // Test getCurrentUser to see if bio and interests are saved
            console.log('🔍 Testing getCurrentUser...');
            const userResponse = await fetch('http://localhost:5001/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const userData = await userResponse.json();
            console.log('👤 User data from API:', JSON.stringify(userData, null, 2));

            // Test matching suggestions
            console.log('💕 Testing match suggestions...');
            const suggestionsResponse = await fetch('http://localhost:5001/api/matches/suggestions', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const suggestionsData = await suggestionsResponse.json();
            console.log('🎯 Suggestions result:', JSON.stringify(suggestionsData, null, 2));

        } else {
            console.log('❌ Registration failed:', result.message);
        }

    } catch (error) {
        console.error('💥 Error:', error);
    } finally {
        mongoose.disconnect();
    }
}

testDatabase();
