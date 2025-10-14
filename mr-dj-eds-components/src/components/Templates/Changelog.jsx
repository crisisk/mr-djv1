import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const Changelog = () => {
    return (
        <div className="slide-container">
<h1>Changelog &amp; Version History</h1>
<p className="subtitle">Overzicht van alle wijzigingen, updates en nieuwe componenten in het Enterprise Design System.</p>
<div className="changelog-grid">
<!-- Kolom 1: Versie 1.0.0 -->
<div className="version-box">
<div className="version-header">
<div className="version-number">v1.0.0 (Huidig)</div>
<div className="version-date">15 Oktober 2025</div>
</div>
<ul className="update-list">
<li><span className="update-type type-feat">FEAT</span> Eerste release van het complete Enterprise Design System.</li>
<li><span className="update-type type-feat">FEAT</span> Alle 31 kernslides en componenten gedefinieerd.</li>
<li><span className="update-type type-feat">FEAT</span> Introductie van professionele SVG-iconen voor diensten.</li>
<li><span className="update-type type-feat">FEAT</span> Implementatie van 8-punts spacing en 12-koloms grid.</li>
<li><span className="update-type type-docs">DOCS</span> Volledige documentatie voor Color, Typography en Buttons.</li>
<li><span className="update-type type-fix">FIX</span> Contrastproblemen in Primary Blue opgelost (alleen als achtergrond).</li>
</ul>
</div>
<!-- Kolom 2: Toekomstige Versies -->
<div className="version-box" style="opacity: 0.7;">
<div className="version-header">
<div className="version-number">v1.1.0 (Toekomst)</div>
<div className="version-date">Q4 2025</div>
</div>
<ul className="update-list">
<li><span className="update-type type-feat">FEAT</span> Nieuwe component: Accordion/FAQ.</li>
<li><span className="update-type type-feat">FEAT</span> Integratie met Figma Design Tokens.</li>
<li><span className="update-type type-docs">DOCS</span> Storybook integratie voor alle Organisms.</li>
<li><span className="update-type type-fix">FIX</span> Bugfix in mobiele navigatie.</li>
</ul>
</div>
<div className="version-box" style="opacity: 0.5;">
<div className="version-header">
<div className="version-number">v2.0.0 (Major)</div>
<div className="version-date">Q1 2026</div>
</div>
<ul className="update-list">
<li><span className="update-type type-feat">FEAT</span> Dark Mode Support.</li>
<li><span className="update-type type-feat">FEAT</span> Nieuwe Template: Checkout Flow.</li>
<li><span className="update-type type-docs">DOCS</span> Volledige migratie naar TypeScript.</li>
</ul>
</div>
</div>
</div>
    );
};

export default Changelog;