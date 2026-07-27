const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'uhajucewog80@gmail.com' }
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin);
      return;
    }
    
    // Create admin user
    const passwordHash = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.create({
      data: {
        email: 'uhajucewog80@gmail.com',
        passwordHash: passwordHash,
        name: 'Admin User',
        role: 'admin'
      }
    });
    
    console.log('Admin user created successfully:', {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role
    });
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();