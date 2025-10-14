import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const SpacingGrid = () => {
    return (
        <div className="slide-container">
<h1>Atoms: Spacing &amp; Grid</h1>
<p className="subtitle">Implementatie van het 8-punts spacing systeem en de 12-koloms grid structuur.</p>
<div className="content-grid">
<!-- Kolom 1: Spacing System -->
<div className="spacing-section">
<div className="section-title">8-Punts Spacing Systeem</div>
<div className="spacing-item">
<div className="spacing-label">Extra Small</div>
<div className="spacing-bar" style="width: 8px;"></div>
<div className="spacing-value">8px (0.5rem)</div>
</div>
<div className="spacing-item">
<div className="spacing-label">Small</div>
<div className="spacing-bar" style="width: 16px;"></div>
<div className="spacing-value">16px (1rem)</div>
</div>
<div className="spacing-item">
<div className="spacing-label">Medium</div>
<div className="spacing-bar" style="width: 24px;"></div>
<div className="spacing-value">24px (1.5rem)</div>
</div>
<div className="spacing-item">
<div className="spacing-label">Large</div>
<div className="spacing-bar" style="width: 32px;"></div>
<div className="spacing-value">32px (2rem)</div>
</div>
<div className="spacing-item">
<div className="spacing-label">Extra Large</div>
<div className="spacing-bar" style="width: 48px;"></div>
<div className="spacing-value">48px (3rem)</div>
</div>
<div className="spacing-item">
<div className="spacing-label">XXL</div>
<div className="spacing-bar" style="width: 64px;"></div>
<div className="spacing-value">64px (4rem)</div>
</div>
<div className="spacing-item">
<div className="spacing-label">Section</div>
<div className="spacing-bar" style="width: 96px;"></div>
<div className="spacing-value">96px (6rem)</div>
</div>
<div className="grid-specs" style="margin-top: 30px;">
<div>**Basis Eenheid:** 8px</div>
<div>**Regel:** Alle afstanden moeten een veelvoud van 8 zijn (8, 16, 24, 32, 40, 48, etc.).</div>
<div>**Voordeel:** Zorgt voor verticale ritme en visuele harmonie.</div>
</div>
</div>
<!-- Kolom 2: Grid System -->
<div className="grid-section">
<div className="section-title">12-Koloms Grid Systeem</div>
<div className="grid-visualization">
<div className="grid-column span-4">4 Kolommen</div>
<div className="grid-column span-8">8 Kolommen</div>
<div className="grid-column">1</div>
<div className="grid-column">1</div>
<div className="grid-column">1</div>
<div className="grid-column">1</div>
<div className="grid-column">1</div>
<div className="grid-column">1</div>
<div className="grid-column">1</div>
<div className="grid-column">1</div>
<div className="grid-column">1</div>
<div className="grid-column">1</div>
<div className="grid-column">1</div>
<div className="grid-column">1</div>
</div>
<div className="grid-specs">
<div>**Totaal Kolommen:** 12</div>
<div>**Gutter (Tussenruimte):** 16px (Small Spacing)</div>
<div>**Max Breedte:** 1440px (Desktop)</div>
<div>**Responsiviteit:** Schakelt over naar 4 kolommen op mobiel.</div>
</div>
</div>
</div>
</div>
    );
};

export default SpacingGrid;