const mongoose = require('mongoose');
const User = require('./src/models/User');

async function updateUserProfile() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilsematchify');
        console.log('🔍 Updating user profile with sample data...');
        
        const updateData = {
            bio: "I'm a passionate software engineering student who loves exploring new technologies and solving complex problems. In my free time, you'll find me coding, reading tech blogs, or playing cricket with friends.",
            occupation: "Software Engineering Student",
            location: {
                city: "Guntur, Andhra Pradesh",
                country: "India"
            },
            interests: ["Technology", "Programming", "Cricket", "Movies", "Music", "Travel"],
            education: "Bachelor's Degree",
            lookingFor: "Meaningful connections and someone who shares my passion for technology and life adventures."
        };
        
        const result = await User.updateOne(
            { email: 'samad_shaik@srmap.edu.in' },
            { $set: updateData }
        );
        
        console.log('✅ Updated user profile:', result.modifiedCount, 'documents modified');
        
        // Verify the update
        const user = await User.findOne({ email: 'samad_shaik@srmap.edu.in' });
        console.log('\n👤 Updated user data:');
        console.log('  Name:', user.name);
        console.log('  Bio:', user.bio);
        console.log('  Occupation:', user.occupation);
        console.log('  Location:', user.location);
        console.log('  Interests:', user.interests);
        console.log('  Education:', user.education);
        
        await mongoose.disconnect();
        console.log('\n🎉 User profile updated successfully!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

updateUserProfile();
