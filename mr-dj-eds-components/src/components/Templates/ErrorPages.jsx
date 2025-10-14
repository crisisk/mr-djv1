import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const ErrorPages = () => {
    return (
        <div className="slide-container">
<h1>Templates: Error Pages</h1>
<p className="subtitle">Gestandaardiseerde templates voor de 404 (Not Found) en 500 (Server Error) pagina's.</p>
<div className="error-grid">
<!-- Kolom 1: 404 Not Found -->
<div className="error-box">
<div className="error-code">404</div>
<div className="error-title">Pagina Niet Gevonden</div>
<div className="error-message">Oeps! De pagina die u zoekt is verhuisd of bestaat niet meer.</div>
<a className="error-cta" href="#">Terug naar de Homepage</a>
</div>
<!-- Kolom 2: 500 Server Error -->
<div className="error-box server-error">
<div className="error-code">500</div>
<div className="error-title">Interne Server Fout</div>
<div className="error-message">Er is een onverwachte fout opgetreden. Onze technici zijn op de hoogte.</div>
<a className="error-cta" href="#">Probeer het Later Opnieuw</a>
</div>
</div>
</div>
    );
};

export default ErrorPages;