import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const Performance = () => {
    return (
        <div className="slide-container">
<h1>Components: Performance Optimization</h1>
<p className="subtitle">Richtlijnen voor het behalen van optimale Core Web Vitals scores en een snelle gebruikerservaring.</p>
<div className="content-grid">
<div>
<div className="section-title">Core Web Vitals Doelstellingen</div>
<div className="metric-card">
<div className="metric-title">Largest Contentful Paint (LCP)</div>
<div className="metric-target">Doel: &lt; 2.5 seconden</div>
<p className="metric-target" style="color: #666; font-weight: 400;">Meet de laadtijd van het grootste zichtbare element.</p>
</div>
<div className="metric-card">
<div className="metric-title">First Input Delay (FID) / INP</div>
<div className="metric-target">Doel: &lt; 100 milliseconden</div>
<p className="metric-target" style="color: #666; font-weight: 400;">Meet de reactietijd op de eerste gebruikersinteractie.</p>
</div>
<div className="metric-card">
<div className="metric-title">Cumulative Layout Shift (CLS)</div>
<div className="metric-target">Doel: &lt; 0.1</div>
<p className="metric-target" style="color: #666; font-weight: 400;">Meet de visuele stabiliteit van de pagina.</p>
</div>
</div>
<div>
<div className="section-title">Optimalisatie Strategieën</div>
<ul className="optimization-list">
<li>**Afbeeldingen:** Gebruik moderne formaten (WebP, AVIF) en lazy loading voor off-screen beelden.</li>
<li>**Fonts:** Preload kritieke fonts (`Montserrat`) en gebruik `font-display: swap`.</li>
<li>**CSS/JS:** Minimaliseer en bundel assets. Gebruik tree-shaking en code splitting.</li>
<li>**Componenten:** Zorg voor minimale render-tijd. Vermijd zware JavaScript-frameworks waar mogelijk.</li>
<li>**Caching:** Implementeer sterke caching-headers voor statische assets.</li>
<li>**Server:** Gebruik een snelle CDN (zoals Netlify) voor wereldwijde distributie.</li>
<li>**CLS:** Reserveer ruimte voor afbeeldingen en embeds om layout shifts te voorkomen.</li>
</ul>
</div>
</div>
</div>
    );
};

export default Performance;