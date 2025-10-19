// test-seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSeededData() {
  try {
    // Fetch all clients and events from the database
    const clients = await prisma.client.findMany();
    const events = await prisma.event.findMany();

    console.log('Clients:', clients);
    console.log('Events:', events);

    // Verify that the correct number of clients and events were created
    if (clients.length !== 5 || events.length !== 10) {
      throw new Error('Seeding failed: Incorrect number of clients or events.');
    }

    console.log('Test passed: Seeding data is correct.');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testSeededData();
