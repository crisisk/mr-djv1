-- Keyword Analysis Seed Data for Mr. DJ
-- Created: 2025-10-21
-- Based on: Competitive Intelligence + SEO Research
-- ============================================================

BEGIN;

-- ============================================================
-- PRIMARY KEYWORDS (High Volume, High Intent)
-- ============================================================

INSERT INTO keywords (keyword_text, keyword_type, search_volume_estimate, competition_level, cpc_estimate, geographic_focus, search_intent, priority_score, status)
VALUES
    ('bruiloft dj', 'primary', 2400, 'high', 3.50, 'Nederland', 'transactional', 95, 'active'),
    ('bruiloft dj brabant', 'primary', 480, 'medium', 2.80, 'Brabant', 'transactional', 92, 'active'),
    ('bruiloft dj eindhoven', 'local', 390, 'medium', 3.20, 'Eindhoven', 'transactional', 90, 'active'),
    ('dj bruiloft', 'primary', 1900, 'high', 3.40, 'Nederland', 'transactional', 88, 'active'),
    ('dj huren bruiloft', 'primary', 720, 'high', 3.80, 'Nederland', 'transactional', 87, 'active'),
    ('feest dj', 'primary', 1600, 'high', 2.90, 'Nederland', 'transactional', 85, 'active'),
    ('trouw dj', 'primary', 880, 'medium', 3.60, 'Nederland', 'transactional', 84, 'active'),
    ('wedding dj nederland', 'primary', 320, 'medium', 3.20, 'Nederland', 'transactional', 82, 'active');

-- ============================================================
-- LOCAL KEYWORDS (City-Specific)
-- ============================================================

INSERT INTO keywords (keyword_text, keyword_type, search_volume_estimate, competition_level, cpc_estimate, geographic_focus, search_intent, priority_score, status)
VALUES
    ('dj eindhoven', 'local', 590, 'high', 2.50, 'Eindhoven', 'transactional', 89, 'active'),
    ('bruiloft dj tilburg', 'local', 260, 'medium', 2.90, 'Tilburg', 'transactional', 85, 'active'),
    ('bruiloft dj den bosch', 'local', 210, 'medium', 2.80, 'Den Bosch', 'transactional', 84, 'active'),
    ('bruiloft dj s-hertogenbosch', 'local', 140, 'low', 2.70, 'Den Bosch', 'transactional', 80, 'active'),
    ('bruiloft dj breda', 'local', 240, 'medium', 2.85, 'Breda', 'transactional', 83, 'active'),
    ('bruiloft dj helmond', 'local', 110, 'low', 2.40, 'Helmond', 'transactional', 75, 'active'),
    ('bruiloft dj veldhoven', 'local', 70, 'low', 2.20, 'Veldhoven', 'transactional', 78, 'active'),
    ('dj tilburg', 'local', 390, 'high', 2.30, 'Tilburg', 'transactional', 82, 'active'),
    ('dj breda', 'local', 320, 'high', 2.40, 'Breda', 'transactional', 81, 'active'),
    ('dj den bosch', 'local', 280, 'high', 2.35, 'Den Bosch', 'transactional', 80, 'active'),
    ('bruiloft dj venlo', 'local', 130, 'low', 2.50, 'Venlo', 'transactional', 76, 'active'),
    ('bruiloft dj roermond', 'local', 100, 'low', 2.45, 'Roermond', 'transactional', 74, 'active'),
    ('bruiloft dj weert', 'local', 85, 'low', 2.30, 'Weert', 'transactional', 72, 'active'),
    ('bruiloft dj oss', 'local', 95, 'low', 2.40, 'Oss', 'transactional', 73, 'active'),
    ('bruiloft dj uden', 'local', 75, 'low', 2.25, 'Uden', 'transactional', 71, 'active');

-- ============================================================
-- LONG-TAIL KEYWORDS (Specific Intent)
-- ============================================================

