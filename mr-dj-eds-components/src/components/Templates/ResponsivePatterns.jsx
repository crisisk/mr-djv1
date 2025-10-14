import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const ResponsivePatterns = () => {
    return (
        <div className="slide-container">
<h1>Components: Responsive Patterns</h1>
<p className="subtitle">Breakpoints, responsive behavior en mobile-first design richtlijnen voor alle devices</p>
<div className="content-grid">
<!-- Breakpoints Section -->
<div className="breakpoints-section">
<div className="section-title">
<span>📱</span>
<span>Responsive Breakpoints</span>
</div>
<!-- Mobile -->
<div className="breakpoint-card">
<div className="breakpoint-header">
<div className="breakpoint-name">
<span className="breakpoint-icon">📱</span>
<span className="breakpoint-label">Mobile</span>
</div>
<div className="breakpoint-range">0 - 767px</div>
</div>
<div className="breakpoint-description">
                        Single column layout, hamburger menu, touch-optimized buttons (min 44x44px), simplified navigation, stacked components.
                    </div>
<div className="breakpoint-specs">
<div className="spec-item">
<div className="spec-label">Columns</div>
<div className="spec-value">1</div>
</div>
<div className="spec-item">
<div className="spec-label">Font Scale</div>
<div className="spec-value">Base</div>
</div>
<div className="spec-item">
<div className="spec-label">Padding</div>
<div className="spec-value">16px</div>
</div>
</div>
</div>
<!-- Tablet -->
<div className="breakpoint-card">
<div className="breakpoint-header">
<div className="breakpoint-name">
<span className="breakpoint-icon">📱</span>
<span className="breakpoint-label">Tablet</span>
</div>
<div className="breakpoint-range">768 - 1023px</div>
</div>
<div className="breakpoint-description">
                        2-column grid, expanded navigation, larger touch targets, optimized for both portrait and landscape orientations.
                    </div>
<div className="breakpoint-specs">
<div className="spec-item">
<div className="spec-label">Columns</div>
<div className="spec-value">2</div>
</div>
<div className="spec-item">
<div className="spec-label">Font Scale</div>
<div className="spec-value">+5%</div>
</div>
<div className="spec-item">
<div className="spec-label">Padding</div>
<div className="spec-value">24px</div>
</div>
</div>
</div>
<!-- Desktop -->
<div className="breakpoint-card">
<div className="breakpoint-header">
<div className="breakpoint-name">
<span className="breakpoint-icon">💻</span>
<span className="breakpoint-label">Desktop</span>
</div>
<div className="breakpoint-range">1024 - 1439px</div>
</div>
<div className="breakpoint-description">
                        3-column grid, full navigation bar, hover states, larger content areas, optimized for mouse and keyboard interaction.
                    </div>
<div className="breakpoint-specs">
<div className="spec-item">
<div className="spec-label">Columns</div>
<div className="spec-value">3</div>
</div>
<div className="spec-item">
<div className="spec-label">Font Scale</div>
<div className="spec-value">+10%</div>
</div>
<div className="spec-item">
<div className="spec-label">Padding</div>
<div className="spec-value">32px</div>
</div>
</div>
</div>
<!-- Wide Desktop -->
<div className="breakpoint-card">
<div className="breakpoint-header">
<div className="breakpoint-name">
<span className="breakpoint-icon">🖥️</span>
<span className="breakpoint-label">Wide Desktop</span>
</div>
<div className="breakpoint-range">1440px+</div>
</div>
<div className="breakpoint-description">
                        4+ column grid, max-width container (1280px), enhanced spacing, full feature set, optimized for large displays.
                    </div>
<div className="breakpoint-specs">
<div className="spec-item">
<div className="spec-label">Columns</div>
<div className="spec-value">4+</div>
</div>
<div className="spec-item">
<div className="spec-label">Font Scale</div>
<div className="spec-value">+15%</div>
</div>
<div className="spec-item">
<div className="spec-label">Padding</div>
<div className="spec-value">40px</div>
</div>
</div>
</div>
</div>
<!-- Visual Examples -->
<div>
<div className="visual-examples">
<div className="section-title" style="font-size: 16px; margin-bottom: 16px;">
<span>👁️</span>
<span>Layout Examples</span>
</div>
<!-- Mobile Example -->
<div className="example-device">
<div className="device-label">
<span>📱</span>
<span>Mobile (375px)</span>
</div>
<div className="mobile-layout">
<div className="mobile-header"></div>
<div className="mobile-content">
<div className="mobile-block"></div>
<div className="mobile-block"></div>
<div className="mobile-block"></div>
</div>
</div>
</div>
<!-- Tablet Example -->
<div className="example-device">
<div className="device-label">
<span>📱</span>
<span>Tablet (768px)</span>
</div>
<div className="tablet-layout">
<div className="tablet-header"></div>
<div className="tablet-content">
<div className="tablet-block"></div>
<div className="tablet-block"></div>
<div className="tablet-block"></div>
<div className="tablet-block"></div>
</div>
</div>
</div>
<!-- Desktop Example -->
<div className="example-device">
<div className="device-label">
<span>💻</span>
<span>Desktop (1280px)</span>
</div>
<div className="desktop-layout">
<div className="desktop-header"></div>
<div className="desktop-content">
<div className="desktop-block"></div>
<div className="desktop-block"></div>
<div className="desktop-block"></div>
</div>
</div>
</div>
</div>
<!-- Best Practices -->
<div className="best-practices">
<div className="practices-title">
<span>⚡</span>
<span>Best Practices</span>
</div>
<div className="practice-item">
<span className="practice-icon">✓</span>
<span className="practice-text">
<span className="practice-highlight">Mobile-First:</span> Ontwerp eerst voor mobile, dan scale up naar desktop
                        </span>
</div>
<div className="practice-item">
<span className="practice-icon">✓</span>
<span className="practice-text">
<span className="practice-highlight">Touch Targets:</span> Minimum 44x44px voor alle interactieve elementen
                        </span>
</div>
<div className="practice-item">
<span className="practice-icon">✓</span>
<span className="practice-text">
<span className="practice-highlight">Fluid Typography:</span> Gebruik clamp() voor responsive font sizes
                        </span>
</div>
<div className="practice-item">
<span className="practice-icon">✓</span>
<span className="practice-text">
<span className="practice-highlight">Container Queries:</span> Component-level responsive behavior waar mogelijk
                        </span>
</div>
<div className="practice-item">
<span className="practice-icon">✓</span>
<span className="practice-text">
<span className="practice-highlight">Performance:</span> Lazy load images, optimize assets per breakpoint
                        </span>
</div>
<div className="practice-item">
<span className="practice-icon">✓</span>
<span className="practice-text">
<span className="practice-highlight">Testing:</span> Test op echte devices, niet alleen browser dev tools
                        </span>
</div>
</div>
</div>
</div>
</div>
    );
};

export default ResponsivePatterns;