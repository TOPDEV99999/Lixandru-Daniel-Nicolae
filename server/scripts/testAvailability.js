const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAvailability() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    console.log('Testing availability for date:', today);
    
    const response = await fetch('http://localhost:3001/api/availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date: today })
    });
    
    const data = await response.json();
    console.log('Availability response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Error testing availability:', error);
  }
}

testAvailability();