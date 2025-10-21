-- Competitive Intelligence Seed Data for Mr. DJ
-- Created: 2025-10-21
-- Based on: Competitive Analysis Report
-- ============================================================

BEGIN;

-- ============================================================
-- COMPETITORS DATA
-- ============================================================

-- 1. SKYFLY - Market Leader
INSERT INTO competitors (name, website_url, business_type, geographic_focus, years_experience, pricing_min, pricing_max, rating_score, rating_count, rating_source, threat_level, last_analyzed_at)
VALUES (
    'SKYFLY',
    'https://skyfly.nl',
    'direct_competitor',
    'Nederland (landelijk)',
    NULL,
    NULL, -- Not disclosed
    NULL,
    9.80,
    609,
    'Multiple platforms',
    'critical',
    NOW()
) ON CONFLICT (name) DO UPDATE SET
    rating_score = EXCLUDED.rating_score,
    rating_count = EXCLUDED.rating_count,
    last_analyzed_at = NOW();

-- 2. Swinging.nl - Transparency Champion
INSERT INTO competitors (name, website_url, business_type, geographic_focus, founded_year, years_experience, pricing_min, pricing_max, rating_score, rating_count, rating_source, address_city, threat_level, last_analyzed_at)
VALUES (
    'Swinging.nl',
    'https://www.swinging.nl',
    'direct_competitor',
    'Nederland (landelijk, base Rotterdam)',
    2000,
    25,
    450,
    1200,
    9.50,
    579,
    'Multiple platforms',
    'Rotterdam',
    'high',
    NOW()
) ON CONFLICT (name) DO UPDATE SET
    years_experience = EXCLUDED.years_experience,
    rating_score = EXCLUDED.rating_score,
    rating_count = EXCLUDED.rating_count,
    last_analyzed_at = NOW();

-- 3. De Vriendelijke DJ's - Best Reviewed
INSERT INTO competitors (name, website_url, business_type, geographic_focus, pricing_min, pricing_max, rating_score, rating_count, rating_source, threat_level, last_analyzed_at)
VALUES (
    'De Vriendelijke DJ''s',
    'https://devriendelijkedjs.nl',
    'direct_competitor',
    'Nederland (landelijk)',
    NULL,
    NULL,
    10.0, -- Claims "best reviewed"
    NULL,
    'ThePerfectWedding.nl',
    'high',
    NOW()
) ON CONFLICT (name) DO UPDATE SET
    last_analyzed_at = NOW();

-- 4. Bruiloft DJ Brabant - Personal Touch
INSERT INTO competitors (name, website_url, business_type, geographic_focus, years_experience, pricing_min, pricing_max, rating_score, rating_count, rating_source, address_city, threat_level, last_analyzed_at)
VALUES (
    'Bruiloft DJ Brabant',
    'https://www.bruiloftdjbrabant.nl',
    'direct_competitor',
    'Brabant',
    28, -- 18 years bruiloft specialist specifically
    NULL,
    NULL,
    5.0, -- 5-star rating
    63,
    'Multiple platforms',
    'Eindhoven',
    'high', -- Direct Brabant competitor
    NOW()
) ON CONFLICT (name) DO UPDATE SET
    years_experience = EXCLUDED.years_experience,
    rating_score = EXCLUDED.rating_score,
    rating_count = EXCLUDED.rating_count,
    last_analyzed_at = NOW();

-- 5. Draaimeesters / DJ Giel - Brabant Specialist
INSERT INTO competitors (name, website_url, business_type, geographic_focus, founded_year, years_experience, pricing_min, pricing_max, address_city, threat_level, last_analyzed_at)
VALUES (
    'Draaimeesters (DJ Giel)',
    'https://www.draaimeesters.com',
    'direct_competitor',
    'Noord-Brabant (Eindhoven/Den Bosch)',
    2013,
    12,
    NULL,
    NULL,
    'Son en Breugel',
    'medium',
    NOW()
) ON CONFLICT (name) DO UPDATE SET
    years_experience = EXCLUDED.years_experience,
    last_analyzed_at = NOW();

