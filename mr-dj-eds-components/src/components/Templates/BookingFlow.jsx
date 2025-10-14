import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const BookingFlow = () => {
    return (
        <div className="slide-container">
<h1>Templates: Booking Flow</h1>
<p className="subtitle">Multi-step proces voor het controleren van beschikbaarheid, selecteren van pakketten en boeken</p>
<div className="booking-flow">
<div className="main-content">
<div className="step-indicator">
<div className="step completed">
<div className="step-number">✓</div>
<div className="step-title">Datum &amp; Locatie</div>
</div>
<div className="step active">
<div className="step-number">2</div>
<div className="step-title">Pakket Selectie</div>
</div>
<div className="step">
<div className="step-number">3</div>
<div className="step-title">Extra Opties</div>
</div>
<div className="step">
<div className="step-number">4</div>
<div className="step-title">Gegevens &amp; Betaling</div>
</div>
</div>
<div className="calendar-placeholder">
                    Beschikbaarheidskalender &amp; Locatie Input
                </div>
<div className="summary-box">
<div className="summary-title">Huidige Selectie (Stap 1)</div>
<div className="summary-item"><span>Datum:</span> <span>Zaterdag 12 Oktober 2026</span></div>
<div className="summary-item"><span>Locatie:</span> <span>Eindhoven, Noord-Brabant</span></div>
<div className="summary-item"><span>Type Evenement:</span> <span>Bruiloft</span></div>
</div>
</div>
<div className="sidebar">
<div className="summary-box">
<div className="summary-title">Boekingsoverzicht</div>
<div className="summary-item"><span>Geselecteerd Pakket:</span> <span>Zilver (Silver)</span></div>
<div className="summary-item"><span>Basisprijs:</span> <span>€ 795,-</span></div>
<div className="summary-item"><span>Reiskosten (Eindhoven):</span> <span>€ 0,-</span></div>
<div className="summary-item" style="color: #FF4D4D;"><span>Korting (Vroege Vogel):</span> <span>- € 50,-</span></div>
<div className="summary-total summary-item"><span>Totaal Prijs:</span> <span>€ 745,-</span></div>
</div>
<div className="summary-box">
<div className="summary-title">Volgende Stap</div>
<div className="button-primary">Ga Verder naar Extra Opties</div>
</div>
<div className="summary-box" style="border: 1px solid #00AEEF; background: #E6F9FF;">
<div className="summary-title" style="border-bottom: 2px solid #00AEEF;">Contact &amp; Hulp</div>
<p style="font-size: 14px;">Heeft u hulp nodig bij het boeken? Neem contact op met onze planningsexperts.</p>
<div className="button-primary" style="background: #1A2C4B;">Bel Ons Direct</div>
</div>
</div>
</div>
</div>
    );
};

export default BookingFlow;