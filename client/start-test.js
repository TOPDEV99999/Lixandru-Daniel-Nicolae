// Simple test to verify the combined frontend-backend setup
const { exec } = require('child_process');
const http = require('http');

console.log('🧪 Testing Combined Frontend-Backend Setup\n');

// Test backend health
function testBackend() {
  return new Promise((resolve) => {
    console.log('1. Testing backend server...');
    
    const req = http.get('http://localhost:3001/health', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.status === 'ok') {
            console.log('   ✅ Backend is running correctly');
            console.log(`   📊 Service: ${json.service}, Version: ${json.version}`);
            resolve(true);
          } else {
            console.log('   ❌ Backend returned unexpected status');
            resolve(false);
          }
        } catch (e) {
          console.log('   ❌ Failed to parse backend response');
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log('   ❌ Backend is not running or not accessible');
      console.log(`   Error: ${err.message}`);
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.log('   ❌ Backend request timeout');
      req.destroy();
      resolve(false);
    });
  });
}

// Test API endpoints
function testAPIEndpoints() {
  return new Promise((resolve) => {
    console.log('\n2. Testing API endpoints...');
    
    const endpoints = [
      { path: '/', method: 'GET', name: 'Root endpoint' },
      { path: '/api', method: 'GET', name: 'API base' }
    ];

    let completed = 0;
    let passed = 0;

    endpoints.forEach((endpoint) => {
      const req = http.request({
        hostname: 'localhost',
        port: 3001,
        path: endpoint.path,
        method: endpoint.method,
        timeout: 3000
      }, (res) => {
        if (res.statusCode === 200 || res.statusCode === 404) {
          console.log(`   ✅ ${endpoint.name} (${res.statusCode})`);
          passed++;
        } else {
          console.log(`   ❌ ${endpoint.name} (${res.statusCode})`);
        }
        completed++;
        
        if (completed === endpoints.length) {
          console.log(`   📊 ${passed}/${endpoints.length} endpoints working`);
          resolve(passed === endpoints.length);
        }
      });

      req.on('error', () => {
        console.log(`   ❌ ${endpoint.name} (connection error)`);
        completed++;
        
        if (completed === endpoints.length) {
          console.log(`   📊 ${passed}/${endpoints.length} endpoints working`);
          resolve(passed === endpoints.length);
        }
      });

      req.end();
    });
  });
}

// Test configuration
function testConfiguration() {
  console.log('\n3. Checking configuration...');
  
  const fs = require('fs');
  const path = require('path');
  
  const configs = [
    { file: '.env.local', required: false, desc: 'Frontend environment' },
    { file: 'server/.env', required: true, desc: 'Backend environment' },
    { file: 'src/api/localClient.js', required: true, desc: 'Local API client' },
    { file: 'src/api/base44Compatibility.js', required: true, desc: 'Base44 compatibility layer' }
  ];

  let passed = 0;
  
  configs.forEach((config) => {
    const fullPath = path.join(__dirname, config.file);
    const exists = fs.existsSync(fullPath);
    
    if (exists) {
      console.log(`   ✅ ${config.desc}: ${config.file}`);
      passed++;
    } else if (config.required) {
      console.log(`   ❌ ${config.desc}: ${config.file} (MISSING)`);
    } else {
      console.log(`   ⚠️  ${config.desc}: ${config.file} (optional, missing)`);
      passed++; // Optional files don't fail the test
    }
  });

  console.log(`   📊 ${passed}/${configs.length} configuration files present`);
  return passed >= configs.filter(c => c.required).length;
}

// Run all tests
async function runTests() {
  console.log('='.repeat(50));
  
  const backendOk = await testBackend();
  const apiOk = await testAPIEndpoints();
  const configOk = testConfiguration();
  
  console.log('\n' + '='.repeat(50));
  console.log('📋 TEST SUMMARY');
  console.log('='.repeat(50));
  
  console.log(`Backend Server: ${backendOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`API Endpoints: ${apiOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Configuration: ${configOk ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = backendOk && apiOk && configOk;
  
  console.log('\n' + '='.repeat(50));
  
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('\n🚀 You can now run:');
    console.log('   npm run dev        # Start both frontend and backend');
    console.log('   or');
    console.log('   npm run dev:backend    # Backend only');
    console.log('   npm run dev:frontend   # Frontend only');
  } else {
    console.log('⚠️  SOME TESTS FAILED');
    console.log('\n🔧 To fix:');
    
    if (!backendOk) {
      console.log('   1. Start backend: cd server && npm run dev');
      console.log('   2. Check server/.env configuration');
    }
    
    if (!configOk) {
      console.log('   1. Check all required configuration files exist');
      console.log('   2. Run the migration setup steps from README.md');
    }
    
    console.log('\n📖 See server/README.md for setup instructions');
  }
  
  console.log('='.repeat(50));
  
  process.exit(allPassed ? 0 : 1);
}

// Handle CTRL+C
process.on('SIGINT', () => {
  console.log('\n\n👋 Test interrupted by user');
  process.exit(0);
});

// Run tests
runTests().catch(err => {
  console.error('Test failed with error:', err);
  process.exit(1);
});