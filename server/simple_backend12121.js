const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;

// Configure CORS to allow frontend requests
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'simple-backend',
    version: '1.0.0'
  });
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'Simple Backend API (Fallback)',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      contact: '/api/contact',
      meeting: '/api/meeting',
      availability: '/api/availability',
      functions: 'POST /api/functions/:functionName'
    }
  });
});

// Contact route (for direct API calls from localClient.js)
app.post('/api/contact', (req, res) => {
  console.log('Contact form submission:', req.body);
  res.status(201).json({ 
    success: true,
    message: 'Contact message submitted successfully112',
    id: 'contact-' + Date.now(),
    emailSent: false
  });
});

// Meeting route
app.post('/api/meeting', (req, res) => {
  console.log('Meeting request:', req.body);
  
  // Map frontend field names to backend field names
  const meetingData = {
    // Handle both frontend and backend field names
    customerName: req.body.customer_name || req.body.customerName || 'Unknown',
    email: req.body.email || 'unknown@example.com',
    meetingTopic: req.body.meeting_topic || req.body.meetingTopic || req.body.topic || 'General Discussion',
    requestedDate: req.body.requested_date || req.body.requestedDate || new Date().toISOString().split('T')[0],
    requestedTime: req.body.requested_time || req.body.requestedTime || '12:00',
    company: req.body.company || '',
    notes: req.body.notes || ''
  };
  
  res.status(201).json({ 
    success: true,
    message: 'Meeting request submitted successfully',
    id: 'meeting-' + Date.now(),
    emailSent: false,
    meeting: {
      id: 'meeting-' + Date.now(),
      ...meetingData,
      status: 'pending'
    }
  });
});

// Availability route
app.post('/api/availability', (req, res) => {
  const { date } = req.body;
  console.log('Availability check for date:', date);
  res.json({ 
    date,
    bookedSlots: ['09:00', '10:30', '14:00'],
    availableSlots: ['09:30', '10:00', '11:00', '11:30', '13:00', '13:30', '15:00', '15:30', '16:00'],
    totalBooked: 3,
    totalAvailable: 9
  });
});

// Resume download endpoint
app.get('/api/resume', (req, res) => {
  console.log('Resume download requested');
  const filePath = path.join(__dirname, 'files', 'Lixandru_Daniel_Nicolae.pdf');
  
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'Lixandru_Daniel_Nicolae_Resume.pdf', (err) => {
      if (err) {
        console.error('Error downloading resume:', err);
        res.status(500).json({ error: 'Failed to download resume' });
      }
    });
  } else {
    res.status(404).json({ error: 'Resume file not found' });
  }
});

// Base44 function compatibility
app.post('/api/functions/:functionName', (req, res) => {
  const { functionName } = req.params;
  
  console.log(`Base44 function invoked: ${functionName}`, req.body);
  
  switch (functionName) {
    case 'getAvailability':
      return res.json({
        data: { booked_slots: ['09:00', '10:30', '14:00'] },
        error: null,
        success: true
      });
      
    case 'submitMeeting':
      return res.json({
        data: { success: true, id: 'meeting-' + Date.now(), email_sent: false },
        error: null,
        success: true
      });
      
    case 'submitContact':
      return res.json({
        data: { 
          success: true, 
          id: 'contact-' + Date.now(), 
          email_sent: false,
          message: 'Contact submitted successfully' 
        },
        error: null,
        success: true
      });
      
    case 'getAdminData':
      return res.json({
        data: { visitors: [], meetings: [], messages: [] },
        error: null,
        success: true
      });
      
    case 'trackVisit':
      return res.json({
        data: { success: true },
        error: null,
        success: true
      });
      
    default:
      return res.status(404).json({ 
        error: 'Function not found',
        message: `Function ${functionName} is not implemented`,
        data: null,
        success: false
      });
  }
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: {
      health: '/health',
      api: {
        contact: 'POST /api/contact',
        meeting: 'POST /api/meeting',
        availability: 'POST /api/availability',
        functions: 'POST /api/functions/:functionName'
      }
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Simple backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Frontend should be running on: http://localhost:5173`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});