-- 6. Sound4All - Drive-in Show Hybrid
INSERT INTO competitors (name, website_url, business_type, geographic_focus, years_experience, pricing_min, pricing_max, threat_level, last_analyzed_at)
VALUES (
    'Sound4All',
    'https://sound4all.nl',
    'indirect_competitor', -- Different positioning (drive-in)
    'Nederland (landelijk)',
    15,
    NULL,
    NULL,
    'low',
    NOW()
) ON CONFLICT (name) DO UPDATE SET
    years_experience = EXCLUDED.years_experience,
    last_analyzed_at = NOW();

-- ============================================================
-- COMPETITOR USPs
-- ============================================================

-- SKYFLY USPs
INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'guarantee', '100% dansgarantie', 9 FROM competitors WHERE name = 'SKYFLY';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'service', 'Personalized DJ matching process', 8 FROM competitors WHERE name = 'SKYFLY';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'service', 'Reserve DJ availability', 9 FROM competitors WHERE name = 'SKYFLY';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'experience', 'Award-winning DJ performers', 7 FROM competitors WHERE name = 'SKYFLY';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'service', 'Destination weddings (international)', 6 FROM competitors WHERE name = 'SKYFLY';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'pricing', 'All-inclusive transparent pricing', 8 FROM competitors WHERE name = 'SKYFLY';

-- Swinging.nl USPs
INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'pricing', 'Transparent pricing €450-€1.200 per DJ', 9 FROM competitors WHERE name = 'Swinging.nl';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'experience', '25 years experience (longest track record)', 8 FROM competitors WHERE name = 'Swinging.nl';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'guarantee', 'Altijd spelen garantie (replacement DJ)', 9 FROM competitors WHERE name = 'Swinging.nl';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'service', 'Keurmerk Trouwen certified', 7 FROM competitors WHERE name = 'Swinging.nl';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'service', 'Named DJs (you know exactly who comes)', 8 FROM competitors WHERE name = 'Swinging.nl';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'service', 'Week-before confirmation call', 6 FROM competitors WHERE name = 'Swinging.nl';

-- De Vriendelijke DJ's USPs
INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'experience', 'Best reviewed wedding DJs in Netherlands', 10 FROM competitors WHERE name = 'De Vriendelijke DJ''s';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'guarantee', 'Backup DJ always available', 9 FROM competitors WHERE name = 'De Vriendelijke DJ''s';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'service', 'Large screen display for wedding photos during DJ set', 7 FROM competitors WHERE name = 'De Vriendelijke DJ''s';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'service', '1-op-1 meeting with actual DJ (not salesperson)', 8 FROM competitors WHERE name = 'De Vriendelijke DJ''s';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'service', 'Never late guarantee (ruime scheduling margins)', 7 FROM competitors WHERE name = 'De Vriendelijke DJ''s';

-- Bruiloft DJ Brabant USPs
INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'service', 'Owner is the DJ (Ik ben zelf de DJ op jullie feest)', 9 FROM competitors WHERE name = 'Bruiloft DJ Brabant';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'experience', '28 years experience, 18 years bruiloft specialist', 8 FROM competitors WHERE name = 'Bruiloft DJ Brabant';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'pricing', 'Geen aanbetaling, geen annuleringskosten', 8 FROM competitors WHERE name = 'Bruiloft DJ Brabant';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'pricing', 'Pricing based on guest count (transparent)', 7 FROM competitors WHERE name = 'Bruiloft DJ Brabant';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'service', 'No excessive talking/comedy (professional approach)', 6 FROM competitors WHERE name = 'Bruiloft DJ Brabant';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'guarantee', '100% DJ Guarantee', 8 FROM competitors WHERE name = 'Bruiloft DJ Brabant';

