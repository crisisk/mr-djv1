import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const Inputs = () => {
    return (
        <div className="slide-container">
<h1>Atoms: Form Inputs</h1>
<p className="subtitle">Definitie van alle input types en hun verschillende statussen (Default, Focus, Error, Disabled)</p>
<div className="inputs-grid">
<!-- Kolom 1: Text & States -->
<div className="input-group">
<div className="input-title">Text Inputs &amp; States</div>
<div>
<label className="input-label">Default State</label>
<input className="input-field" placeholder="Voer uw naam in" type="text"/>
</div>
<div>
<label className="input-label">Focus State</label>
<input className="input-field" style="border-color: #00AEEF; box-shadow: 0 0 0 3px rgba(0, 174, 239, 0.2);" type="text" value="In Focus"/>
</div>
<div>
<label className="input-label">Error State</label>
<input className="input-field error" placeholder="Voer uw e-mailadres in" type="email" value="ongeldig@email"/>
<p className="error-text">Dit e-mailadres is ongeldig.</p>
</div>
<div>
<label className="input-label">Disabled State</label>
<input className="input-field disabled" disabled="" type="text" value="Niet bewerkbaar"/>
</div>
<div>
<label className="input-label">Textarea</label>
<textarea className="input-field textarea-field" placeholder="Uw bericht..."></textarea>
</div>
</div>
<!-- Kolom 2: Input Types -->
<div className="input-group">
<div className="input-title">Diverse Input Types</div>
<div>
<label className="input-label">Number Input</label>
<input className="input-field" max="100" min="1" type="number" value="10"/>
</div>
<div>
<label className="input-label">Date Input</label>
<input className="input-field" type="date"/>
</div>
<div>
<label className="input-label">Time Input</label>
<input className="input-field" type="time"/>
</div>
<div>
<label className="input-label">Select Dropdown</label>
<select className="input-field">
<option>Bruiloft DJ</option>
<option>Bedrijfsfeest DJ</option>
<option>Private Feesten</option>
</select>
</div>
<div>
<label className="input-label">File Upload</label>
<input className="input-field p-2" type="file"/>
</div>
</div>
<!-- Kolom 3: Options & Toggles -->
<div className="input-group">
<div className="input-title">Checkboxes, Radio &amp; Toggles</div>
<div className="option-group">
<label className="input-label">Checkboxes</label>
<div className="option-item">
<input checked="" id="check1" type="checkbox"/>
<label for="check1">Optie 1 (Geselecteerd)</label>
</div>
<div className="option-item">
<input id="check2" type="checkbox"/>
<label for="check2">Optie 2</label>
</div>
</div>
<div className="option-group">
<label className="input-label">Radio Buttons</label>
<div className="option-item">
<input checked="" id="radio1" name="radio-group" type="radio"/>
<label for="radio1">Keuze A (Geselecteerd)</label>
</div>
<div className="option-item">
<input id="radio2" name="radio-group" type="radio"/>
<label for="radio2">Keuze B</label>
</div>
</div>
<div className="option-group">
<label className="input-label">Toggle Switch</label>
<div className="option-item">
<label className="toggle-switch">
<input checked="" type="checkbox"/>
<span className="slider"></span>
</label>
<label>Toggle Aan</label>
</div>
<div className="option-item">
<label className="toggle-switch">
<input type="checkbox"/>
<span className="slider"></span>
</label>
<label>Toggle Uit</label>
</div>
</div>
</div>
</div>
</div>
    );
};

export default Inputs;