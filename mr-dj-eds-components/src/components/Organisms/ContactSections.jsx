import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const ContactSections = () => {
    return (
        <div className="slide-container">
<h1>Organisms: Contact Sections</h1>
<p className="subtitle">Verschillende lay-outs voor contactpagina's en contactsecties in landingspagina's.</p>
<div className="contact-grid">
<!-- Kolom 1: Contact Form & Info -->
<div>
<div className="section-title">Lay-out 1: Formulier met Info Cards</div>
<div className="contact-form-placeholder">
                    Contact Formulier (zie Molecules: Forms)
                </div>
<div className="info-card-grid">
<div className="info-card">
<div className="info-card-title">Telefoon</div>
<div className="info-card-detail">+31 6 1234 5678</div>
<div className="info-card-detail">Ma-Vr: 09:00 - 17:00</div>
</div>
<div className="info-card">
<div className="info-card-title">E-mail</div>
<div className="info-card-detail">info@mrdj.nl</div>
<div className="info-card-detail">Antwoord binnen 24 uur</div>
</div>
</div>
</div>
<!-- Kolom 2: Map & CTA -->
<div>
<div className="section-title">Lay-out 2: Map met CTA</div>
<div className="map-placeholder">
                    Google Maps Integratie (Locatie kantoor/opslag)
                </div>
<div className="cta-box">
<div className="cta-title">Vraag Direct Beschikbaarheid Aan</div>
<p>Controleer of uw datum nog vrij is in onze agenda.</p>
<div className="cta-button">Check Beschikbaarheid</div>
</div>
<div className="map-placeholder" style="height: 150px; margin-top: 30px; background: #F8FCFF; border: 2px dashed #D4AF37;">
                    Social Media Links (zie Atoms: Icons)
                </div>
</div>
</div>
</div>
    );
};

export default ContactSections;