INSERT INTO keywords (keyword_text, keyword_type, search_volume_estimate, competition_level, cpc_estimate, geographic_focus, search_intent, priority_score, status)
VALUES
    ('wat kost een bruiloft dj', 'long_tail', 480, 'low', 2.10, 'Nederland', 'informational', 79, 'active'),
    ('bruiloft dj boeken', 'long_tail', 390, 'medium', 3.40, 'Nederland', 'transactional', 81, 'active'),
    ('goedkope bruiloft dj', 'long_tail', 260, 'medium', 2.80, 'Nederland', 'transactional', 68, 'active'),
    ('bruiloft dj met licht en geluid', 'long_tail', 170, 'low', 2.60, 'Nederland', 'transactional', 74, 'active'),
    ('bruiloft dj ervaring', 'long_tail', 140, 'low', 1.80, 'Nederland', 'informational', 72, 'active'),
    ('bruiloft dj reviews', 'long_tail', 210, 'low', 2.20, 'Nederland', 'commercial', 76, 'active'),
    ('beste bruiloft dj nederland', 'long_tail', 190, 'low', 2.90, 'Nederland', 'commercial', 77, 'active'),
    ('professionele bruiloft dj', 'long_tail', 320, 'medium', 3.10, 'Nederland', 'transactional', 80, 'active'),
    ('bruiloft dj dansgarantie', 'long_tail', 95, 'low', 2.40, 'Nederland', 'transactional', 70, 'active'),
    ('bruiloft dj 100% dansgarantie', 'long_tail', 45, 'low', 2.60, 'Nederland', 'transactional', 69, 'active'),
    ('bruiloft entertainment dj', 'long_tail', 280, 'medium', 2.70, 'Nederland', 'transactional', 75, 'active'),
    ('dj bruiloft kosten', 'long_tail', 350, 'low', 2.00, 'Nederland', 'informational', 77, 'active'),
    ('bruiloft dj met saxofoon', 'long_tail', 130, 'low', 2.50, 'Nederland', 'transactional', 68, 'active'),
    ('bruiloft dj inclusief lichtshow', 'long_tail', 110, 'low', 2.45, 'Nederland', 'transactional', 67, 'active'),
    ('allround bruiloft dj', 'long_tail', 220, 'medium', 2.80, 'Nederland', 'transactional', 74, 'active');

-- ============================================================
-- SECONDARY KEYWORDS (Supporting Content)
-- ============================================================

INSERT INTO keywords (keyword_text, keyword_type, search_volume_estimate, competition_level, cpc_estimate, geographic_focus, search_intent, priority_score, status)
VALUES
    ('feest dj brabant', 'secondary', 210, 'low', 2.40, 'Brabant', 'transactional', 73, 'active'),
    ('dj bedrijfsfeest', 'secondary', 880, 'high', 3.20, 'Nederland', 'transactional', 78, 'active'),
    ('dj bedrijfsfeest eindhoven', 'secondary', 140, 'medium', 2.80, 'Eindhoven', 'transactional', 75, 'active'),
    ('partij dj', 'secondary', 320, 'medium', 2.50, 'Nederland', 'transactional', 72, 'active'),
    ('dj verjaardag', 'secondary', 590, 'high', 2.20, 'Nederland', 'transactional', 70, 'active'),
    ('dj huren feest', 'secondary', 720, 'high', 2.90, 'Nederland', 'transactional', 76, 'active'),
    ('drive in show', 'secondary', 480, 'medium', 2.60, 'Nederland', 'transactional', 65, 'active'),
    ('dj geluid en licht', 'secondary', 390, 'medium', 2.70, 'Nederland', 'transactional', 71, 'active'),
    ('mobiele disco', 'secondary', 260, 'low', 2.30, 'Nederland', 'transactional', 63, 'active'),
    ('bruiloft muziek', 'secondary', 1200, 'high', 1.80, 'Nederland', 'informational', 68, 'active');

-- ============================================================
-- BRANDED COMPETITOR KEYWORDS (Monitoring)
-- ============================================================

INSERT INTO keywords (keyword_text, keyword_type, search_volume_estimate, competition_level, geographic_focus, search_intent, priority_score, status)
VALUES
    ('skyfly dj', 'branded', 320, 'low', 'Nederland', 'navigational', 60, 'tracking'),
    ('swinging.nl dj', 'branded', 180, 'low', 'Nederland', 'navigational', 58, 'tracking'),
    ('de vriendelijke djs', 'branded', 240, 'low', 'Nederland', 'navigational', 59, 'tracking'),
    ('bruiloft dj brabant eindhoven', 'branded', 90, 'low', 'Brabant', 'navigational', 57, 'tracking'),
    ('draaimeesters dj', 'branded', 110, 'low', 'Brabant', 'navigational', 56, 'tracking'),
    ('dj giel brabant', 'branded', 75, 'low', 'Brabant', 'navigational', 55, 'tracking');

-- ============================================================
-- INFORMATIONAL KEYWORDS (Content Marketing)
-- ============================================================

