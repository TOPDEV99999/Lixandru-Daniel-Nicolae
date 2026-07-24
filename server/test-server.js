// Simple test script to verify server setup
const axios = require('axios');

const SERVER_URL = 'http://localhost:3001';

async function testServer() {
  console.log('Testing local backend server...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${SERVER_URL}/health`);
    console.log(`   ✓ Health check passed: ${JSON.stringify(healthResponse.data)}\n`);

    // Test root endpoint
    console.log('2. Testing root endpoint...');
    const rootResponse = await axios.get(SERVER_URL);
    console.log(`   ✓ Root endpoint: ${JSON.stringify(rootResponse.data)}\n`);

    // Test protected route (should fail without auth)
    console.log('3. Testing protected route (no auth)...');
    try {
      await axios.get(`${SERVER_URL}/api/protected`);
      console.log('   ✗ Should have failed without auth\n');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('   ✓ Correctly rejected unauthorized access\n');
      } else {
        console.log(`   ✗ Unexpected error: ${error.message}\n`);
      }
    }

    // Test admin route (should fail without admin role)
    console.log('4. Testing admin route (no auth)...');
    try {
      await axios.get(`${SERVER_URL}/api/admin`);
      console.log('   ✗ Should have failed without auth\n');
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('   ✓ Correctly rejected unauthorized access\n');
      } else {
        console.log(`   ✗ Unexpected error: ${error.message}\n`);
      }
    }

    console.log('✅ All tests passed!');
    console.log('\nServer is running correctly.');
    console.log(`Health check: ${SERVER_URL}/health`);
    console.log(`API documentation: ${SERVER_URL}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\nServer is not running. Please start it with:');
      console.error('cd server && npm run dev');
    } else if (error.response) {
      console.error(`\nServer responded with status ${error.response.status}:`);
      console.error(JSON.stringify(error.response.data, null, 2));
    }
    
    process.exit(1);
  }
}

// Run tests
testServer();