-- Draaimeesters USPs
INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'experience', 'Local Brabant knowledge (venues in Eindhoven/Den Bosch)', 8 FROM competitors WHERE name = 'Draaimeesters (DJ Giel)';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'service', 'Complete stylish shows (DJ + sound + lighting all-in)', 7 FROM competitors WHERE name = 'Draaimeesters (DJ Giel)';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'service', 'Max 1 event per evening (exclusive focus)', 8 FROM competitors WHERE name = 'Draaimeesters (DJ Giel)';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'service', 'Sax and DJ option', 6 FROM competitors WHERE name = 'Draaimeesters (DJ Giel)';

-- Sound4All USPs
INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'service', 'DJ + drive-in show hybrid (unique combo)', 5 FROM competitors WHERE name = 'Sound4All';

INSERT INTO competitor_usps (competitor_id, usp_category, usp_text, impact_score)
SELECT id, 'experience', '15+ years experience', 6 FROM competitors WHERE name = 'Sound4All';

-- ============================================================
-- COMPETITOR SERVICES
-- ============================================================

-- SKYFLY Services
INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'DJ Service', 'dj', true FROM competitors WHERE name = 'SKYFLY';

INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'Light & Sound Production', 'lighting', true FROM competitors WHERE name = 'SKYFLY';

INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'Background Dinner Music', 'dj', false FROM competitors WHERE name = 'SKYFLY';

INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'Band + DJ Combinations', 'band', false FROM competitors WHERE name = 'SKYFLY';

-- Swinging.nl Services
INSERT INTO competitor_services (competitor_id, service_name, service_type, price, included_in_base)
SELECT id, 'DJ Rutger', 'dj', 450, false FROM competitors WHERE name = 'Swinging.nl';

INSERT INTO competitor_services (competitor_id, service_name, service_type, price, included_in_base)
SELECT id, 'DJ Peter Smit', 'dj', 995, false FROM competitors WHERE name = 'Swinging.nl';

INSERT INTO competitor_services (competitor_id, service_name, service_type, price, included_in_base)
SELECT id, 'DJ Edgar', 'dj', 1200, false FROM competitors WHERE name = 'Swinging.nl';

INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'DJ + Sax', 'addon', false FROM competitors WHERE name = 'Swinging.nl';

INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'DJ + Trumpet', 'addon', false FROM competitors WHERE name = 'Swinging.nl';

INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'DJ + Strings', 'addon', false FROM competitors WHERE name = 'Swinging.nl';

INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'DJ + Vocalist', 'addon', false FROM competitors WHERE name = 'Swinging.nl';

-- De Vriendelijke DJ's Services
INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'DJ Show with Screen Display', 'dj', true FROM competitors WHERE name = 'De Vriendelijke DJ''s';

INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'Uplights', 'lighting', false FROM competitors WHERE name = 'De Vriendelijke DJ''s';

INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'Laser Shows', 'lighting', false FROM competitors WHERE name = 'De Vriendelijke DJ''s';

INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'Photo Booth', 'photobooth', false FROM competitors WHERE name = 'De Vriendelijke DJ''s';

INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'CO₂ Guns', 'effects', false FROM competitors WHERE name = 'De Vriendelijke DJ''s';

INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'LED Foam Sticks', 'effects', false FROM competitors WHERE name = 'De Vriendelijke DJ''s';

INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'LED Dance Floor', 'effects', false FROM competitors WHERE name = 'De Vriendelijke DJ''s';

INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'DJ with Saxophonist', 'addon', false FROM competitors WHERE name = 'De Vriendelijke DJ''s';

-- Bruiloft DJ Brabant Services
INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base, description)
SELECT id, 'DJ Service (Full Evening)', 'dj', true, 'Modern white DJ booth with LCD screen' FROM competitors WHERE name = 'Bruiloft DJ Brabant';

INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'LED Uplights', 'lighting', true FROM competitors WHERE name = 'Bruiloft DJ Brabant';

INSERT INTO competitor_services (competitor_id, service_name, service_type, price, included_in_base)
SELECT id, 'Photobooth', 'photobooth', 250, false FROM competitors WHERE name = 'Bruiloft DJ Brabant';

