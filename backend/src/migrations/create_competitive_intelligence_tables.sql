-- Competitive Intelligence Database Schema for Mr. DJ
-- Created: 2025-10-21
-- Purpose: Track competitors, keywords, and market intelligence

-- ============================================================
-- COMPETITORS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS competitors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    website_url VARCHAR(500),
    business_type VARCHAR(100), -- 'direct_competitor', 'indirect_competitor', 'partner'
    geographic_focus VARCHAR(255), -- 'Nederland', 'Brabant', 'Eindhoven', etc.
    founded_year INTEGER,
    years_experience INTEGER,
    events_count INTEGER,
    pricing_min INTEGER, -- in euros
    pricing_max INTEGER, -- in euros
    rating_score DECIMAL(3,2), -- e.g., 9.80
    rating_count INTEGER,
    rating_source VARCHAR(100), -- 'ThePerfectWedding', 'Google', 'Trustpilot'

    -- Contact info
    phone VARCHAR(50),
    email VARCHAR(255),
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_postal_code VARCHAR(20),
    address_country VARCHAR(50) DEFAULT 'Nederland',

    -- Metadata
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'monitoring'
    threat_level VARCHAR(50), -- 'low', 'medium', 'high', 'critical'
    last_analyzed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_competitors_threat_level ON competitors(threat_level);
CREATE INDEX IF NOT EXISTS idx_competitors_geographic_focus ON competitors(geographic_focus);
CREATE INDEX IF NOT EXISTS idx_competitors_status ON competitors(status);

