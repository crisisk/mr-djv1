import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const Navigation = () => {
    return (
        <div className="slide-container">
<h1>Molecules: Navigation</h1>
<p className="subtitle">Complete navigatie systeem voor desktop, mobile en footer met sticky behavior</p>
<div className="nav-examples">
<!-- Desktop Header -->
<div className="nav-section">
<div className="nav-label">Desktop Header (Sticky)</div>
<div className="header-desktop">
<div className="header-logo">
<div className="logo-icon">🎵</div>
<div className="logo-text">MR DJ</div>
</div>
<div className="header-nav">
<div className="nav-link active">Home</div>
<div className="nav-link">Diensten</div>
<div className="nav-link">Pakketten</div>
<div className="nav-link">Reviews</div>
<div className="nav-link">Contact</div>
<div className="header-cta">Direct Boeken</div>
</div>
</div>
</div>
<!-- Mobile Header -->
<div className="nav-section">
<div className="nav-label">Mobile Header (Hamburger Menu)</div>
<div className="header-mobile">
<div className="mobile-logo">
<div className="mobile-logo-icon">🎵</div>
<div className="mobile-logo-text">MR DJ</div>
</div>
<div className="hamburger-menu">
<div className="hamburger-line"></div>
<div className="hamburger-line"></div>
<div className="hamburger-line"></div>
</div>
</div>
</div>
<!-- Breadcrumbs -->
<div className="nav-section">
<div className="nav-label">Breadcrumbs Navigation</div>
<div className="breadcrumbs-container">
<div className="breadcrumbs">
<div className="breadcrumb-item">Home</div>
<div className="breadcrumb-separator">›</div>
<div className="breadcrumb-item">Diensten</div>
<div className="breadcrumb-separator">›</div>
<div className="breadcrumb-item active">Bruiloft DJ</div>
</div>
</div>
</div>
<!-- Footer Navigation -->
<div className="nav-section">
<div className="nav-label">Footer Navigation (4-Column)</div>
<div className="footer-nav">
<div className="footer-column">
<div className="footer-title">Diensten</div>
<div className="footer-link">Bruiloft DJ</div>
<div className="footer-link">Bedrijfsfeest DJ</div>
<div className="footer-link">DJ + Saxofonist</div>
<div className="footer-link">Alle Diensten</div>
</div>
<div className="footer-column">
<div className="footer-title">Informatie</div>
<div className="footer-link">Over Mij</div>
<div className="footer-link">Reviews</div>
<div className="footer-link">Veelgestelde Vragen</div>
<div className="footer-link">Blog</div>
</div>
<div className="footer-column">
<div className="footer-title">Contact</div>
<div className="footer-link">Vraag Offerte Aan</div>
<div className="footer-link">Beschikbaarheid</div>
<div className="footer-link">Contactformulier</div>
<div className="footer-link">+31 6 12345678</div>
</div>
<div className="footer-column">
<div className="footer-title">Volg Ons</div>
<div className="footer-social">
<div className="social-icon">📘</div>
<div className="social-icon">📷</div>
<div className="social-icon">🎵</div>
<div className="social-icon">💼</div>
</div>
<div className="footer-link" style="margin-top: 10px;">Algemene Voorwaarden</div>
<div className="footer-link">Privacy Policy</div>
</div>
</div>
</div>
</div>
</div>
    );
};

export default Navigation;