import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const IntroPage = () => {
    return (
        <div className="slide-container">
<h1>Introductie: Wat is het Enterprise Design System (EDS)?</h1>
<p className="subtitle">Het doel, de scope en de voordelen van een uniform design systeem voor Mr. DJ.</p>
<div className="content-grid">
<div>
<p className="main-text">Het **Enterprise Design System (EDS)** is de centrale bron van waarheid voor alle design- en developmentbeslissingen binnen Mr. DJ. Het is een verzameling van herbruikbare componenten, duidelijke richtlijnen en best practices die zorgen voor een consistente, schaalbare en efficiënte digitale ervaring.</p>
<div className="key-benefits">
<div className="benefit-card">
<div className="benefit-title">1. Consistente Merkbeleving</div>
<div className="benefit-text">Elke pagina, van de homepage tot de 404-pagina, voelt en ziet eruit als Mr. DJ.</div>
</div>
<div className="benefit-card" style="border-left-color: #D4AF37;">
<div className="benefit-title">2. Snellere Development</div>
<div className="benefit-text">Door herbruikbare componenten te gebruiken, wordt de ontwikkeltijd met 30-50% verkort.</div>
</div>
<div className="benefit-card">
<div className="benefit-title">3. Hogere Kwaliteit &amp; Toegankelijkheid</div>
<div className="benefit-text">Componenten zijn vooraf getest op toegankelijkheid (WCAG) en prestaties.</div>
</div>
</div>
</div>
<div className="design-system-image">
<p>Atomic Design Principes: Atoms, Molecules, Organisms, Templates</p>
</div>
</div>
</div>
    );
};

export default IntroPage;