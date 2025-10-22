-- =====================================================
-- A/B Testing Framework Database Schema
-- =====================================================
-- This migration creates all necessary tables for the
-- intelligent A/B testing system with automated winner
-- selection based on statistical significance.
-- =====================================================

-- Table: ab_tests
-- Stores test configurations and metadata
CREATE TABLE IF NOT EXISTS ab_tests (
    id SERIAL PRIMARY KEY,
    test_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('image', 'video', 'text', 'component', 'layout')),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
    goal VARCHAR(255) NOT NULL,
    min_sample_size INTEGER DEFAULT 100,
    confidence_level DECIMAL(3,2) DEFAULT 0.95,
    traffic_allocation DECIMAL(3,2) DEFAULT 1.00,
    winner_variant_id VARCHAR(50),
    winner_selected_at TIMESTAMP,
    winner_selection_method VARCHAR(50) CHECK (winner_selection_method IN ('automatic', 'manual', 'scheduled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    created_by VARCHAR(255),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Table: ab_variants
-- Stores variant definitions for each test
CREATE TABLE IF NOT EXISTS ab_variants (
    id SERIAL PRIMARY KEY,
    test_id VARCHAR(255) NOT NULL REFERENCES ab_tests(test_id) ON DELETE CASCADE,
    variant_id VARCHAR(50) NOT NULL,
    name VARCHAR(255),
    description TEXT,
    asset_url TEXT,
    asset_type VARCHAR(50),
    config JSONB DEFAULT '{}'::jsonb,
    weight INTEGER DEFAULT 50 CHECK (weight >= 0 AND weight <= 100),
    is_control BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(test_id, variant_id)
);

-- Table: ab_impressions
-- Tracks when users are exposed to a variant
CREATE TABLE IF NOT EXISTS ab_impressions (
    id SERIAL PRIMARY KEY,
    test_id VARCHAR(255) NOT NULL REFERENCES ab_tests(test_id) ON DELETE CASCADE,
    variant_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(255),
    session_id VARCHAR(255),
    user_agent TEXT,
    ip_address VARCHAR(45),
    referrer TEXT,
    page_url TEXT,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    country VARCHAR(2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Table: ab_conversions
-- Tracks when users complete the goal action
CREATE TABLE IF NOT EXISTS ab_conversions (
    id SERIAL PRIMARY KEY,
    test_id VARCHAR(255) NOT NULL REFERENCES ab_tests(test_id) ON DELETE CASCADE,
    variant_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(255),
    session_id VARCHAR(255),
    impression_id INTEGER REFERENCES ab_impressions(id) ON DELETE SET NULL,
    conversion_type VARCHAR(100),
    conversion_value DECIMAL(10,2),
    time_to_conversion INTEGER,
    user_agent TEXT,
    ip_address VARCHAR(45),
    page_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Table: ab_results
-- Stores aggregated statistics for each variant
CREATE TABLE IF NOT EXISTS ab_results (
    id SERIAL PRIMARY KEY,
    test_id VARCHAR(255) NOT NULL REFERENCES ab_tests(test_id) ON DELETE CASCADE,
    variant_id VARCHAR(50) NOT NULL,
    impressions INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,4) DEFAULT 0,
    total_value DECIMAL(12,2) DEFAULT 0,
    avg_value DECIMAL(10,2) DEFAULT 0,
    avg_time_to_conversion INTEGER,
    chi_square_statistic DECIMAL(10,4),
    p_value DECIMAL(10,8),
    is_significant BOOLEAN DEFAULT false,
    confidence_interval_lower DECIMAL(5,4),
    confidence_interval_upper DECIMAL(5,4),
    uplift_vs_control DECIMAL(6,2),
    last_calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(test_id, variant_id)
);

-- Table: ab_user_assignments
-- Tracks which variant each user is assigned to (for consistency)
CREATE TABLE IF NOT EXISTS ab_user_assignments (
    id SERIAL PRIMARY KEY,
    test_id VARCHAR(255) NOT NULL REFERENCES ab_tests(test_id) ON DELETE CASCADE,
    user_id VARCHAR(255),
    session_id VARCHAR(255),
    variant_id VARCHAR(50) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    UNIQUE(test_id, user_id, session_id)
);

-- Table: ab_events
-- Audit log for test lifecycle events
CREATE TABLE IF NOT EXISTS ab_events (
    id SERIAL PRIMARY KEY,
    test_id VARCHAR(255) NOT NULL REFERENCES ab_tests(test_id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    triggered_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Indexes for Performance Optimization
-- =====================================================

-- ab_tests indexes
CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_ab_tests_test_id ON ab_tests(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_created_at ON ab_tests(created_at);

-- ab_variants indexes
CREATE INDEX IF NOT EXISTS idx_ab_variants_test_id ON ab_variants(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_variants_test_variant ON ab_variants(test_id, variant_id);

-- ab_impressions indexes
CREATE INDEX IF NOT EXISTS idx_ab_impressions_test_id ON ab_impressions(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_impressions_variant_id ON ab_impressions(test_id, variant_id);
CREATE INDEX IF NOT EXISTS idx_ab_impressions_user_id ON ab_impressions(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_impressions_session_id ON ab_impressions(session_id);
CREATE INDEX IF NOT EXISTS idx_ab_impressions_created_at ON ab_impressions(created_at);

-- ab_conversions indexes
CREATE INDEX IF NOT EXISTS idx_ab_conversions_test_id ON ab_conversions(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_conversions_variant_id ON ab_conversions(test_id, variant_id);
CREATE INDEX IF NOT EXISTS idx_ab_conversions_user_id ON ab_conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_conversions_session_id ON ab_conversions(session_id);
CREATE INDEX IF NOT EXISTS idx_ab_conversions_impression_id ON ab_conversions(impression_id);
CREATE INDEX IF NOT EXISTS idx_ab_conversions_created_at ON ab_conversions(created_at);

-- ab_results indexes
CREATE INDEX IF NOT EXISTS idx_ab_results_test_variant ON ab_results(test_id, variant_id);
CREATE INDEX IF NOT EXISTS idx_ab_results_test_id ON ab_results(test_id);

-- ab_user_assignments indexes
CREATE INDEX IF NOT EXISTS idx_ab_user_assignments_test_user ON ab_user_assignments(test_id, user_id);
CREATE INDEX IF NOT EXISTS idx_ab_user_assignments_test_session ON ab_user_assignments(test_id, session_id);
CREATE INDEX IF NOT EXISTS idx_ab_user_assignments_expires ON ab_user_assignments(expires_at);

-- ab_events indexes
CREATE INDEX IF NOT EXISTS idx_ab_events_test_id ON ab_events(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_events_type ON ab_events(event_type);
CREATE INDEX IF NOT EXISTS idx_ab_events_created_at ON ab_events(created_at);

-- =====================================================
-- Triggers for Automatic Timestamp Updates
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ab_tests_updated_at BEFORE UPDATE ON ab_tests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ab_variants_updated_at BEFORE UPDATE ON ab_variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ab_results_updated_at BEFORE UPDATE ON ab_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Views for Easy Querying
-- =====================================================

-- View: ab_test_summary
-- Provides a complete overview of all tests with their results
CREATE OR REPLACE VIEW ab_test_summary AS
SELECT
    t.test_id,
    t.name,
    t.type,
    t.status,
    t.goal,
    t.confidence_level,
    t.winner_variant_id,
    t.winner_selected_at,
    t.started_at,
    t.ended_at,
    COUNT(DISTINCT v.variant_id) as variant_count,
    COALESCE(SUM(r.impressions), 0) as total_impressions,
    COALESCE(SUM(r.conversions), 0) as total_conversions,
    CASE
        WHEN COALESCE(SUM(r.impressions), 0) > 0
        THEN ROUND(COALESCE(SUM(r.conversions), 0)::numeric / SUM(r.impressions)::numeric, 4)
        ELSE 0
    END as overall_conversion_rate
FROM ab_tests t
LEFT JOIN ab_variants v ON t.test_id = v.test_id
LEFT JOIN ab_results r ON t.test_id = r.test_id AND v.variant_id = r.variant_id
GROUP BY t.test_id, t.name, t.type, t.status, t.goal, t.confidence_level,
         t.winner_variant_id, t.winner_selected_at, t.started_at, t.ended_at;

-- View: ab_variant_performance
-- Detailed performance metrics for each variant
CREATE OR REPLACE VIEW ab_variant_performance AS
SELECT
    t.test_id,
    t.name as test_name,
    t.status as test_status,
    v.variant_id,
    v.name as variant_name,
    v.is_control,
    COALESCE(r.impressions, 0) as impressions,
    COALESCE(r.conversions, 0) as conversions,
    COALESCE(r.conversion_rate, 0) as conversion_rate,
    COALESCE(r.total_value, 0) as total_value,
    COALESCE(r.avg_value, 0) as avg_value,
    COALESCE(r.uplift_vs_control, 0) as uplift_vs_control,
    r.is_significant,
    r.p_value,
    r.confidence_interval_lower,
    r.confidence_interval_upper,
    r.last_calculated_at
FROM ab_tests t
JOIN ab_variants v ON t.test_id = v.test_id
LEFT JOIN ab_results r ON t.test_id = r.test_id AND v.variant_id = r.variant_id
ORDER BY t.test_id, v.variant_id;

-- =====================================================
-- Sample Data (Optional - Comment out for production)
-- =====================================================

-- Insert a sample test for demonstration
-- UNCOMMENT THE LINES BELOW TO INSERT SAMPLE DATA

/*
INSERT INTO ab_tests (test_id, name, description, type, status, goal, min_sample_size, confidence_level)
VALUES (
    'hero-image-001',
    'Hero Image Test - Wedding vs Party',
    'Testing which hero image drives more contact form submissions',
    'image',
    'active',
    'contact_form_submit',
    100,
    0.95
);

INSERT INTO ab_variants (test_id, variant_id, name, description, asset_url, weight, is_control)
VALUES
    ('hero-image-001', 'A', 'Wedding Image (Control)', 'Traditional wedding DJ setup', '/media/photos/gallery/weddings/bruiloft-001.jpg', 50, true),
    ('hero-image-001', 'B', 'Party Image', 'Energetic party atmosphere', '/media/photos/gallery/parties/feest-001.jpg', 50, false);

INSERT INTO ab_results (test_id, variant_id)
VALUES
    ('hero-image-001', 'A'),
    ('hero-image-001', 'B');
*/

-- =====================================================
-- Cleanup Functions
-- =====================================================

-- Function to archive old tests
CREATE OR REPLACE FUNCTION archive_completed_tests(days_old INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    archived_count INTEGER;
BEGIN
    UPDATE ab_tests
    SET status = 'archived'
    WHERE status = 'completed'
        AND ended_at < CURRENT_TIMESTAMP - (days_old || ' days')::INTERVAL
        AND status != 'archived';

    GET DIAGNOSTICS archived_count = ROW_COUNT;
    RETURN archived_count;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old impressions (optional, use with caution)
CREATE OR REPLACE FUNCTION cleanup_old_impressions(days_old INTEGER DEFAULT 180)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM ab_impressions
    WHERE created_at < CURRENT_TIMESTAMP - (days_old || ' days')::INTERVAL
        AND test_id IN (SELECT test_id FROM ab_tests WHERE status = 'archived');

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Grant Permissions (Adjust based on your user setup)
-- =====================================================

-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_backend_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_backend_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO your_backend_user;

-- =====================================================
-- End of Migration
-- =====================================================
