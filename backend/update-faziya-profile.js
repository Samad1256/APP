const mongoose = require('mongoose');
const User = require('./src/models/User');

async function updateFaziyaProfile() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilsematchify');
        console.log('🔗 Connected to MongoDB');
        
        // Get Samad's profile data as reference
        const samad = await User.findOne({ email: 'samad_shaik@srmap.edu.in' });
        const faziya = await User.findOne({ email: 'faziya33@gmail.com' });
        
        if (!samad || !faziya) {
            console.log('❌ Could not find required users');
            return;
        }
        
        console.log('📋 Current Faziya profile:');
        console.log('   Name:', faziya.name);
        console.log('   Email:', faziya.email);
        console.log('   Gender:', faziya.gender);
        console.log('   Age:', new Date().getFullYear() - new Date(faziya.dateOfBirth).getFullYear());
        console.log('   Location:', faziya.location?.city || 'Not set');
        console.log('   Interests:', faziya.interests?.length || 0);
        console.log('   Photos:', faziya.photos?.length || 0);
        
        console.log('\n🔄 Updating Faziya profile with Samad\'s data...');
        
        // Update using direct database update to avoid pre-save hooks
        const updateResult = await User.updateOne(
            { email: 'faziya33@gmail.com' },
            { 
                $set: {
                    // Keep existing email, gender, and dateOfBirth (age)
                    // Update everything else from Samad's profile
                    location: samad.location,
                    bio: samad.bio,
                    interests: samad.interests,
                    photos: samad.photos,
                    preferences: samad.preferences,
                    isActive: true
                }
            }
        );
        
        console.log('Update result:', updateResult.modifiedCount > 0 ? 'SUCCESS' : 'FAILED');
        
        // Verify the update
        const updatedFaziya = await User.findOne({ email: 'faziya33@gmail.com' });
        
        console.log('\n✅ Updated Faziya profile:');
        console.log('   Name:', updatedFaziya.name);
        console.log('   Email:', updatedFaziya.email, '(unchanged)');
        console.log('   Gender:', updatedFaziya.gender, '(unchanged)');
        console.log('   Age:', new Date().getFullYear() - new Date(updatedFaziya.dateOfBirth).getFullYear(), '(unchanged)');
        console.log('   Location:', `${updatedFaziya.location.city}, ${updatedFaziya.location.country}`);
        console.log('   Bio:', updatedFaziya.bio ? updatedFaziya.bio.substring(0, 80) + '...' : 'Not set');
        console.log('   Interests:', updatedFaziya.interests.join(', '));
        console.log('   Photos:', updatedFaziya.photos.length, 'photo(s)');
        if (updatedFaziya.photos.length > 0) {
            console.log('   Profile Photo:', updatedFaziya.photos[0].url);
        }
        console.log('   Preferences:');
        console.log('     - Age Range:', `${updatedFaziya.preferences.ageRange.min}-${updatedFaziya.preferences.ageRange.max}`);
        console.log('     - Looking for:', updatedFaziya.preferences.gender);
        console.log('     - Max Distance:', updatedFaziya.preferences.maxDistance + ' km');
        
        console.log('\n🎉 Faziya\'s profile is now complete!');
        console.log('🔑 Login: faziya33@gmail.com | Password: password123');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔚 Disconnected from MongoDB');
    }
}

updateFaziyaProfile();
