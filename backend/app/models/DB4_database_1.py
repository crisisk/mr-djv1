// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model DJ {
  id              Int       @id @default(autoincrement())
  name            String
  genre           String
  experienceYears Int
  pricePerHour    Float
  bookings        Booking[]
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model Booking {
  id             Int       @id @default(autoincrement())
  djId           Int
  dj             DJ        @relation(fields: [djId], references: [id])
  clientName     String
  eventDate      DateTime
  eventLocation  String
  totalPrice     Float
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}
