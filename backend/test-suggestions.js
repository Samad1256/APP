const mongoose = require('mongoose');
const User = require('./src/models/User');
const Match = require('./src/models/Match');
const jwt = require('jsonwebtoken');

async function testSuggestions() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilse-matchify');
        console.log('Connected to MongoDB');

        // Find Samad
        const samad = await User.findOne({ email: 'samadpayenda61@gmail.com' });
        if (!samad) {
            console.log('Samad not found!');
            return;
        }
        
        console.log('Samad found:', samad.name, samad.gender);
        
        // Generate a token for Samad (using the same format as auth controller)
        const token = jwt.sign(
            { userId: samad._id }, 
            process.env.JWT_SECRET || 'fallback_secret_key'
        );
        console.log('Generated token for Samad');

        // Test the suggestions logic manually
        const existingMatches = await Match.find({
            $or: [
                { from: samad._id },
                { to: samad._id }
            ]
        });
        
        console.log('Existing matches for Samad:', existingMatches.length);

        const interactedUserIds = new Set();
        existingMatches.forEach(match => {
            if (match.from.toString() !== samad._id.toString()) {
                interactedUserIds.add(match.from.toString());
            }
            if (match.to.toString() !== samad._id.toString()) {
                interactedUserIds.add(match.to.toString());
            }
        });

        console.log('Interacted user IDs:', Array.from(interactedUserIds));

        // Find potential matches (females)
        const suggestions = await User.find({
            _id: { $ne: samad._id, $nin: Array.from(interactedUserIds) },
            gender: 'female'
        }).select('name email gender location interests');

        console.log('Found suggestions for Samad:');
        suggestions.forEach(user => {
            console.log(`- ${user.name} (${user.email}) - ${user.location?.city}`);
        });

        // Test with a real API call
        console.log('\n=== Testing API Call ===');
        const axios = require('axios');
        
        try {
            const response = await axios.get('http://localhost:5001/api/matches/suggestions', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('API Response:', response.data);
        } catch (apiError) {
            console.error('API Error:', apiError.response?.data || apiError.message);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testSuggestions();