INSERT INTO competitor_services (competitor_id, service_name, service_type, price, included_in_base)
SELECT id, 'Retro Wedding Telephone', 'addon', 75, false FROM competitors WHERE name = 'Bruiloft DJ Brabant';

INSERT INTO competitor_services (competitor_id, service_name, service_type, price, included_in_base)
SELECT id, 'Sparkle Effect (Indoor Fireworks)', 'effects', 75, false FROM competitors WHERE name = 'Bruiloft DJ Brabant';

-- Draaimeesters Services
INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'Allround DJ', 'dj', true FROM competitors WHERE name = 'Draaimeesters (DJ Giel)';

INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'Professional Sound System', 'sound', true FROM competitors WHERE name = 'Draaimeesters (DJ Giel)';

INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'Lighting Show', 'lighting', true FROM competitors WHERE name = 'Draaimeesters (DJ Giel)';

INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'Uplights / Vloerspots', 'lighting', false FROM competitors WHERE name = 'Draaimeesters (DJ Giel)';

INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'Laser Shows with Blinders', 'lighting', false FROM competitors WHERE name = 'Draaimeesters (DJ Giel)';

INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'Sax and DJ', 'addon', false FROM competitors WHERE name = 'Draaimeesters (DJ Giel)';

INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'Fireworks', 'effects', false FROM competitors WHERE name = 'Draaimeesters (DJ Giel)';

INSERT INTO competitor_services (competitor_id, service_name, service_type, included_in_base)
SELECT id, 'Event Photo App', 'technology', false FROM competitors WHERE name = 'Draaimeesters (DJ Giel)';

-- ============================================================
-- COMPETITOR SWOT ANALYSIS
-- ============================================================

-- SKYFLY SWOT
INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'strength', 'brand', 'Highest review count (609) and rating (9.8)', 10, 'Launch aggressive review collection campaign - target 100+ reviews in 3 months' FROM competitors WHERE name = 'SKYFLY';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'strength', 'service_quality', 'Award-winning DJ performers', 8, 'Highlight our local Brabant expertise and personal touch' FROM competitors WHERE name = 'SKYFLY';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'strength', 'service_quality', 'Reserve DJ availability (risk mitigation)', 9, 'Implement and advertise our own backup DJ guarantee' FROM competitors WHERE name = 'SKYFLY';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'weakness', 'pricing', 'No transparent pricing (must request)', 6, 'Emphasize our transparent €795-€1.295 pricing' FROM competitors WHERE name = 'SKYFLY';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'weakness', 'service_quality', 'Landelijk = less local Brabant knowledge', 7, 'Promote "We know Brabant venues, culture, and vibe"' FROM competitors WHERE name = 'SKYFLY';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'threat', 'marketing', 'Large marketing budget, high visibility', 9, 'Focus on local SEO and venue partnerships' FROM competitors WHERE name = 'SKYFLY';

-- Swinging.nl SWOT
INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'strength', 'pricing', 'Transparent pricing €450-€1.200', 9, 'Show value-for-money vs budget options' FROM competitors WHERE name = 'Swinging.nl';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'strength', 'experience', '25 years experience (longest track record)', 8, 'Highlight our 2500+ events (quantity + quality)' FROM competitors WHERE name = 'Swinging.nl';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'strength', 'service_quality', 'Keurmerk Trouwen certification', 7, 'Research and obtain same certification' FROM competitors WHERE name = 'Swinging.nl';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'weakness', 'pricing', 'Budget DJ option (€450) may attract price-sensitive, not quality-focused', 5, 'Target quality-conscious couples willing to invest' FROM competitors WHERE name = 'Swinging.nl';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'weakness', 'service_quality', 'Based in Rotterdam (not Brabant native)', 6, 'Emphasize "Dé Feestspecialist van het Zuiden" positioning' FROM competitors WHERE name = 'Swinging.nl';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'threat', 'pricing', 'Price competition from €450 entry point', 7, 'Position on quality + local expertise, not price' FROM competitors WHERE name = 'Swinging.nl';

