import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const Icons = () => {
    return (
        <div className="slide-container">
<h1>Atoms: Icons</h1>
<p className="subtitle">Gestandaardiseerde iconografie voor diensten, features en navigatie (SVG-gebaseerd)</p>
<div className="icons-grid">
<div className="icon-category">Dienst Iconen (SVG)</div>
<!-- Bruiloft DJ (Wedding Ring & Note) -->
<div className="icon-card">
<div className="icon-display">
<svg className="svg-icon secondary-fill" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M12 2C8.686 2 6 4.686 6 8c0 2.85 2.06 5.21 4.8 5.84l-1.6 4.8c-.1.3.1.6.4.7h6.8c.3-.1.5-.4.4-.7l-1.6-4.8c2.74-.63 4.8-2.99 4.8-5.84 0-3.314-2.686-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zM16 18h-8l1.2-3.6c.1-.3.4-.5.7-.5h4.2c.3 0 .6.2.7.5L16 18z"></path>
<path d="M14.5 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="#1A2C4B"></path>
</svg>
</div>
<div className="icon-name">Bruiloft DJ</div>
<div className="icon-class">icon-wedding</div>
<div className="icon-variant">
<div className="variant-box secondary">💍</div>
<div className="variant-box dark">💍</div>
</div>
</div>
<!-- Bedrijfsfeest DJ (Corporate Building & Note) -->
<div className="icon-card">
<div className="icon-display">
<svg className="svg-icon primary-fill" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 20V4h12v16H6z"></path>
<path d="M8 6h2v2H8zM11 6h2v2h-2zM14 6h2v2h-2zM8 9h2v2H8zM11 9h2v2h-2zM14 9h2v2h-2zM8 12h2v2H8zM11 12h2v2h-2zM14 12h2v2h-2z" fill="#FFFFFF"></path>
<path d="M15 17.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="#D4AF37"></path>
</svg>
</div>
<div className="icon-name">Bedrijfsfeest DJ</div>
<div className="icon-class">icon-corporate</div>
<div className="icon-variant">
<div className="variant-box primary">🏢</div>
<div className="variant-box dark">🏢</div>
</div>
</div>
<!-- Private Feesten (Party Hat & Confetti) -->
<div className="icon-card">
<div className="icon-display">
<svg className="svg-icon secondary-fill" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M12 2L6 10h3v8h6v-8h3L12 2z"></path>
<circle cx="17" cy="17" fill="#00AEEF" r="2"></circle>
<circle cx="7" cy="17" fill="#1A2C4B" r="2"></circle>
<path d="M12 10l-1 3h2l-1-3z" fill="#1A2C4B"></path>
</svg>
</div>
<div className="icon-name">Private Feesten</div>
<div className="icon-class">icon-private-party</div>
<div className="icon-variant">
<div className="variant-box secondary">🎉</div>
<div className="variant-box dark">🎉</div>
</div>
</div>
<!-- DJ + Saxofonist -->
<div className="icon-card">
<div className="icon-display primary-color">🎷</div>
<div className="icon-name">DJ + Saxofonist</div>
<div className="icon-class">icon-sax</div>
<div className="icon-variant">
<div className="variant-box primary">🎷</div>
<div className="variant-box dark">🎷</div>
</div>
</div>
<!-- Overige Diensten -->
<div className="icon-card">
<div className="icon-display primary-color">🎧</div>
<div className="icon-name">Overige Diensten</div>
<div className="icon-class">icon-other-services</div>
<div className="icon-variant">
<div className="variant-box primary">🎧</div>
<div className="variant-box dark">🎧</div>
</div>
</div>
<div className="icon-category utility">Utility Iconen (Dark)</div>
<!-- Checkmark -->
<div className="icon-card">
<div className="icon-display dark-color">✓</div>
<div className="icon-name">Checkmark</div>
<div className="icon-class">icon-check</div>
<div className="icon-variant">
<div className="variant-box dark">✓</div>
<div className="variant-box primary">✓</div>
</div>
</div>
<!-- Calendar -->
<div className="icon-card">
<div className="icon-display dark-color">📅</div>
<div className="icon-name">Beschikbaarheid</div>
<div className="icon-class">icon-calendar</div>
<div className="icon-variant">
<div className="variant-box dark">📅</div>
<div className="variant-box primary">📅</div>
</div>
</div>
<!-- Location -->
<div className="icon-card">
<div className="icon-display dark-color">📍</div>
<div className="icon-name">Locatie</div>
<div className="icon-class">icon-location</div>
<div className="icon-variant">
<div className="variant-box dark">📍</div>
<div className="variant-box primary">📍</div>
</div>
</div>
<!-- Quote -->
<div className="icon-card">
<div className="icon-display dark-color">💬</div>
<div className="icon-name">Review / Quote</div>
<div className="icon-class">icon-quote</div>
<div className="icon-variant">
<div className="variant-box dark">💬</div>
<div className="variant-box primary">💬</div>
</div>
</div>
<!-- Star -->
<div className="icon-card">
<div className="icon-display secondary-color">⭐</div>
<div className="icon-name">Rating Star</div>
<div className="icon-class">icon-star</div>
<div className="icon-variant">
<div className="variant-box secondary">⭐</div>
<div className="variant-box dark">⭐</div>
</div>
</div>
<div className="icon-category social">Social Media Iconen (Secondary)</div>
<!-- Facebook -->
<div className="icon-card">
<div className="icon-display secondary-color">📘</div>
<div className="icon-name">Facebook</div>
<div className="icon-class">icon-facebook</div>
</div>
<!-- Instagram -->
<div className="icon-card">
<div className="icon-display secondary-color">📷</div>
<div className="icon-name">Instagram</div>
<div className="icon-class">icon-instagram</div>
</div>
<!-- LinkedIn -->
<div className="icon-card">
<div className="icon-display secondary-color">💼</div>
<div className="icon-name">LinkedIn</div>
<div className="icon-class">icon-linkedin</div>
</div>
<!-- Spotify -->
<div className="icon-card">
<div className="icon-display secondary-color">🎵</div>
<div className="icon-name">Spotify</div>
<div className="icon-class">icon-spotify</div>
</div>
<!-- YouTube -->
<div className="icon-card">
<div className="icon-display secondary-color">▶️</div>
<div className="icon-name">YouTube</div>
<div className="icon-class">icon-youtube</div>
</div>
</div>
</div>
    );
};

export default Icons;