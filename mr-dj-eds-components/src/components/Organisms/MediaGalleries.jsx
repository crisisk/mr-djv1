import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const MediaGalleries = () => {
    return (
        <div className="slide-container">
<h1>Organisms: Media Galleries</h1>
<p className="subtitle">Componenten voor het tonen van foto's en video's van evenementen (Grid, Carousel, Lightbox)</p>
<div className="gallery-container">
<!-- Grid Gallery (Voor Event Portfolio) -->
<div className="gallery-section">
<div className="gallery-title">Masonry Grid Gallery (4x4)</div>
<div className="grid-gallery" style="height: 300px;">
<div className="grid-item featured">Featured Video (16:9)</div>
<div className="grid-item image-placeholder">Image 1</div>
<div className="grid-item image-placeholder">Image 2</div>
<div className="grid-item image-placeholder">Image 3</div>
<div className="grid-item image-placeholder">Image 4</div>
<div className="grid-item image-placeholder">Image 5</div>
<div className="grid-item image-placeholder">Image 6</div>
<div className="grid-item image-placeholder">Image 7</div>
<div className="grid-item image-placeholder">Image 8</div>
<div className="grid-item image-placeholder">Image 9</div>
</div>
</div>
<!-- Carousel Gallery (Voor Testimonials/Hero) -->
<div className="gallery-section" style="position: relative;">
<div className="gallery-title">Full-Width Carousel (Auto-Play)</div>
<div className="carousel-gallery">
<div className="carousel-item video-placeholder">Video Item 1</div>
<div className="carousel-item image-placeholder">Image Item 2</div>
<div className="carousel-item image-placeholder">Image Item 3</div>
<div className="carousel-item video-placeholder">Video Item 4</div>
<div className="carousel-item image-placeholder">Image Item 5</div>
</div>
<div className="carousel-controls">
<div className="control-button" style="margin-left: -20px;">&lt;</div>
<div className="control-button" style="margin-right: -20px;">&gt;</div>
</div>
</div>
</div>
</div>
    );
};

export default MediaGalleries;