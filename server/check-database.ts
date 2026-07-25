import { PrismaClient } from './src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking database for users and data...\n')

  try {
    // Check if database connection works
    await prisma.$connect()
    console.log('✅ Database connection successful')

    // Check users
    const users = await prisma.user.findMany()
    console.log(`\n📊 Total Users: ${users.length}`)
    
    if (users.length > 0) {
      console.log('\n👥 User List:')
      users.forEach((user, index) => {
        console.log(`\nUser ${index + 1}:`)
        console.log(`  ID: ${user.id}`)
        console.log(`  Email: ${user.email}`)
        console.log(`  Name: ${user.name || 'Not set'}`)
        console.log(`  Role: ${user.role}`)
        console.log(`  Created: ${user.createdAt.toLocaleString()}`)
      })
    } else {
      console.log('\n⚠️ No users found in database.')
      console.log('\n💡 To create an admin user, you can:')
      console.log('1. Use the registration endpoint: POST /api/auth/register')
      console.log('2. Use the simple_server.js which has mock authentication')
      console.log('3. Create a user directly via SQL:')
      console.log('   INSERT INTO users (email, password_hash, name, role)')
      console.log('   VALUES ("uhajucewog80@gmail.com", "[hashed-password]", "Admin", "admin")')
    }

    // Check other tables
    console.log('\n📈 Database Statistics:')
    const contactMessages = await prisma.contactMessage.findMany()
    const meetingRequests = await prisma.meetingRequest.findMany()
    const visitors = await prisma.visitor.findMany()
    
    console.log(`  Users: ${users.length}`)
    console.log(`  Contact Messages: ${contactMessages.length}`)
    console.log(`  Meeting Requests: ${meetingRequests.length}`)
    console.log(`  Visitors: ${visitors.length}`)

  } catch (error: any) {
    console.error('❌ Error checking database:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()