INSERT INTO keywords (keyword_text, keyword_type, search_volume_estimate, competition_level, cpc_estimate, geographic_focus, search_intent, priority_score, status)
VALUES
    ('bruiloft dj checklist', 'long_tail', 170, 'low', 1.40, 'Nederland', 'informational', 66, 'active'),
    ('wanneer bruiloft dj boeken', 'long_tail', 140, 'low', 1.60, 'Nederland', 'informational', 67, 'active'),
    ('tips bruiloft muziek', 'long_tail', 320, 'low', 1.20, 'Nederland', 'informational', 64, 'active'),
    ('bruiloft playlist maken', 'long_tail', 590, 'medium', 0.90, 'Nederland', 'informational', 62, 'active'),
    ('eerste dans bruiloft', 'long_tail', 880, 'low', 0.80, 'Nederland', 'informational', 61, 'active'),
    ('bruiloft muziek trends 2025', 'long_tail', 210, 'low', 1.10, 'Nederland', 'informational', 63, 'active'),
    ('bruiloft entertainment ideeën', 'long_tail', 390, 'low', 1.30, 'Nederland', 'informational', 65, 'active'),
    ('dj of band bruiloft', 'long_tail', 240, 'low', 1.50, 'Nederland', 'informational', 64, 'active'),
    ('bruiloft locaties brabant', 'long_tail', 480, 'medium', 1.80, 'Brabant', 'informational', 68, 'active'),
    ('trouwen in brabant', 'long_tail', 720, 'medium', 2.10, 'Brabant', 'informational', 66, 'active');

-- ============================================================
-- NEGATIVE KEYWORDS (Exclude from Ads)
-- ============================================================

-- Note: These would be stored differently in a real system, but documenting here for reference
-- INSERT INTO keywords (keyword_text, keyword_type, priority_score, status)
-- VALUES
--     ('gratis dj', 'negative', 0, 'excluded'),
--     ('dj cursus', 'negative', 0, 'excluded'),
--     ('dj equipment', 'negative', 0, 'excluded'),
--     ('dj mixer', 'negative', 0, 'excluded'),
--     ('pioneer dj', 'negative', 0, 'excluded'),
--     ('dj software', 'negative', 0, 'excluded');

-- ============================================================
-- COMPETITOR KEYWORD RANKINGS (Initial Snapshot)
-- ============================================================

-- SKYFLY rankings (estimated based on research)
INSERT INTO competitor_keyword_rankings (competitor_id, keyword_id, ranking_position, ranking_url)
SELECT
    (SELECT id FROM competitors WHERE name = 'SKYFLY'),
    id,
    CASE keyword_text
        WHEN 'bruiloft dj' THEN 3
        WHEN 'bruiloft dj boeken' THEN 2
        WHEN 'beste bruiloft dj nederland' THEN 1
        WHEN 'bruiloft dj reviews' THEN 2
        WHEN 'wedding dj nederland' THEN 1
        ELSE NULL
    END,
    'https://skyfly.nl/bruiloftdj/'
FROM keywords
WHERE keyword_text IN ('bruiloft dj', 'bruiloft dj boeken', 'beste bruiloft dj nederland', 'bruiloft dj reviews', 'wedding dj nederland');

-- Swinging.nl rankings
INSERT INTO competitor_keyword_rankings (competitor_id, keyword_id, ranking_position, ranking_url)
SELECT
    (SELECT id FROM competitors WHERE name = 'Swinging.nl'),
    id,
    CASE keyword_text
        WHEN 'bruiloft dj' THEN 5
        WHEN 'bruiloft dj boeken' THEN 3
        WHEN 'goedkope bruiloft dj' THEN 2
        WHEN 'wat kost een bruiloft dj' THEN 4
        WHEN 'professionele bruiloft dj' THEN 6
        ELSE NULL
    END,
    'https://www.swinging.nl/bruiloft-dj/'
FROM keywords
WHERE keyword_text IN ('bruiloft dj', 'bruiloft dj boeken', 'goedkope bruiloft dj', 'wat kost een bruiloft dj', 'professionele bruiloft dj');

-- De Vriendelijke DJ's rankings
INSERT INTO competitor_keyword_rankings (competitor_id, keyword_id, ranking_position, ranking_url)
SELECT
    (SELECT id FROM competitors WHERE name = 'De Vriendelijke DJ''s'),
    id,
    CASE keyword_text
        WHEN 'bruiloft dj' THEN 4
        WHEN 'beste bruiloft dj nederland' THEN 2
        WHEN 'bruiloft dj reviews' THEN 1
        WHEN 'bruiloft dj ervaring' THEN 3
        ELSE NULL
    END,
    'https://devriendelijkedjs.nl/'
FROM keywords
WHERE keyword_text IN ('bruiloft dj', 'beste bruiloft dj nederland', 'bruiloft dj reviews', 'bruiloft dj ervaring');

-- Bruiloft DJ Brabant rankings
INSERT INTO competitor_keyword_rankings (competitor_id, keyword_id, ranking_position, ranking_url)
SELECT
    (SELECT id FROM competitors WHERE name = 'Bruiloft DJ Brabant'),
    id,
    CASE keyword_text
        WHEN 'bruiloft dj brabant' THEN 1
        WHEN 'bruiloft dj eindhoven' THEN 2
        WHEN 'dj eindhoven' THEN 4
        WHEN 'feest dj brabant' THEN 3
        WHEN 'bruiloft dj ervaring' THEN 5
        ELSE NULL
    END,
    'https://www.bruiloftdjbrabant.nl/'
