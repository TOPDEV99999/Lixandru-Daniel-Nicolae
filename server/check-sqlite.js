const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'dev.db');
console.log(`🔍 Checking SQLite database at: ${dbPath}`);

// Check if database file exists
const fs = require('fs');
if (!fs.existsSync(dbPath)) {
  console.log('❌ Database file not found!');
  console.log('💡 Make sure you ran: npx prisma migrate dev');
  process.exit(1);
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    return;
  }
  
  console.log('✅ Connected to SQLite database');
  
  // Check all tables
  db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, tables) => {
    if (err) {
      console.error('❌ Error getting tables:', err.message);
      db.close();
      return;
    }
    
    console.log(`\n📋 Database Tables (${tables.length}):`);
    tables.forEach((table, index) => {
      console.log(`  ${index + 1}. ${table.name}`);
    });
    
    // Check users table specifically
    console.log('\n👥 Checking users table...');
    db.all("SELECT * FROM users ORDER BY created_at", (err, users) => {
      if (err) {
        console.log('⚠️ Users table might not exist yet or has different name');
        console.log('Error:', err.message);
      } else {
        console.log(`📊 Total Users: ${users.length}`);
        
        if (users.length > 0) {
          console.log('\n👤 User Details:');
          users.forEach((user, index) => {
            console.log(`\nUser ${index + 1}:`);
            console.log(`  ID: ${user.id}`);
            console.log(`  Email: ${user.email}`);
            console.log(`  Name: ${user.name || 'Not set'}`);
            console.log(`  Role: ${user.role}`);
            console.log(`  Created: ${new Date(user.created_at).toLocaleString()}`);
          });
        } else {
          console.log('\n⚠️ No users found in the database.');
          console.log('\n💡 To create a user:');
          console.log('1. Start the server: npm run dev');
          console.log('2. Register through the frontend or API');
          console.log('3. Or use the simple_server.js which has mock auth');
        }
      }
      
      // Check other tables
      console.log('\n📈 Database Statistics:');
      
      // Contact messages
      db.get("SELECT COUNT(*) as count FROM contact_messages", (err, row) => {
        const contactCount = row ? row.count : 0;
        
        // Meeting requests
        db.get("SELECT COUNT(*) as count FROM meeting_requests", (err, row) => {
          const meetingCount = row ? row.count : 0;
          
          // Visitors
          db.get("SELECT COUNT(*) as count FROM visitors", (err, row) => {
            const visitorCount = row ? row.count : 0;
            
            console.log(`  Users: ${users.length}`);
            console.log(`  Contact Messages: ${contactCount}`);
            console.log(`  Meeting Requests: ${meetingCount}`);
            console.log(`  Visitors: ${visitorCount}`);
            
            console.log('\n==========================================');
            console.log('\n🎯 Database Status:');
            if (users.length > 0) {
              console.log('✅ Database is populated and ready for authentication');
            } else {
              console.log('⚠️ Database is empty - you need to create users first');
              console.log('\nQuick fix: Use the simple_server.js (port 3001) which has mock authentication');
              console.log('Or create a user via: npx prisma studio (GUI)');
            }
            
            db.close();
            console.log('\n✅ Database connection closed');
          });
        });
      });
    });
  });
});