-- ============================================================
-- COMPETITOR USPs (Unique Selling Points)
-- ============================================================
CREATE TABLE IF NOT EXISTS competitor_usps (
    id SERIAL PRIMARY KEY,
    competitor_id INTEGER REFERENCES competitors(id) ON DELETE CASCADE,
    usp_category VARCHAR(100), -- 'guarantee', 'experience', 'pricing', 'service', 'technology'
    usp_text TEXT NOT NULL,
    impact_score INTEGER CHECK (impact_score BETWEEN 1 AND 10), -- 1=low, 10=high
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_competitor_usps_competitor ON competitor_usps(competitor_id);
CREATE INDEX IF NOT EXISTS idx_competitor_usps_category ON competitor_usps(usp_category);

-- ============================================================
-- COMPETITOR SERVICES & PACKAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS competitor_services (
    id SERIAL PRIMARY KEY,
    competitor_id INTEGER REFERENCES competitors(id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    service_type VARCHAR(100), -- 'dj', 'lighting', 'photobooth', 'sax', 'uplights', etc.
    price INTEGER, -- in euros, NULL if not disclosed
    included_in_base BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_competitor_services_competitor ON competitor_services(competitor_id);
CREATE INDEX IF NOT EXISTS idx_competitor_services_type ON competitor_services(service_type);

-- ============================================================
-- COMPETITOR STRENGTHS & WEAKNESSES
-- ============================================================
CREATE TABLE IF NOT EXISTS competitor_swot (
    id SERIAL PRIMARY KEY,
    competitor_id INTEGER REFERENCES competitors(id) ON DELETE CASCADE,
    swot_type VARCHAR(20) NOT NULL CHECK (swot_type IN ('strength', 'weakness', 'opportunity', 'threat')),
    category VARCHAR(100), -- 'pricing', 'marketing', 'service_quality', 'brand', 'technology'
    description TEXT NOT NULL,
    impact_score INTEGER CHECK (impact_score BETWEEN 1 AND 10),
    our_response TEXT, -- How we respond/counter this
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_competitor_swot_competitor ON competitor_swot(competitor_id);
CREATE INDEX IF NOT EXISTS idx_competitor_swot_type ON competitor_swot(swot_type);

-- ============================================================
-- KEYWORDS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS keywords (
    id SERIAL PRIMARY KEY,
    keyword_text VARCHAR(500) NOT NULL UNIQUE,
    keyword_type VARCHAR(100), -- 'primary', 'secondary', 'long_tail', 'local', 'branded'
    search_volume_estimate INTEGER, -- monthly searches (estimated)
    competition_level VARCHAR(50), -- 'low', 'medium', 'high'
    cpc_estimate DECIMAL(10,2), -- Cost-per-click in euros

    -- SEO metrics
    current_ranking INTEGER, -- Our current position (NULL if not ranking)
    target_ranking INTEGER DEFAULT 1,
    ranking_url VARCHAR(500), -- Which of our pages ranks for this

    -- Geographic & intent
    geographic_focus VARCHAR(100), -- 'Nederland', 'Brabant', 'Eindhoven', etc.
    search_intent VARCHAR(50), -- 'informational', 'transactional', 'navigational', 'commercial'

    -- Priority
    priority_score INTEGER CHECK (priority_score BETWEEN 1 AND 100), -- Combined score
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'tracking', 'won', 'abandoned'

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_keywords_type ON keywords(keyword_type);
CREATE INDEX IF NOT EXISTS idx_keywords_priority ON keywords(priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_keywords_competition ON keywords(competition_level);
CREATE INDEX IF NOT EXISTS idx_keywords_geographic ON keywords(geographic_focus);

-- ============================================================
-- COMPETITOR KEYWORD RANKINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS competitor_keyword_rankings (
    id SERIAL PRIMARY KEY,
    competitor_id INTEGER REFERENCES competitors(id) ON DELETE CASCADE,
    keyword_id INTEGER REFERENCES keywords(id) ON DELETE CASCADE,
    ranking_position INTEGER,
    ranking_url VARCHAR(500),
    checked_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(competitor_id, keyword_id, checked_at)
);

CREATE INDEX IF NOT EXISTS idx_ckr_competitor ON competitor_keyword_rankings(competitor_id);
CREATE INDEX IF NOT EXISTS idx_ckr_keyword ON competitor_keyword_rankings(keyword_id);
CREATE INDEX IF NOT EXISTS idx_ckr_ranking ON competitor_keyword_rankings(ranking_position);

-- ============================================================
-- COMPETITOR REVIEWS & SOCIAL PROOF
-- ============================================================
CREATE TABLE IF NOT EXISTS competitor_reviews (
    id SERIAL PRIMARY KEY,
    competitor_id INTEGER REFERENCES competitors(id) ON DELETE CASCADE,
    platform VARCHAR(100), -- 'ThePerfectWedding', 'Google', 'Trustpilot', 'Facebook'
    review_count INTEGER,
    average_rating DECIMAL(3,2),
    url VARCHAR(500),
    scraped_at TIMESTAMP DEFAULT NOW(),
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_competitor_reviews_competitor ON competitor_reviews(competitor_id);
CREATE INDEX IF NOT EXISTS idx_competitor_reviews_platform ON competitor_reviews(platform);

-- ============================================================
-- COMPETITIVE ACTIONS & RESPONSES
-- ============================================================
CREATE TABLE IF NOT EXISTS competitive_actions (
    id SERIAL PRIMARY KEY,
    competitor_id INTEGER REFERENCES competitors(id) ON DELETE CASCADE,
    action_type VARCHAR(100), -- 'price_change', 'new_service', 'marketing_campaign', 'website_update'
    action_description TEXT NOT NULL,
    detected_at TIMESTAMP DEFAULT NOW(),
    impact_assessment TEXT,
    our_response TEXT,
    response_status VARCHAR(50), -- 'planned', 'in_progress', 'completed', 'no_action'
    assigned_to VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_competitive_actions_competitor ON competitive_actions(competitor_id);
CREATE INDEX IF NOT EXISTS idx_competitive_actions_status ON competitive_actions(response_status);

-- ============================================================
-- MARKET TRENDS
-- ============================================================
CREATE TABLE IF NOT EXISTS market_trends (
    id SERIAL PRIMARY KEY,
    trend_name VARCHAR(255) NOT NULL,
    trend_category VARCHAR(100), -- 'pricing', 'service', 'technology', 'customer_preference'
    trend_description TEXT,
    impact_level VARCHAR(50), -- 'low', 'medium', 'high', 'disruptive'
    adoption_stage VARCHAR(50), -- 'emerging', 'growing', 'mainstream', 'declining'
    our_adoption_status VARCHAR(50), -- 'not_adopted', 'evaluating', 'piloting', 'adopted'
    source VARCHAR(255), -- Where we learned about this
    source_url VARCHAR(500),
    identified_at TIMESTAMP DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_market_trends_category ON market_trends(trend_category);
CREATE INDEX IF NOT EXISTS idx_market_trends_impact ON market_trends(impact_level);

-- ============================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================

-- Competitor overview with latest ratings
CREATE OR REPLACE VIEW v_competitor_overview AS
SELECT
    c.id,
    c.name,
    c.website_url,
    c.geographic_focus,
    c.years_experience,
    c.events_count,
    c.pricing_min,
    c.pricing_max,
    c.rating_score,
    c.rating_count,
    c.rating_source,
    c.threat_level,
    c.status,
    COUNT(DISTINCT cu.id) as usp_count,
    COUNT(DISTINCT cs.id) as service_count,
    c.last_analyzed_at
FROM competitors c
LEFT JOIN competitor_usps cu ON c.id = cu.competitor_id
LEFT JOIN competitor_services cs ON c.id = cs.competitor_id
GROUP BY c.id;

-- Top priority keywords we should target
CREATE OR REPLACE VIEW v_priority_keywords AS
SELECT
    k.id,
    k.keyword_text,
    k.keyword_type,
    k.search_volume_estimate,
    k.competition_level,
    k.current_ranking,
    k.target_ranking,
    k.priority_score,
    k.geographic_focus,
    k.search_intent,
    COUNT(ckr.id) as competitors_ranking_count,
    AVG(ckr.ranking_position) as avg_competitor_position
FROM keywords k
LEFT JOIN competitor_keyword_rankings ckr ON k.id = ckr.keyword_id
WHERE k.status = 'active'
GROUP BY k.id
ORDER BY k.priority_score DESC, k.search_volume_estimate DESC;

-- Competitive threat matrix
CREATE OR REPLACE VIEW v_competitive_threat_matrix AS
SELECT
    c.name,
    c.geographic_focus,
    c.rating_score,
    c.rating_count,
    c.pricing_min,
    c.pricing_max,
    c.years_experience,
    c.threat_level,
    COUNT(DISTINCT cu.id) as usp_count,
    COUNT(DISTINCT csw.id) FILTER (WHERE csw.swot_type = 'strength') as strength_count,
    COUNT(DISTINCT csw.id) FILTER (WHERE csw.swot_type = 'weakness') as weakness_count,
    AVG(csw.impact_score) FILTER (WHERE csw.swot_type = 'strength') as avg_strength_impact,
    AVG(csw.impact_score) FILTER (WHERE csw.swot_type = 'weakness') as avg_weakness_impact
FROM competitors c
LEFT JOIN competitor_usps cu ON c.id = cu.competitor_id
LEFT JOIN competitor_swot csw ON c.id = csw.competitor_id
WHERE c.status = 'active'
GROUP BY c.id, c.name, c.geographic_focus, c.rating_score, c.rating_count,
         c.pricing_min, c.pricing_max, c.years_experience, c.threat_level
ORDER BY c.threat_level DESC, c.rating_score DESC;

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Function to calculate competitive threat score
CREATE OR REPLACE FUNCTION calculate_threat_score(competitor_id_param INTEGER)
RETURNS INTEGER AS $$
DECLARE
    threat_score INTEGER := 0;
    comp_record RECORD;
BEGIN
    SELECT * INTO comp_record FROM competitors WHERE id = competitor_id_param;

    -- Rating score (max 30 points)
    IF comp_record.rating_score IS NOT NULL THEN
        threat_score := threat_score + (comp_record.rating_score * 3)::INTEGER;
    END IF;

    -- Review count (max 20 points)
    IF comp_record.rating_count >= 500 THEN threat_score := threat_score + 20;
    ELSIF comp_record.rating_count >= 200 THEN threat_score := threat_score + 15;
    ELSIF comp_record.rating_count >= 100 THEN threat_score := threat_score + 10;
    ELSIF comp_record.rating_count >= 50 THEN threat_score := threat_score + 5;
    END IF;

    -- Experience (max 20 points)
    IF comp_record.years_experience >= 25 THEN threat_score := threat_score + 20;
    ELSIF comp_record.years_experience >= 15 THEN threat_score := threat_score + 15;
    ELSIF comp_record.years_experience >= 10 THEN threat_score := threat_score + 10;
    ELSIF comp_record.years_experience >= 5 THEN threat_score := threat_score + 5;
    END IF;

    -- Pricing (max 15 points - lower price = higher threat)
    IF comp_record.pricing_min <= 500 THEN threat_score := threat_score + 15;
    ELSIF comp_record.pricing_min <= 700 THEN threat_score := threat_score + 10;
    ELSIF comp_record.pricing_min <= 900 THEN threat_score := threat_score + 5;
    END IF;

    -- Geographic overlap (max 15 points)
    IF comp_record.geographic_focus ILIKE '%brabant%' OR
       comp_record.geographic_focus ILIKE '%eindhoven%' THEN
        threat_score := threat_score + 15;
    ELSIF comp_record.geographic_focus ILIKE '%nederland%' THEN
        threat_score := threat_score + 10;
    END IF;

    RETURN threat_score;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE competitors IS 'Main competitor tracking table';
COMMENT ON TABLE competitor_usps IS 'Unique Selling Points of competitors';
COMMENT ON TABLE competitor_services IS 'Services and packages offered by competitors';
COMMENT ON TABLE competitor_swot IS 'SWOT analysis elements for each competitor';
COMMENT ON TABLE keywords IS 'SEO keywords we track';
COMMENT ON TABLE competitor_keyword_rankings IS 'Historical keyword rankings for competitors';
COMMENT ON TABLE competitor_reviews IS 'Social proof metrics from various platforms';
COMMENT ON TABLE competitive_actions IS 'Competitive moves and our responses';
COMMENT ON TABLE market_trends IS 'Industry trends and innovations to track';

COMMENT ON FUNCTION calculate_threat_score IS 'Calculates a 0-100 threat score for a competitor based on multiple factors';
