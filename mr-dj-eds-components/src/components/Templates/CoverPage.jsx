import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const CoverPage = () => {
    return (
        <div className="slide-container">
<!-- Decorative shapes -->
<div className="shape shape-1"></div>
<div className="shape shape-2"></div>
<div className="shape shape-3"></div>
<!-- Left: Logo -->
<div className="logo-section">
<div className="logo-container">
<img alt="Mr. DJ Logo" src="mr_dj_logo.png"/>
</div>
</div>
<!-- Right: Title -->
<div className="title-section">
<h1>
<span className="highlight">Enterprise</span><br/>
                Design System
            </h1>
<h2>Component Library &amp; Design Tokens</h2>
<p className="subtitle">
                Een complete, schaalbare design system voor consistente en hoogwaardige gebruikerservaringen across alle Mr. DJ platforms.
            </p>
<div className="meta-info">
<div className="version">v1.0.0</div>
<div className="component-count">
<span>50+</span>
                    Componenten
                </div>
</div>
</div>
</div>
    );
};

export default CoverPage;