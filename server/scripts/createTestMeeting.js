const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestMeeting() {
  try {
    // Create a test meeting for today
    const today = new Date().toISOString().split('T')[0];
    
    const meeting = await prisma.meetingRequest.create({
      data: {
        customerName: 'Test User',
        email: 'test@example.com',
        meetingTopic: 'Test Meeting',
        requestedDate: today,
        requestedTime: '10:00',
        status: 'pending'
      }
    });
    
    console.log('Test meeting created:', {
      id: meeting.id,
      date: meeting.requestedDate,
      time: meeting.requestedTime,
      status: meeting.status
    });
    
  } catch (error) {
    console.error('Error creating test meeting:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestMeeting();