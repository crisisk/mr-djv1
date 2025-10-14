import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const HeroSections = () => {
    return (
        <div className="slide-container">
<h1>Organisms: Hero Sections</h1>
<p className="subtitle">Conversie-geoptimaliseerde hero components voor verschillende pagina types</p>
<div className="hero-examples">
<!-- Homepage Hero -->
<div className="hero-wrapper">
<div className="hero-label">Homepage Hero</div>
<div className="hero-homepage">
<div className="hero-content">
<div className="hero-badge">✨ 100% Dansgarantie</div>
<h2 className="hero-title">
                            Jouw Feest,<br/>
<span className="highlight">Onvergetelijk</span> Gemaakt
                        </h2>
<p className="hero-description">
                            Professionele DJ service voor bruiloften en bedrijfsfeesten in heel Brabant. 15+ jaar ervaring, 2500+ geslaagde events.
                        </p>
<div className="hero-ctas">
<button className="hero-btn hero-btn-primary">Direct Beschikbaarheid</button>
<button className="hero-btn hero-btn-secondary">Bekijk Pakketten</button>
</div>
</div>
<div className="hero-stats">
<div className="stat-item">
<span className="stat-number">2500+</span>
<span className="stat-label">Events</span>
</div>
<div className="stat-item">
<span className="stat-number">10/10</span>
<span className="stat-label">Reviews</span>
</div>
<div className="stat-item">
<span className="stat-number">15+</span>
<span className="stat-label">Jaar</span>
</div>
</div>
</div>
</div>
<!-- Local SEO Hero -->
<div className="hero-wrapper">
<div className="hero-label">Local SEO Hero (City Pages)</div>
<div className="hero-local">
<div className="local-content">
<div className="local-location">
<span>📍</span>
<span>EINDHOVEN</span>
</div>
<h2 className="local-title">
                            Bruiloft DJ Eindhoven
                        </h2>
<p className="local-description">
                            Op zoek naar een professionele bruiloft DJ in Eindhoven? Mister DJ zorgt voor een onvergetelijke feestavond met 100% dansgarantie.
                        </p>
<div className="local-features">
<div className="local-feature">15+ jaar ervaring</div>
<div className="local-feature">100% dansgarantie</div>
<div className="local-feature">Lokale kennis</div>
</div>
<div className="local-cta">
<button className="hero-btn hero-btn-primary">Vraag Offerte Aan</button>
<button className="hero-btn hero-btn-secondary">Bekijk Reviews</button>
</div>
</div>
<div className="local-booking">
<div className="booking-icon">📅</div>
<div className="booking-text">Check<br/>Beschikbaarheid</div>
</div>
</div>
</div>
</div>
</div>
    );
};

export default HeroSections;