import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const ColorSystem = () => {
    return (
        <div className="slide-container">
<h1>Atoms: Color System</h1>
<p className="subtitle">Het officiële kleurenpalet van het Enterprise Design System, inclusief primaire, secundaire en functionele kleuren.</p>
<div className="color-grid">
<!-- Kolom 1: Primary & Secondary -->
<div className="color-group">
<div className="color-title">Merk Kleuren</div>
<div className="color-swatch">
<div className="color-box bg-primary text-white">Primary Blue</div>
<div className="color-info">
<div className="color-name">Primary Blue</div>
<div>HEX: #00AEEF</div>
<div>Gebruik: CTA's, Hoogtepunten, Iconen</div>
</div>
</div>
<div className="color-swatch">
<div className="color-box bg-secondary text-dark" style="color: #1A2C4B;">Secondary Gold</div>
<div className="color-info">
<div className="color-name">Secondary Gold</div>
<div>HEX: #D4AF37</div>
<div>Gebruik: Featured Items, Accent, Ratings</div>
</div>
</div>
<div className="color-swatch">
<div className="color-box bg-dark text-white">Dark Blue</div>
<div className="color-info">
<div className="color-name">Dark Blue</div>
<div>HEX: #1A2C4B</div>
<div>Gebruik: Tekst, Achtergronden, Headers</div>
</div>
</div>
</div>
<!-- Kolom 2: Neutrals -->
<div className="color-group">
<div className="color-title">Neutrale Kleuren</div>
<div className="color-swatch">
<div className="color-box bg-white" style="color: #1A2C4B;">White</div>
<div className="color-info">
<div className="color-name">White</div>
<div>HEX: #FFFFFF</div>
<div>Gebruik: Achtergronden, Kaarten, Tekst</div>
</div>
</div>
<div className="color-swatch">
<div className="color-box bg-light" style="color: #1A2C4B;">Light Background</div>
<div className="color-info">
<div className="color-name">Light Background</div>
<div>HEX: #F8FCFF</div>
<div>Gebruik: Sectie Achtergronden, Formuliervelden</div>
</div>
</div>
<div className="color-swatch">
<div className="color-box bg-neutral" style="color: #1A2C4B;">Border/Divider</div>
<div className="color-info">
<div className="color-name">Border/Divider</div>
<div>HEX: #E5E5E5</div>
<div>Gebruik: Lijnen, Borders, Scheidingen</div>
</div>
</div>
</div>
<!-- Kolom 3: Functional & System -->
<div className="color-group">
<div className="color-title">Functionele Kleuren</div>
<div className="color-swatch">
<div className="color-box bg-success text-white">Success</div>
<div className="color-info">
<div className="color-name">Success</div>
<div>HEX: #4CAF50</div>
<div>Gebruik: Bevestigingen, Positieve Feedback</div>
</div>
</div>
<div className="color-swatch">
<div className="color-box bg-error text-white">Error</div>
<div className="color-info">
<div className="color-name">Error</div>
<div>HEX: #FF4D4D</div>
<div>Gebruik: Foutmeldingen, Negatieve Feedback</div>
</div>
</div>
<div className="color-swatch">
<div className="color-box" style="background-color: #FFC107; color: #1A2C4B;">Warning</div>
<div className="color-info">
<div className="color-name">Warning</div>
<div>HEX: #FFC107</div>
<div>Gebruik: Waarschuwingen, Belangrijke Notificaties</div>
</div>
</div>
</div>
</div>
</div>
    );
};

export default ColorSystem;