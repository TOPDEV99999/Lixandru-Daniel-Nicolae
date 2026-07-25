const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking database for users...\n');

  try {
    // Check if users table exists and has records
    const users = await prisma.user.findMany();
    
    console.log(`📊 Total Users: ${users.length}`);
    console.log('==========================================');
    
    if (users.length === 0) {
      console.log('No users found in the database.');
      console.log('\n💡 Tip: You can create a user by:');
      console.log('1. Using the registration API endpoint');
      console.log('2. Running: npm run dev and registering through frontend');
      console.log('3. Creating a user manually via Prisma Studio: npx prisma studio');
    } else {
      console.log('👥 User List:');
      users.forEach((user, index) => {
        console.log(`\nUser ${index + 1}:`);
        console.log(`  ID: ${user.id}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Name: ${user.name || 'Not set'}`);
        console.log(`  Role: ${user.role}`);
        console.log(`  Created: ${user.createdAt.toLocaleString()}`);
      });
    }

    console.log('\n==========================================');
    
    // Also check for other tables
    const contactMessages = await prisma.contactMessage.findMany();
    const meetingRequests = await prisma.meetingRequest.findMany();
    const visitors = await prisma.visitor.findMany();
    
    console.log('\n📈 Database Statistics:');
    console.log(`  Users: ${users.length}`);
    console.log(`  Contact Messages: ${contactMessages.length}`);
    console.log(`  Meeting Requests: ${meetingRequests.length}`);
    console.log(`  Visitors: ${visitors.length}`);
    
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();