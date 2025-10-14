import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const PricingTables = () => {
    return (
        <div className="slide-container">
<h1>Organisms: Pricing Tables</h1>
<p className="subtitle">Conversie-geoptimaliseerde pricing components met duidelijke waardepropositie</p>
<div className="pricing-grid">
<!-- Bronze Package -->
<div className="pricing-card bronze">
<div className="tier-badge">🥉</div>
<h3 className="tier-name">Brons Pakket</h3>
<p className="tier-description">Perfect voor kleinere feesten en intieme bijeenkomsten</p>
<div className="price-wrapper">
<div className="price">€495</div>
<div className="price-period">per evenement</div>
</div>
<div className="features-list">
<div className="feature-item">
<span className="feature-icon">✓</span>
<span className="feature-text">4 uur DJ service</span>
</div>
<div className="feature-item">
<span className="feature-icon">✓</span>
<span className="feature-text">Professionele geluidsapparatuur</span>
</div>
<div className="feature-item">
<span className="feature-icon">✓</span>
<span className="feature-text">Basis lichtshow</span>
</div>
<div className="feature-item">
<span className="feature-icon">✓</span>
<span className="feature-text">Muziekwensen vooraf</span>
</div>
<div className="feature-item">
<span className="feature-icon">✓</span>
<span className="feature-text">Tot 100 gasten</span>
</div>
<div className="feature-item">
<span className="feature-icon">✓</span>
<span className="feature-text">Standaard setup</span>
</div>
</div>
<button className="cta-button cta-secondary">Vraag Offerte Aan</button>
</div>
<!-- Silver Package - Featured -->
<div className="pricing-card silver">
<div className="tier-badge">🥈</div>
<h3 className="tier-name">Zilver Pakket</h3>
<p className="tier-description">De complete ervaring voor onvergetelijke feesten</p>
<div className="price-wrapper">
<div className="price">€795</div>
<div className="price-period">per evenement</div>
</div>
<div className="features-list">
<div className="feature-item">
<span className="feature-icon">✓</span>
<span className="feature-text"><strong>6 uur DJ service</strong></span>
</div>
<div className="feature-item">
<span className="feature-icon">✓</span>
<span className="feature-text">Premium geluidsapparatuur</span>
</div>
<div className="feature-item">
<span className="feature-icon">✓</span>
<span className="feature-text"><strong>Uitgebreide lichtshow</strong></span>
</div>
<div className="feature-item">
<span className="feature-icon">✓</span>
<span className="feature-text">Persoonlijk intakegesprek</span>
</div>
<div className="feature-item">
<span className="feature-icon">✓</span>
<span className="feature-text">Tot 200 gasten</span>
</div>
<div className="feature-item">
<span className="feature-icon">✓</span>
<span className="feature-text">Draadloze microfoon</span>
</div>
<div className="feature-item">
<span className="feature-icon">✓</span>
<span className="feature-text"><strong>100% Dansgarantie</strong></span>
</div>
</div>
<button className="cta-button cta-primary">Direct Boeken</button>
</div>
<!-- Gold Package -->
<div className="pricing-card gold">
<div className="tier-badge">🥇</div>
<h3 className="tier-name">Goud Pakket</h3>
<p className="tier-description">De ultieme all-inclusive entertainment ervaring</p>
<div className="price-wrapper">
<div className="price">€1.295</div>
<div className="price-period">per evenement</div>
</div>
<div className="features-list">
<div className="feature-item">
<span className="feature-icon">✓</span>
<span className="feature-text"><strong>8 uur DJ service</strong></span>
</div>
<div className="feature-item">
<span className="feature-icon">✓</span>
<span className="feature-text">Premium+ geluidsapparatuur</span>
</div>
<div className="feature-item">
<span className="feature-icon">✓</span>
<span className="feature-text"><strong>Spectaculaire lichtshow</strong></span>
</div>
<div className="feature-item">
<span className="feature-icon">✓</span>
<span className="feature-text">DJ + Live Saxofonist</span>
</div>
<div className="feature-item">
<span className="feature-icon">✓</span>
<span className="feature-text">Onbeperkt gasten</span>
</div>
<div className="feature-item">
<span className="feature-icon">✓</span>
<span className="feature-text">Meerdere microfoons</span>
</div>
<div className="feature-item">
<span className="feature-icon">✓</span>
<span className="feature-text">Persoonlijke playlist curation</span>
</div>
<div className="feature-item">
<span className="feature-icon">✓</span>
<span className="feature-text"><strong>VIP behandeling</strong></span>
</div>
</div>
<button className="cta-button cta-secondary">Vraag Offerte Aan</button>
</div>
</div>
<p className="pricing-note">
            * Alle pakketten inclusief opbouw, afbraak en reiskosten binnen 50km. Prijzen zijn exclusief BTW.
        </p>
</div>
    );
};

export default PricingTables;