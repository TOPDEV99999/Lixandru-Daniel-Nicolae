// Simple test without external dependencies
const http = require('http');

const SERVER_URL = 'http://localhost:3001';

function makeRequest(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsedBody = body ? JSON.parse(body) : {};
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsedBody
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: body
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testFeature(name, testFn) {
  console.log(`\n🔍 Testing: ${name}`);
  try {
    await testFn();
    console.log(`✅ ${name}: PASSED`);
    return true;
  } catch (error) {
    console.log(`❌ ${name}: FAILED - ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Running feature tests...');
  
  const results = [];

  // Test 1: Server health
  results.push(await testFeature('Server Health', async () => {
    const response = await makeRequest('GET', '/health');
    if (response.statusCode !== 200) throw new Error('Health check failed');
    if (response.data.status !== 'ok') throw new Error('Health status not ok');
    console.log(`   Status: ${response.data.status}`);
    console.log(`   Service: ${response.data.service}`);
  }));

  // Test 2: Resume download endpoint (HEAD request)
  results.push(await testFeature('Resume Download Endpoint', async () => {
    // Use GET to check if it responds
    const response = await makeRequest('GET', '/api/resume');
    if (response.statusCode !== 200) throw new Error('Resume endpoint not working');
    const contentType = response.headers['content-type'];
    if (!contentType || !contentType.includes('pdf')) {
      throw new Error('Resume not returning PDF content type');
    }
    console.log(`   Content-Type: ${contentType}`);
    console.log(`   Status: ${response.statusCode}`);
  }));

  // Test 3: Contact form submission
  results.push(await testFeature('Contact Form Submission', async () => {
    const response = await makeRequest('POST', '/api/contact', {
      full_name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message'
    });
    
    if (response.statusCode !== 201) throw new Error('Contact submission failed');
    if (!response.data.success) throw new Error('Contact submission not successful');
    
    console.log(`   Contact ID: ${response.data.id}`);
    console.log(`   Email sent: ${response.data.emailSent}`);
    console.log(`   Message: ${response.data.message}`);
  }));

  // Test 4: Meeting request submission
  results.push(await testFeature('Meeting Request Submission', async () => {
    const response = await makeRequest('POST', '/api/meeting', {
      customer_name: 'Test Customer',
      email: 'customer@example.com',
      meeting_topic: 'Project Discussion',
      requested_date: '2024-12-01',
      requested_time: '14:00'
    });
    
    if (response.statusCode !== 201) throw new Error('Meeting submission failed');
    if (!response.data.success) throw new Error('Meeting submission not successful');
    
    console.log(`   Meeting ID: ${response.data.id}`);
    console.log(`   Email sent: ${response.data.emailSent}`);
  }));

  // Test 5: Admin data endpoint
  results.push(await testFeature('Admin Data Access', async () => {
    const response = await makeRequest('GET', '/api/admin/data', null, {
      'X-Admin-Email': 'uhajucewog80@gmail.com'
    });
    
    if (response.statusCode !== 200) throw new Error('Admin data access failed');
    if (!response.data.statistics) throw new Error('Admin data not returned');
    console.log(`   Visitors: ${response.data.statistics.visitors.total}`);
    console.log(`   Meetings: ${response.data.statistics.meetings.total}`);
  }));

  // Test 6: Email configuration check
  results.push(await testFeature('Email Configuration Check', async () => {
    const response = await makeRequest('GET', '/api/admin/email-config');
    
    if (response.statusCode !== 200) throw new Error('Email config check failed');
    if (!response.data.config) throw new Error('Email config not returned');
    
    console.log(`   EMAIL_USER: ${response.data.config.EMAIL_USER}`);
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

// Run tests
runAllTests();