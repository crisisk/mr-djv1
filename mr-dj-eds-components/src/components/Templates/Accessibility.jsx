import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const Accessibility = () => {
    return (
        <div className="slide-container">
<h1>Components: Accessibility Features (A11y)</h1>
<p className="subtitle">Zorgen voor WCAG 2.1 AA-conformiteit: focus op contrast, toetsenbordnavigatie en screenreader-ondersteuning.</p>
<div className="content-grid">
<div>
<div className="section-title">Kernpunten Checklist (WCAG 2.1 AA)</div>
<div className="checklist-item">
<div className="checklist-icon">✓</div>
                    Toetsenbordnavigatie (Tab-volgorde, Focus States)
                </div>
<div className="checklist-item">
<div className="checklist-icon">✓</div>
                    Voldoende Kleurcontrast (Minimaal 4.5:1)
                </div>
<div className="checklist-item">
<div className="checklist-icon">✓</div>
                    Semantische HTML &amp; ARIA-labels
                </div>
<div className="checklist-item">
<div className="checklist-icon">✓</div>
                    Alternatieve Tekst voor Afbeeldingen (`alt` tags)
                </div>
<div className="checklist-item">
<div className="checklist-icon">✓</div>
                    Duidelijke Focus States voor Interactieve Elementen
                </div>
<div className="checklist-item">
<div className="checklist-icon">✓</div>
                    Responsief Ontwerp (Geen horizontale scroll op mobiel)
                </div>
</div>
<div>
<div className="section-title">Contrast &amp; Kleurgebruik</div>
<div className="contrast-example">
<div className="contrast-swatch" style="background: #1A2C4B; color: white;">Dark Blue op Wit (15.5:1) - PASS</div>
<div className="contrast-swatch" style="background: #00AEEF; color: white;">Primary Blue op Wit (3.5:1) - FAIL</div>
</div>
<div className="contrast-example">
<div className="contrast-swatch" style="background: #D4AF37; color: #1A2C4B;">Secondary Gold op Dark Blue (8.2:1) - PASS</div>
<div className="contrast-swatch" style="background: #D4AF37; color: white;">Secondary Gold op Wit (1.8:1) - FAIL</div>
</div>
<div className="guidelines-box" style="margin-top: 20px;">
<div className="section-title" style="border-bottom: none; margin-bottom: 10px; color: #1A2C4B;">Actiepunten</div>
<ul>
<li>**Primary Blue** mag niet als tekstkleur op een witte achtergrond worden gebruikt.</li>
<li>Gebruik **Dark Blue** als primaire tekstkleur.</li>
<li>Zorg ervoor dat alle componenten (Buttons, Forms) de juiste contrastverhoudingen behouden in alle statussen.</li>
</ul>
</div>
</div>
</div>
</div>
    );
};

export default Accessibility;