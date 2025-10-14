import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const Animations = () => {
    return (
        <div className="slide-container">
<h1>Components: Animations &amp; Transitions</h1>
<p className="subtitle">Richtlijnen voor micro-interacties, hover-states en paginatransities om de gebruikerservaring te verbeteren.</p>
<div className="content-grid">
<div>
<div className="section-title">Standaard Animatie Specificaties</div>
<div className="animation-example">
<div className="example-box">Hover State</div>
<div className="animation-spec">**Duur:** 300ms (Standaard)</div>
<div className="animation-spec">**Timing:** `cubic-bezier(0.4, 0, 0.2, 1)` (Ease-in-out)</div>
<div className="animation-spec">**Effect:** Scale (1.05 of 1.1) of Color Change</div>
</div>
<div className="animation-example">
<div className="example-box" style="background: #00AEEF; color: white;">Loading State</div>
<div className="animation-spec">**Effect:** Subtiele puls of shimmer effect.</div>
<div className="animation-spec">**Doel:** Gebruiker informeren dat er data wordt geladen.</div>
</div>
<div className="animation-example">
<div className="example-box" style="background: #4CAF50; color: white;">Success Feedback</div>
<div className="animation-spec">**Effect:** Snelle fade-in/out (150ms).</div>
<div className="animation-spec">**Doel:** Directe visuele bevestiging van een actie.</div>
</div>
</div>
<div>
<div className="section-title">Best Practices &amp; Richtlijnen</div>
<ul className="guidelines-list">
<li>**Performance First:** Gebruik alleen `transform` en `opacity` voor animaties om de GPU te benutten.</li>
<li>**Minimalisme:** Animatie moet functioneel zijn, niet afleiden. Gebruik ze spaarzaam.</li>
<li>**Consistentie:** Houd de standaardduur van **300ms** aan voor de meeste interacties.</li>
<li>**Motion Sickness:** Vermijd snelle, schokkende of overmatige bewegingen.</li>
<li>**Reduced Motion:** Respecteer de voorkeur van de gebruiker voor gereduceerde beweging (via CSS media query).</li>
<li>**Eenvoudige Overgangen:** Gebruik de standaard `ease-in-out` curve voor een professionele, vloeiende look.</li>
</ul>
</div>
</div>
</div>
    );
};

export default Animations;