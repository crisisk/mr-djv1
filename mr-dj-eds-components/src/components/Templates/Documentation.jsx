import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const Documentation = () => {
    return (
        <div className="slide-container">
<h1>Documentation &amp; Component Usage</h1>
<p className="subtitle">Richtlijnen voor het gebruik van componenten, Storybook integratie en codevoorbeelden.</p>
<div className="content-grid">
<div>
<div className="section-title">Component Documentatie</div>
<div className="doc-point">
<div className="doc-point-title">Storybook Integratie</div>
<div className="doc-point-text">Alle componenten zijn gedocumenteerd in Storybook. Dit is de primaire bron voor het bekijken van varianten, props en live voorbeelden.</div>
</div>
<div className="doc-point">
<div className="doc-point-title">Prop Tabellen</div>
<div className="doc-point-text">Elke component heeft een duidelijke tabel met alle beschikbare properties (props), hun types en standaardwaarden.</div>
</div>
<div className="doc-point">
<div className="doc-point-title">Do's &amp; Don'ts</div>
<div className="doc-point-text">Specifieke richtlijnen over wanneer en hoe een component te gebruiken, en wat absoluut vermeden moet worden.</div>
</div>
<div className="platform-box">
<div className="section-title" style="border-bottom: none; margin-bottom: 10px; color: #1A2C4B;">Developer Workflow</div>
<ul>
<li>Importeer componenten via de centrale library.</li>
<li>Gebruik Design Tokens in plaats van hardcoded waarden.</li>
<li>Voer altijd een visuele regressietest uit na updates.</li>
</ul>
</div>
</div>
<div>
<div className="section-title">Code Voorbeeld: Button</div>
<div className="code-example">
<span className="comment">// React Component Usage</span>
<span className="keyword">import</span> { Button } <span className="keyword">from</span> <span className="string">'@mrdj/eds-library'</span>;

<span className="keyword">const</span> App = () =&gt; (
  <span className="keyword">&lt;Button</span>
    variant=<span className="string">"primary"</span>
    size=<span className="string">"large"</span>
    onClick={() =&gt; console.log(<span className="string">'Geboekt!'</span>)}
  <span className="keyword">&gt;</span>
    Boek Nu
  <span className="keyword">&lt;/Button&gt;</span>
);
                </div>
<div className="doc-point" style="margin-top: 20px;">
<div className="doc-point-title">Design Tokens</div>
<div className="doc-point-text">Alle kleuren, spacing en typografie zijn gedefinieerd als tokens, waardoor ze eenvoudig in elk platform (Web, iOS, Android) kunnen worden gebruikt.</div>
</div>
<div className="code-example">
<span className="comment">// Design Token Example (JSON)</span>
<span className="keyword">"color-primary-blue"</span>: {
  <span className="keyword">"value"</span>: <span className="string">"#00AEEF"</span>,
  <span className="keyword">"type"</span>: <span className="string">"color"</span>
},
<span className="keyword">"spacing-md"</span>: {
  <span className="keyword">"value"</span>: <span className="string">"16px"</span>,
  <span className="keyword">"type"</span>: <span className="string">"spacing"</span>
}
                </div>
</div>
</div>
</div>
    );
};

export default Documentation;