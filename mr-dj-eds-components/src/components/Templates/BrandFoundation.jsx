import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const BrandFoundation = () => {
    return (
        <div className="slide-container">
<h1>Brand Foundation</h1>
<p className="subtitle">Design Tokens: Colors, Typography &amp; Spacing</p>
<div className="content-grid">
<!-- Colors Section -->
<div className="section">
<h2 className="section-title">Colors</h2>
<div className="color-swatch">
<div className="color-item">
<div className="color-box" style="background: #1A2C4B;"></div>
<div className="color-info">
<div className="color-name">Deep Navy</div>
<div className="color-code">#1A2C4B</div>
</div>
</div>
<div className="color-item">
<div className="color-box" style="background: #00AEEF;"></div>
<div className="color-info">
<div className="color-name">Bright Blue</div>
<div className="color-code">#00AEEF</div>
</div>
</div>
<div className="color-item">
<div className="color-box" style="background: #D4AF37;"></div>
<div className="color-info">
<div className="color-name">Gold</div>
<div className="color-code">#D4AF37</div>
</div>
</div>
<div className="color-item">
<div className="color-box" style="background: #FFFFFF; border: 2px solid #E5E5E5;"></div>
<div className="color-info">
<div className="color-name">White</div>
<div className="color-code">#FFFFFF</div>
</div>
</div>
</div>
</div>
<!-- Typography Section -->
<div className="section">
<h2 className="section-title">Typography</h2>
<div className="type-specimen">
<div className="type-item">
<div className="type-label">Heading 1</div>
<div className="type-example type-h1">Montserrat Bold</div>
</div>
<div className="type-item">
<div className="type-label">Heading 2</div>
<div className="type-example type-h2">Montserrat SemiBold</div>
</div>
<div className="type-item">
<div className="type-label">Body Text</div>
<div className="type-example type-body">Montserrat Regular</div>
</div>
<div className="type-item">
<div className="type-label">Caption</div>
<div className="type-example type-caption">Montserrat Regular</div>
</div>
</div>
</div>
<!-- Spacing Section -->
<div className="section">
<h2 className="section-title">Spacing</h2>
<div className="spacing-scale">
<div className="spacing-item">
<div className="spacing-visual" style="width: 64px; height: 8px;"></div>
<div className="spacing-label">
<span className="spacing-name">XXL</span>
<span className="spacing-value">64px</span>
</div>
</div>
<div className="spacing-item">
<div className="spacing-visual" style="width: 48px; height: 8px;"></div>
<div className="spacing-label">
<span className="spacing-name">XL</span>
<span className="spacing-value">48px</span>
</div>
</div>
<div className="spacing-item">
<div className="spacing-visual" style="width: 32px; height: 8px;"></div>
<div className="spacing-label">
<span className="spacing-name">L</span>
<span className="spacing-value">32px</span>
</div>
</div>
<div className="spacing-item">
<div className="spacing-visual" style="width: 24px; height: 8px;"></div>
<div className="spacing-label">
<span className="spacing-name">M</span>
<span className="spacing-value">24px</span>
</div>
</div>
<div className="spacing-item">
<div className="spacing-visual" style="width: 16px; height: 8px;"></div>
<div className="spacing-label">
<span className="spacing-name">S</span>
<span className="spacing-value">16px</span>
</div>
</div>
<div className="spacing-item">
<div className="spacing-visual" style="width: 8px; height: 8px;"></div>
<div className="spacing-label">
<span className="spacing-name">XS</span>
<span className="spacing-value">8px</span>
</div>
</div>
</div>
<div className="base-unit">
<p className="base-unit-text"><strong>Base Unit:</strong> 8px<br/>All spacing follows 8px increments</p>
</div>
</div>
</div>
</div>
    );
};

export default BrandFoundation;