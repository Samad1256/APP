const { MongoClient } = require('mongodb');

async function listUsers() {
    const client = await MongoClient.connect('mongodb://localhost:27017');
    const db = client.db('dilse-matchify');
    
    const users = await db.collection('users').find({}, {
        projection: {
            name: 1,
            email: 1,
            gender: 1,
            dateOfBirth: 1,
            location: 1,
            interests: 1
        }
    }).toArray();
    
    console.log('Current Users in Database:');
    console.log(JSON.stringify(users, null, 2));
    
    await client.close();
}

listUsers().catch(console.error);
