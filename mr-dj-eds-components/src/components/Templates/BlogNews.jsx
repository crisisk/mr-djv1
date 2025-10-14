import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const BlogNews = () => {
    return (
        <div className="slide-container">
<h1>Templates: Blog &amp; News</h1>
<p className="subtitle">Templates voor de blog overzichtspagina en de individuele artikelpagina.</p>
<div className="blog-grid">
<!-- Kolom 1: Blog Listing Page -->
<div className="template-box">
<div className="template-title">Blog Overzichtspagina</div>
<div className="listing-item">
<div className="listing-thumb">Featured Image</div>
<div className="listing-info">
<h3>De 5 Meest Gevraagde Bruiloft Nummers van 2025</h3>
<p>Door Mr. DJ op 15 Okt 2025 | Categorie: Bruiloft</p>
</div>
</div>
<div className="listing-item">
<div className="listing-thumb">Featured Image</div>
<div className="listing-info">
<h3>Hoe Kies Je de Perfecte DJ voor Je Bedrijfsfeest?</h3>
<p>Door Redactie op 1 Okt 2025 | Categorie: Bedrijfsfeest</p>
</div>
</div>
<div className="listing-item">
<div className="listing-thumb">Featured Image</div>
<div className="listing-info">
<h3>De Kracht van de Saxofonist: Een Interview</h3>
<p>Door Mr. DJ op 20 Sep 2025 | Categorie: Muziek</p>
</div>
</div>
<div className="listing-item">
<div className="listing-thumb">Featured Image</div>
<div className="listing-info">
<h3>Paginatie &amp; Filters</h3>
<p>... (Navigatie onderaan)</p>
</div>
</div>
</div>
<!-- Kolom 2: Single Article Page -->
<div className="template-box">
<div className="template-title">Individuele Artikelpagina</div>
<div className="article-header">
<h2>De Ultieme Gids voor het Kiezen van de Perfecte DJ</h2>
<p>Gepubliceerd op 15 Okt 2025 | Leestijd: 5 min</p>
</div>
<div className="article-body">
<div className="article-content">
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
<p style="margin-top: 10px;">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. (Content Area)</p>
<div className="cta-box" style="background: #D4AF37; color: #1A2C4B; margin-top: 20px;">
<div className="cta-title" style="color: #1A2C4B;">Vraag Nu Een Offerte Aan!</div>
</div>
</div>
<div className="article-sidebar">
<div style="font-weight: 800; color: #1A2C4B; margin-bottom: 10px;">Gerelateerde Artikelen</div>
<ul style="list-style-type: disc; margin-left: 15px;">
<li>Bruiloft DJ Tips</li>
<li>Bedrijfsfeest Checklist</li>
<li>Muziek Trends 2026</li>
</ul>
<div style="font-weight: 800; color: #1A2C4B; margin-top: 15px; margin-bottom: 10px;">Auteur: Mr. DJ</div>
<p>De oprichter en hoofddiscjockey met 15 jaar ervaring.</p>
</div>
</div>
</div>
</div>
</div>
    );
};

export default BlogNews;