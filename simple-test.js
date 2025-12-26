// Simple test without mongoose dependency
async function testAPI() {
    try {
        console.log('🧪 Testing DilSe Matchify API...');

        // Test registration with full data
        const testUserData = {
            name: 'Anita Rao',
            email: 'anita.test@example.com',
            password: 'Test123',
            dateOfBirth: '1995-05-15',
            gender: 'female',
            location: {
                city: 'Guntur',
                state: 'Andhra Pradesh',
                country: 'India'
            },
            bio: 'I am a very good girl who loves technology and traveling',
            interests: ['Technology', 'Programming', 'Music', 'Travel', 'Photography'],
            phone: '+91-9876543210',
            religion: 'Hindu',
            education: 'Engineering',
            occupation: 'Software Engineer'
        };

        console.log('📝 Attempting registration with data:', JSON.stringify(testUserData, null, 2));

        const response = await fetch('http://localhost:5001/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testUserData)
        });

        const result = await response.json();
        console.log('📋 Registration result:', JSON.stringify(result, null, 2));

        if (result.success) {
            console.log('✅ Registration successful!');
            const token = result.data.token;

            // Test getCurrentUser to see if bio and interests are saved
            console.log('\n🔍 Testing getCurrentUser...');
            const userResponse = await fetch('http://localhost:5001/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const userData = await userResponse.json();
            console.log('👤 Current user data:', JSON.stringify(userData, null, 2));

            // Specifically check bio and interests
            if (userData.success && userData.data.user) {
                const user = userData.data.user;
                console.log('\n📊 Profile Data Check:');
                console.log('Bio:', user.bio || 'NOT SAVED');
                console.log('Interests:', user.interests || 'NOT SAVED');
                console.log('Location:', user.location || 'NOT SAVED');
                console.log('Phone:', user.phone || 'NOT SAVED');
                console.log('Education:', user.education || 'NOT SAVED');
            }

            // Test matching suggestions
            console.log('\n💕 Testing match suggestions...');
            const suggestionsResponse = await fetch('http://localhost:5001/api/matches/suggestions', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const suggestionsData = await suggestionsResponse.json();
            console.log('🎯 Suggestions result:', JSON.stringify(suggestionsData, null, 2));

            if (suggestionsData.success) {
                console.log(`📊 Found ${suggestionsData.data.length} potential matches`);
            }

        } else {
            console.log('❌ Registration failed:', result.message);
        }

    } catch (error) {
        console.error('💥 Error:', error);
    }
}

// Run the test
testAPI();
