// Test script to verify all features are working
const axios = require('axios');

const SERVER_URL = 'http://localhost:3001';

async function testFeature(name, testFn) {
  console.log(`\n🔍 Testing: ${name}`);
  try {
    await testFn();
    console.log(`✅ ${name}: PASSED`);
    return true;
  } catch (error) {
    console.log(`❌ ${name}: FAILED - ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Response: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Running feature tests...');
  
  const results = [];

  // Test 1: Server health
  results.push(await testFeature('Server Health', async () => {
    const response = await axios.get(`${SERVER_URL}/health`);
    if (response.status !== 200) throw new Error('Health check failed');
    if (response.data.status !== 'ok') throw new Error('Health status not ok');
  }));

  // Test 2: Resume download endpoint (HEAD request)
  results.push(await testFeature('Resume Download Endpoint', async () => {
    const response = await axios.head(`${SERVER_URL}/api/resume`);
    if (response.status !== 200) throw new Error('Resume endpoint not working');
    const contentType = response.headers['content-type'];
    if (!contentType || !contentType.includes('pdf')) {
      throw new Error('Resume not returning PDF content type');
    }
  }));

  // Test 3: Contact form submission
  results.push(await testFeature('Contact Form Submission', async () => {
    const response = await axios.post(`${SERVER_URL}/api/contact`, {
      full_name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message from the test script'
    });
    
    if (response.status !== 201) throw new Error('Contact submission failed');
    if (!response.data.success) throw new Error('Contact submission not successful');
    
    console.log(`   Contact ID: ${response.data.id}`);
    console.log(`   Email sent: ${response.data.emailSent}`);
    console.log(`   Email message: ${response.data.emailMessage}`);
  }));

  // Test 4: Meeting request submission
  results.push(await testFeature('Meeting Request Submission', async () => {
    const response = await axios.post(`${SERVER_URL}/api/meeting`, {
      customer_name: 'Test Customer',
      email: 'customer@example.com',
      meeting_topic: 'Project Discussion',
      requested_date: '2024-12-01',
      requested_time: '14:00',
      notes: 'Test meeting request'
    });
    
    if (response.status !== 201) throw new Error('Meeting submission failed');
    if (!response.data.success) throw new Error('Meeting submission not successful');
    
    console.log(`   Meeting ID: ${response.data.id}`);
    console.log(`   Email sent: ${response.data.emailSent}`);
  }));

  // Test 5: Admin data endpoint (with auth)
  results.push(await testFeature('Admin Data Access', async () => {
    const response = await axios.get(`${SERVER_URL}/api/admin/data`, {
      headers: {
        'X-Admin-Email': 'uhajucewog80@gmail.com'
      }
    });
    
    if (response.status !== 200) throw new Error('Admin data access failed');
    if (!response.data.statistics) throw new Error('Admin data not returned');
  }));

  // Test 6: Availability check
  results.push(await testFeature('Availability Check', async () => {
    const response = await axios.post(`${SERVER_URL}/api/availability`, {
      date: '2024-12-01'
    });
    
    if (response.status !== 200) throw new Error('Availability check failed');
    if (!response.data.bookedSlots || !response.data.availableSlots) {
      throw new Error('Availability data not complete');
    }
  }));

  // Test 7: Email configuration check
  results.push(await testFeature('Email Configuration Check', async () => {
    const response = await axios.get(`${SERVER_URL}/api/admin/email-config`);
    
    if (response.status !== 200) throw new Error('Email config check failed');
    if (!response.data.config) throw new Error('Email config not returned');
    
    console.log(`   EMAIL_USER: ${response.data.config.EMAIL_USER}`);
    console.log(`   EMAIL_PASSWORD: ${response.data.config.EMAIL_PASSWORD}`);
    console.log(`   EMAIL_ENABLED: ${response.data.config.EMAIL_ENABLED}`);
  }));

  // Summary
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log('\n📊 TEST SUMMARY:');
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 ALL TESTS PASSED! All features are working correctly.');
    console.log('\n🔗 Important URLs:');
    console.log(`   Server: ${SERVER_URL}`);
    console.log(`   Health: ${SERVER_URL}/health`);
    console.log(`   Resume: ${SERVER_URL}/api/resume`);
    console.log(`   Admin (needs auth): ${SERVER_URL}/api/admin/data`);
  } else {
    console.log('\n⚠️ Some tests failed. Check the errors above.');
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error.message);
  process.exit(1);
});

// Run tests
runAllTests();