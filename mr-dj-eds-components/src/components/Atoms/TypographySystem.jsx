import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const TypographySystem = () => {
    return (
        <div className="slide-container">
<h1>Atoms: Typography System</h1>
<p className="subtitle">Definitie van lettertype, hiërarchie, groottes en gewichten voor alle tekstelementen.</p>
<div className="typography-grid">
<!-- Kolom 1: Headings & Body -->
<div>
<div className="font-spec">
<div className="font-example h1-style">H1 - De Perfecte Mix</div>
<div className="font-details"><span>48px</span> / Extra Bold (900) / Page Title</div>
</div>
<div className="font-spec">
<div className="font-example h2-style">H2 - Onze Diensten</div>
<div className="font-details"><span>36px</span> / Bold (800) / Section Title</div>
</div>
<div className="font-spec">
<div className="font-example h3-style">H3 - Bruiloft DJ</div>
<div className="font-details"><span>28px</span> / Bold (800) / Sub-Section Title</div>
</div>
<div className="font-spec">
<div className="font-example h4-style">H4 - Pakket Details</div>
<div className="font-details"><span>20px</span> / Semi-Bold (700) / Card Title</div>
</div>
<div className="font-spec">
<div className="font-example h5-style">H5 - Belangrijke Informatie</div>
<div className="font-details"><span>16px</span> / Semi-Bold (700) / Widget Title</div>
</div>
<div className="font-spec">
<div className="font-example body-large-style">Body Large - Dit is de grote body tekst voor de introductie van een pagina.</div>
<div className="font-details"><span>18px</span> / Regular (400) / Lead Paragraph</div>
</div>
<div className="font-spec">
<div className="font-example body-style">Body - Dit is de standaard body tekst voor paragrafen, lijsten en algemene content.</div>
<div className="font-details"><span>16px</span> / Regular (400) / Standard Paragraph</div>
</div>
</div>
<!-- Kolom 2: Usage & Caption -->
<div>
<div className="font-spec">
<div className="font-example caption-style">Caption - Call to Action Label</div>
<div className="font-details"><span>12px</span> / Semi-Bold (600) / Uppercase / Labels &amp; Metadata</div>
</div>
<div className="usage-box">
<div className="usage-title">Font Family</div>
<div className="font-example h3-style" style="margin-bottom: 10px;">Montserrat</div>
<div className="font-details"><span>Primary Font:</span> Montserrat (Google Fonts)</div>
<div className="font-details"><span>Fallback:</span> sans-serif</div>
</div>
<div className="usage-box" style="margin-top: 20px; border-color: #D4AF37;">
<div className="usage-title" style="color: #D4AF37;">Best Practices</div>
<ul className="usage-list">
<li>Gebruik maximaal één H1 per pagina.</li>
<li>Zorg voor een logische hiërarchie (H1 → H2 → H3).</li>
<li>Gebruik **Bold** (700+) voor nadruk, niet voor hele zinnen.</li>
<li>Lijnhoogte (Line Height) moet 1.2 voor headings en 1.6 voor body tekst zijn.</li>
<li>De standaard tekstkleur is Dark Blue (#1A2C4B) voor optimale leesbaarheid.</li>
</ul>
</div>
</div>
</div>
</div>
    );
};

export default TypographySystem;