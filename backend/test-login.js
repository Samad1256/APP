const axios = require('axios');

async function testLogin() {
    try {
        console.log('Testing login API...');
        
        const response = await axios.post('http://localhost:5001/api/auth/login', {
            email: 'samadpayenda61@gmail.com',
            password: 'Samad123'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Login successful!');
        console.log('Response:', response.data);
        
    } catch (error) {
        console.log('❌ Login failed!');
        
        if (error.response) {
            // Server responded with error status
            console.log('Error response:', error.response.data);
            console.log('Status:', error.response.status);
        } else if (error.request) {
            // Network error - server not responding
            console.log('❌ Server not responding!');
            console.log('Network error:', error.message);
        } else {
            // Other error
            console.log('Error:', error.message);
        }
    }
}

testLogin();
