import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const Cards = () => {
    return (
        <div className="slide-container">
<h1>Molecules: Cards</h1>
<p className="subtitle">Herbruikbare card components voor pricing, testimonials en events</p>
<div className="cards-grid">
<!-- Pricing Card -->
<div className="card-column">
<div className="card-label">Pricing Card</div>
<div className="card pricing-card">
<div className="pricing-header">
<div className="pricing-name">Zilver Pakket</div>
<div className="pricing-price">€995 <span>excl. BTW</span></div>
</div>
<div className="pricing-body">
<ul className="pricing-features">
<li>4 uur DJ service</li>
<li>Premium geluidssysteem</li>
<li>LED verlichting</li>
<li>Muziekwensen onbeperkt</li>
<li>Persoonlijk overleg</li>
</ul>
<button className="pricing-cta">Boek Dit Pakket</button>
</div>
</div>
</div>
<!-- Testimonial Card -->
<div className="card-column">
<div className="card-label">Testimonial Card</div>
<div className="card testimonial-card">
<div className="testimonial-header">
<div className="testimonial-avatar">JM</div>
<div className="testimonial-info">
<div className="testimonial-name">Jan &amp; Marie</div>
<div className="testimonial-role">Bruiloft • 15 juni 2024</div>
</div>
</div>
<div className="testimonial-rating">
<span className="star">★</span>
<span className="star">★</span>
<span className="star">★</span>
<span className="star">★</span>
<span className="star">★</span>
</div>
<p className="testimonial-text">
                        "Mister DJ heeft onze bruiloft onvergetelijk gemaakt! De dansvloer was de hele avond vol en de muziekkeuze was perfect afgestemd op onze wensen. Absolute aanrader!"
                    </p>
</div>
</div>
<!-- Event Card -->
<div className="card-column">
<div className="card-label">Event Card</div>
<div className="card event-card">
<div className="event-image">🎵</div>
<div className="event-body">
<div className="event-date">15 Juni 2024</div>
<h3 className="event-title">Bruiloft Eindhoven</h3>
<p className="event-description">
                            Een prachtige bruiloft in het centrum van Eindhoven met 150 gasten en een onvergetelijke feestavond.
                        </p>
<div className="event-meta">
<div className="event-meta-item">
<span>📍</span>
<span>Eindhoven</span>
</div>
<div className="event-meta-item">
<span>👥</span>
<span>150 gasten</span>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
    );
};

export default Cards;