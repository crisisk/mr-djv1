// prisma/schema.prisma
model Event {
  id        Int      @id @default(autoincrement())
  date      DateTime
  type      String
  status    String
  client_id Int

  @@map("events")
}
