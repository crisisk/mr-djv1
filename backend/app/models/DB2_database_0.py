// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

model Booking {
  id              Int           @id @default(autoincrement())
  userId          Int
  djId            Int
  eventDate       DateTime
  hoursBooked     Int
  status          BookingStatus @default(PENDING)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  // Relations
  user            User          @relation(fields: [userId], references: [id])
  dj              DJ            @relation(fields: [djId], references: [id])

  // Indexes for faster querying
  @@index([userId])
  @@index([djId])
}

model User {
  id              Int           @id @default(autoincrement())
  name            String
  email           String        @unique
  bookings        Booking[]
}

model DJ {
  id              Int           @id @default(autoincrement())
  name            String
  email           String        @unique
  bookings        Booking[]
}
