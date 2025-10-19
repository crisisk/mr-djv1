// prisma/migrations/20231010_initial_migration/migration.sql
-- Create the DJs table
CREATE TABLE "DJs" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "genre" VARCHAR(255) NOT NULL,
    "experience_years" INTEGER NOT NULL,
    "price_per_hour" DECIMAL(10, 2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- Create the Bookings table
CREATE TABLE "Bookings" (
    "id" SERIAL PRIMARY KEY,
    "dj_id" INTEGER NOT NULL REFERENCES "DJs"("id") ON DELETE CASCADE,
    "client_name" VARCHAR(255) NOT NULL,
    "event_date" TIMESTAMP(3) NOT NULL,
    "event_location" VARCHAR(255) NOT NULL,
    "total_price" DECIMAL(10, 2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- Indexes for faster querying
CREATE INDEX "dj_id_index" ON "Bookings"("dj_id");
CREATE INDEX "event_date_index" ON "Bookings"("event_date");