FROM keywords
WHERE keyword_text IN ('bruiloft dj brabant', 'bruiloft dj eindhoven', 'dj eindhoven', 'feest dj brabant', 'bruiloft dj ervaring');

-- Draaimeesters rankings
INSERT INTO competitor_keyword_rankings (competitor_id, keyword_id, ranking_position, ranking_url)
SELECT
    (SELECT id FROM competitors WHERE name = 'Draaimeesters (DJ Giel)'),
    id,
    CASE keyword_text
        WHEN 'bruiloft dj eindhoven' THEN 3
        WHEN 'dj eindhoven' THEN 5
        WHEN 'bruiloft dj brabant' THEN 4
        WHEN 'feest dj brabant' THEN 5
        WHEN 'bruiloft dj den bosch' THEN 4
        ELSE NULL
    END,
    'https://www.draaimeesters.com/'
FROM keywords
WHERE keyword_text IN ('bruiloft dj eindhoven', 'dj eindhoven', 'bruiloft dj brabant', 'feest dj brabant', 'bruiloft dj den bosch');

-- ============================================================
-- KEYWORD GROUPS/CLUSTERS (For Content Strategy)
-- ============================================================

-- Note: In a real system, you might have a keyword_groups table
-- For now, we'll use notes field to indicate grouping

UPDATE keywords SET notes = 'Cluster: Bruiloft DJ Core' WHERE keyword_text IN (
    'bruiloft dj', 'dj bruiloft', 'dj huren bruiloft', 'trouw dj', 'bruiloft dj boeken'
);

UPDATE keywords SET notes = 'Cluster: Local Brabant' WHERE keyword_text IN (
    'bruiloft dj brabant', 'bruiloft dj eindhoven', 'bruiloft dj tilburg',
    'bruiloft dj den bosch', 'bruiloft dj breda', 'feest dj brabant'
);

UPDATE keywords SET notes = 'Cluster: Pricing & Value' WHERE keyword_text IN (
    'wat kost een bruiloft dj', 'dj bruiloft kosten', 'goedkope bruiloft dj'
);

UPDATE keywords SET notes = 'Cluster: Quality & Reviews' WHERE keyword_text IN (
    'bruiloft dj ervaring', 'bruiloft dj reviews', 'beste bruiloft dj nederland',
    'professionele bruiloft dj'
);

UPDATE keywords SET notes = 'Cluster: Service Features' WHERE keyword_text IN (
    'bruiloft dj met licht en geluid', 'bruiloft dj dansgarantie',
    'bruiloft dj 100% dansgarantie', 'bruiloft dj met saxofoon',
    'bruiloft dj inclusief lichtshow', 'allround bruiloft dj'
);

UPDATE keywords SET notes = 'Cluster: Content Marketing' WHERE keyword_text IN (
    'bruiloft dj checklist', 'wanneer bruiloft dj boeken', 'tips bruiloft muziek',
    'bruiloft playlist maken', 'bruiloft muziek trends 2025', 'dj of band bruiloft'
);

-- ============================================================
-- KEYWORD PRIORITY MATRIX NOTES
-- ============================================================

COMMENT ON COLUMN keywords.priority_score IS '
Priority Score Calculation (1-100):
- Search Volume: 30%
- Competition Level (inverse): 20%
- Geographic Relevance: 20%
- Search Intent Match: 15%
- Current Ranking Gap: 15%

Priorities:
90-100: Critical (must rank top 3)
80-89: High (target top 5)
70-79: Medium (target top 10)
60-69: Low (nice to have)
<60: Monitoring only
';

COMMIT;

-- ============================================================
-- KEYWORD ANALYSIS SUMMARY
-- ============================================================

SELECT 'Keyword Analysis Summary' as report_section;

SELECT
    keyword_type,
    COUNT(*) as keyword_count,
    ROUND(AVG(search_volume_estimate), 0) as avg_volume,
    ROUND(AVG(priority_score), 0) as avg_priority
FROM keywords
GROUP BY keyword_type
ORDER BY COUNT(*) DESC;

SELECT 'Top 10 Priority Keywords' as report_section;

SELECT
    keyword_text,
    search_volume_estimate,
    competition_level,
    geographic_focus,
    priority_score,
    current_ranking
FROM keywords
WHERE status = 'active'
ORDER BY priority_score DESC, search_volume_estimate DESC
LIMIT 10;

SELECT 'Geographic Distribution' as report_section;

SELECT
    geographic_focus,
    COUNT(*) as keyword_count,
    SUM(search_volume_estimate) as total_volume
FROM keywords
GROUP BY geographic_focus
ORDER BY total_volume DESC;
