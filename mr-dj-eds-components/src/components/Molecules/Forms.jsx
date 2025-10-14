import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const Forms = () => {
    return (
        <div className="slide-container">
<h1>Molecules: Forms</h1>
<p className="subtitle">Gestandaardiseerde formulieren voor contact, offerte aanvraag en intakegesprekken</p>
<div className="forms-grid">
<!-- Offerte Aanvraag Formulier -->
<div className="form-card">
<div className="form-type-badge primary">Offerte Aanvraag</div>
<div className="form-title">Vraag een Vrijblijvende Offerte Aan</div>
<div className="input-group">
<label className="input-label" for="name-offerte">Volledige Naam *</label>
<input className="input-field" id="name-offerte" placeholder="Jan Jansen" type="text"/>
</div>
<div className="input-group">
<label className="input-label" for="email-offerte">E-mailadres *</label>
<input className="input-field error" id="email-offerte" placeholder="jan.jansen@voorbeeld.nl" type="email"/>
<div className="error-message">Dit e-mailadres is ongeldig.</div>
</div>
<div className="input-group">
<label className="input-label" for="phone-offerte">Telefoonnummer</label>
<input className="input-field" id="phone-offerte" placeholder="+31 6 12345678" type="tel"/>
</div>
<div className="input-group">
<label className="input-label" for="event-type">Type Evenement *</label>
<select className="input-field" id="event-type">
<option>Kies een optie</option>
<option>Bruiloft</option>
<option>Bedrijfsfeest</option>
<option>Private Feest</option>
</select>
</div>
<div className="input-group">
<label className="input-label" for="date-offerte">Datum Evenement *</label>
<input className="input-field" id="date-offerte" type="date"/>
</div>
<div className="input-group">
<label className="input-label" for="message-offerte">Extra Opmerkingen</label>
<textarea className="input-field textarea-field" id="message-offerte" placeholder="Vertel ons meer over uw wensen..."></textarea>
</div>
<div className="checkbox-group">
<input id="privacy-offerte" type="checkbox"/>
<label for="privacy-offerte">Ik ga akkoord met de <a className="text-blue-500 underline" href="#">privacyverklaring</a> *</label>
</div>
<div className="submit-button">Offerte Aanvragen</div>
</div>
<!-- Muziekvoorkeuren Formulier (Intake) -->
<div className="form-card">
<div className="form-type-badge secondary">Intake Formulier</div>
<div className="form-title">Muziekvoorkeuren &amp; Planning</div>
<div className="form-subtitle">Dit formulier wordt gebruikt na boeking voor een perfecte match.</div>
<div className="input-group">
<label className="input-label" for="first-dance">Eerste Dans Nummer</label>
<input className="input-field" id="first-dance" placeholder="Artiest - Titel" type="text"/>
</div>
<div className="input-group">
<label className="input-label" for="must-play">Must-Play Nummers (Max 10)</label>
<textarea className="input-field textarea-field" id="must-play" placeholder="Lijst van nummers, één per regel"></textarea>
</div>
<div className="input-group">
<label className="input-label" for="do-not-play">Do-Not-Play Lijst</label>
<textarea className="input-field textarea-field" id="do-not-play" placeholder="Muziek die absoluut niet gedraaid mag worden"></textarea>
</div>
<div className="input-group">
<label className="input-label" for="genres">Voorkeursgenres (Meerdere selecties mogelijk)</label>
<select className="input-field" id="genres" multiple="" size="5">
<option>Jaren '80 &amp; '90</option>
<option>Top 40 / Pop</option>
<option>House / Dance</option>
<option>R&amp;B / Hip-Hop</option>
<option>Latin / Salsa</option>
<option>Rock / Indie</option>
</select>
</div>
<div className="input-group">
<label className="input-label" for="vibe">Gewenste Sfeer</label>
<input className="input-field" id="vibe" placeholder="Bijv. 'Chille lounge tijdens receptie, knallend feest na 22:00'" type="text"/>
</div>
<div className="submit-button" style="background: #1A2C4B;">Voorkeuren Opslaan</div>
</div>
<div className="form-specs">
<div className="form-specs-title">Formulier Specificaties</div>
<div className="spec-list">
<div className="spec-item"><span className="spec-label">Input Hoogte:</span> <span className="spec-value">44px</span></div>
<div className="spec-item"><span className="spec-label">Border Radius:</span> <span className="spec-value">8px</span></div>
<div className="spec-item"><span className="spec-label">Focus State:</span> <span className="spec-value">Primary Blue Shadow</span></div>
<div className="spec-item"><span className="spec-label">Error State:</span> <span className="spec-value">Red Border</span></div>
</div>
</div>
</div>
</div>
    );
};

export default Forms;