const fetch = require('node-fetch');

async function testLogin(email, password) {
  console.log(`\n🧪 Testing login with: ${email} / ${password}`);
  
  try {
    const response = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    console.log(`📊 Status: ${response.status}`);
    console.log(`📋 Response:`, JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log(`✅ Login successful for ${email}`);
    } else {
      console.log(`❌ Login failed for ${email}: ${data.message}`);
    }
  } catch (error) {
    console.log(`💥 Error:`, error.message);
  }
}

async function runTests() {
  // Test with invalid credentials
  await testLogin('d', 'd');
  await testLogin('fake@email.com', 'wrongpass');
  
  // Test with a real account (if exists)
  await testLogin('test@example.com', 'password123');
}

runTests();
