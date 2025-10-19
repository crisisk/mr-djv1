// seed.ts
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Function to generate random demo data for events
function generateEvent(clientId: number) {
  return {
    name: faker.lorem.words(3),
    date: faker.date.future(),
    location: faker.address.city(),
    description: faker.lorem.sentences(2),
    clientId,
  };
}

// Function to generate random demo data for clients
function generateClient() {
  return {
    name: faker.company.name(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  };
}

async function seedDatabase() {
  try {
    // Create 5 clients
    const clients = await Promise.all(
      Array.from({ length: 5 }).map(async () => {
        return prisma.client.create({
          data: generateClient(),
        });
      })
    );

    // Create 10 events associated with the clients
    const events = await Promise.all(
      Array.from({ length: 10 }).map(async () => {
        const randomClient = clients[Math.floor(Math.random() * clients.length)];
        return prisma.event.create({
          data: generateEvent(randomClient.id),
        });
      })
    );

    console.log('Database seeded successfully!');
    console.log('Clients:', clients);
    console.log('Events:', events);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Example usage
seedDatabase();
