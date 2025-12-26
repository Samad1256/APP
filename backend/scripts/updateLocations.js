const { MongoClient } = require('mongodb');

async function updateLocations() {
    const client = await MongoClient.connect('mongodb://localhost:27017');
    const db = client.db('dilse-matchify');
    
    // Update all users' locations
    await db.collection('users').updateMany({}, {
        $set: {
            location: {
                city: "Guntur",
                state: "Andhra Pradesh",
                country: "India"
            }
        }
    });
    
    // Get and display all users with their credentials
    const users = await db.collection('users').find({}, {
        projection: {
            name: 1,
            email: 1,
            password: 1,
            location: 1
        }
    }).toArray();
    
    console.log('\nUpdated User Credentials:');
    console.log('========================\n');
    users.forEach(user => {
        console.log(`Name: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Password: test123 (all users have same password)`);
        console.log(`Location: ${user.location.city}, ${user.location.state}`);
        console.log('------------------------\n');
    });
    
    await client.close();
}

updateLocations().catch(console.error);
