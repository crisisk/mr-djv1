-- Mister DJ Database Initialization Script

-- Create tables
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_date DATE,
    message TEXT,
    package_id VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS packages (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration VARCHAR(50),
    description TEXT,
    features JSONB,
    popular BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    event_type VARCHAR(100),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default packages
INSERT INTO packages (id, name, price, duration, features, popular) VALUES
('bronze', 'Brons Pakket', 795.00, '4 uur', 
 '["Professionele DJ", "Geluidssysteem", "Basisverlichting", "Muziekvoorkeuren formulier", "100% Dansgarantie"]'::jsonb, 
 FALSE),
('silver', 'Zilver Pakket', 995.00, '5 uur', 
 '["Professionele DJ", "Premium geluidssysteem", "LED verlichting", "Rookmachine", "Muziekvoorkeuren formulier", "Persoonlijk intakegesprek", "100% Dansgarantie"]'::jsonb, 
 TRUE),
('gold', 'Goud Pakket', 1295.00, '6 uur', 
 '["Professionele DJ", "Premium geluidssysteem", "Moving head verlichting", "Rookmachine", "DJ booth met logo", "Muziekvoorkeuren formulier", "Persoonlijk intakegesprek", "Saxofonist (optioneel)", "100% Dansgarantie"]'::jsonb, 
 FALSE)
ON CONFLICT (id) DO NOTHING;

-- Insert sample reviews
INSERT INTO reviews (name, event_type, rating, review_text, approved) VALUES
('Sarah & Tom', 'Bruiloft 2024', 5, 'Mister DJ maakte onze bruiloft onvergetelijk! De dansvloer was de hele avond vol en de muziekkeuze was perfect. Onze gasten praten er nog steeds over!', TRUE),
('Mark van der Berg', 'Corporate Event 2024', 5, 'Professioneel, betrouwbaar en geweldig in het lezen van het publiek. Ons bedrijfsfeest was een groot succes dankzij Mister DJ!', TRUE),
('Linda Janssen', '50 Jaar Jubileum 2024', 5, 'Van begin tot eind perfect geregeld. De 100% dansgarantie is geen loze belofte - iedereen stond op de dansvloer!', TRUE)
ON CONFLICT DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved);

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mrdj_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mrdj_user;