-- De Vriendelijke DJ's SWOT
INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'strength', 'brand', 'Claims "Best reviewed wedding DJs NL"', 10, 'Become "Best reviewed in Brabant" specifically' FROM competitors WHERE name = 'De Vriendelijke DJ''s';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'strength', 'service_quality', 'Quality-obsessed ("Minder dan 10 nemen we niet")', 9, 'Match quality standards, document our process' FROM competitors WHERE name = 'De Vriendelijke DJ''s';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'strength', 'service_quality', 'Unique DJ Show (screen with wedding photos)', 7, 'Consider similar visual engagement features' FROM competitors WHERE name = 'De Vriendelijke DJ''s';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'weakness', 'pricing', 'No pricing disclosed (barrier to conversion)', 6, 'Leverage our transparent pricing as advantage' FROM competitors WHERE name = 'De Vriendelijke DJ''s';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'weakness', 'service_quality', 'Part of larger Event-Vrienden company (less focus?)', 5, 'Highlight our specialized focus on Brabant events' FROM competitors WHERE name = 'De Vriendelijke DJ''s';

-- Bruiloft DJ Brabant SWOT
INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'strength', 'service_quality', 'Owner is DJ (personal touch, consistency)', 9, 'If we have owner-DJ model, emphasize this. Otherwise show team quality.' FROM competitors WHERE name = 'Bruiloft DJ Brabant';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'strength', 'experience', '28 years total, 18 years bruiloft specialist', 8, 'Emphasize our 2500+ events track record' FROM competitors WHERE name = 'Bruiloft DJ Brabant';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'strength', 'pricing', 'No deposit, no cancellation fees', 7, 'Consider matching this policy if feasible' FROM competitors WHERE name = 'Bruiloft DJ Brabant';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'strength', 'service_quality', 'Direct Brabant competitor with local knowledge', 9, 'Differentiate on scale (2500+ events) and guarantee strength' FROM competitors WHERE name = 'Bruiloft DJ Brabant';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'weakness', 'service_quality', 'One-man operation = no backup DJ mentioned', 8, 'Strongly advertise our backup DJ guarantee' FROM competitors WHERE name = 'Bruiloft DJ Brabant';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'weakness', 'service_quality', 'Smaller scale vs landelijke players', 6, 'Not a weakness for us - we can match scale' FROM competitors WHERE name = 'Bruiloft DJ Brabant';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'threat', 'service_quality', 'Direct geographic overlap (Eindhoven/Brabant)', 9, 'Win on reviews + guarantees + modern marketing' FROM competitors WHERE name = 'Bruiloft DJ Brabant';

-- Draaimeesters SWOT
INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'strength', 'experience', 'Local Brabant venues knowledge', 8, 'Match and exceed - create venue partnership program' FROM competitors WHERE name = 'Draaimeesters (DJ Giel)';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'strength', 'service_quality', 'Max 1 event per evening (exclusive attention)', 8, 'If true for us, emphasize this. Otherwise show quality management.' FROM competitors WHERE name = 'Draaimeesters (DJ Giel)';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'weakness', 'experience', 'Since 2013 (shorter track record vs 15+ years)', 6, 'Highlight our longer experience' FROM competitors WHERE name = 'Draaimeesters (DJ Giel)';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'weakness', 'service_quality', 'Limited to ~30 min radius from Son en Breugel', 5, 'Promote our wider Brabant coverage' FROM competitors WHERE name = 'Draaimeesters (DJ Giel)';

INSERT INTO competitor_swot (competitor_id, swot_type, category, description, impact_score, our_response)
SELECT id, 'weakness', 'pricing', 'No pricing disclosed', 6, 'Leverage transparent pricing advantage' FROM competitors WHERE name = 'Draaimeesters (DJ Giel)';

COMMIT;
