const mongoose = require('mongoose');
const User = require('./src/models/User');

async function showAllUsers() {
    try {
        await mongoose.connect('mongodb://localhost:27017/dilsematchify');
        console.log('🔗 Connected to MongoDB');
        
        const users = await User.find({}, {
            name: 1,
            email: 1,
            gender: 1,
            dateOfBirth: 1,
            location: 1,
            interests: 1,
            photos: 1,
            isActive: 1
        });
        
        console.log('👥 ALL USERS IN DATABASE:');
        console.log('=' .repeat(60));
        
        users.forEach((user, index) => {
            const age = new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear();
            
            console.log(`\n${index + 1}. ${user.name}`);
            console.log('   📧 Email:', user.email);
            console.log('   🔑 Password: password123');
            console.log('   👤 Gender:', user.gender);
            console.log('   🎂 Age:', age);
            console.log('   📍 Location:', user.location?.city || 'Not set');
            console.log('   💡 Interests:', user.interests?.join(', ') || 'None');
            console.log('   📷 Photos:', user.photos?.length || 0, 'photo(s)');
            if (user.photos && user.photos.length > 0) {
                console.log('   🖼️  Profile Photo:', user.photos[0].url);
            }
            console.log('   ⭐ Status:', user.isActive ? 'Active' : 'Inactive');
        });
        
        console.log('\n' + '=' .repeat(60));
        console.log('📊 SUMMARY:');
        console.log(`   Total Users: ${users.length}`);
        console.log(`   Active Users: ${users.filter(u => u.isActive).length}`);
        console.log(`   Male Users: ${users.filter(u => u.gender === 'male').length}`);
        console.log(`   Female Users: ${users.filter(u => u.gender === 'female').length}`);
        
        console.log('\n🌐 ACCESS USERS:');
        console.log('   Login Page: http://localhost:5001/loginpage.html');
        console.log('   Use any of the above email/password combinations');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔚 Disconnected from MongoDB');
    }
}

showAllUsers();
