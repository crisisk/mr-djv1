import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const Buttons = () => {
    return (
        <div className="slide-container">
<div className="left-section">
<h1>Atoms: Buttons</h1>
<p className="subtitle">Interactive button components met verschillende varianten, sizes en states</p>
<div className="button-grid">
<!-- Primary Buttons -->
<div className="button-row">
<div className="button-label">Primary Buttons</div>
<div className="button-variants">
<button className="btn bg-primary text-primary-foreground btn-sm">Small</button>
<button className="btn bg-primary text-primary-foreground btn-md">Medium</button>
<button className="btn bg-primary text-primary-foreground btn-lg">Large</button>
<button className="btn bg-primary text-primary-foreground btn-md" disabled="">Disabled</button>
</div>
</div>
<!-- Secondary Buttons -->
<div className="button-row">
<div className="button-label">Secondary Buttons</div>
<div className="button-variants">
<button className="btn bg-secondary text-secondary-foreground btn-sm">Small</button>
<button className="btn bg-secondary text-secondary-foreground btn-md">Medium</button>
<button className="btn bg-secondary text-secondary-foreground btn-lg">Large</button>
</div>
</div>
<!-- Outline Buttons -->
<div className="button-row">
<div className="button-label">Outline Buttons</div>
<div className="button-variants">
<button className="btn border-primary text-primary btn-sm">Small</button>
<button className="btn border-primary text-primary btn-md">Medium</button>
<button className="btn border-primary text-primary btn-lg">Large</button>
</div>
</div>
<!-- Ghost Buttons -->
<div className="button-row">
<div className="button-label">Ghost Buttons</div>
<div className="button-variants">
<button className="btn text-primary hover:bg-primary/10 btn-sm">Small</button>
<button className="btn text-primary hover:bg-primary/10 btn-md">Medium</button>
<button className="btn text-primary hover:bg-primary/10 btn-lg">Large</button>
</div>
</div>
<!-- Icon Buttons -->
<div className="button-row">
<div className="button-label">With Icons</div>
<div className="button-variants">
<button className="btn bg-primary text-primary-foreground btn-md">
<svg fill="currentColor" height="18" viewbox="0 0 20 20" width="18">
<path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"></path>
</svg>
                            Boek Nu
                        </button>
<button className="btn border-primary text-primary btn-md">
                            Meer Info
                            <svg fill="currentColor" height="18" viewbox="0 0 20 20" width="18">
<path clip-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" fill-rule="evenodd"></path>
</svg>
</button>
</div>
</div>
</div>
</div>
<!-- Code Section -->
<div className="code-section">
<div className="code-title">React Component</div>
<div className="code-block">
<span className="code-comment">// Button.tsx</span>
<span className="code-keyword">import</span> React <span className="code-keyword">from</span> <span className="code-string">'react'</span>;

<span className="code-keyword">interface</span> ButtonProps {
  variant?: <span className="code-string">'primary'</span> | <span className="code-string">'secondary'</span> | <span className="code-string">'outline'</span> | <span className="code-string">'ghost'</span>;
  size?: <span className="code-string">'sm'</span> | <span className="code-string">'md'</span> | <span className="code-string">'lg'</span>;
  children: React.ReactNode;
  onClick?: () =&gt; <span className="code-keyword">void</span>;
  disabled?: <span className="code-keyword">boolean</span>;
}

<span className="code-keyword">export const</span> Button: React.FC&lt;ButtonProps&gt; = ({
  variant = <span className="code-string">'primary'</span>,
  size = <span className="code-string">'md'</span>,
  children,
  onClick,
  disabled = <span className="code-keyword">false</span>
}) =&gt; {
  <span className="code-keyword">return</span> (
    &lt;<span className="code-tag">button</span>
<span className="code-attr">className</span>=<span className="code-string">{`btn btn-${variant} btn-${size}`}</span>
<span className="code-attr">onClick</span>={onClick}
      <span className="code-attr">disabled</span>={disabled}
    &gt;
      {children}
    &lt;/<span className="code-tag">button</span>&gt;
  );
};

<span className="code-comment">// Usage</span>
&lt;<span className="code-tag">Button</span> <span className="code-attr">variant</span>=<span className="code-string">"primary"</span> <span className="code-attr">size</span>=<span className="code-string">"lg"</span>&gt;
  Boek Nu
&lt;/<span className="code-tag">Button</span>&gt;
            </div>
<div className="props-list">
<div className="prop-item"><span className="prop-name">variant:</span> primary | secondary | outline | ghost</div>
<div className="prop-item"><span className="prop-name">size:</span> sm | md | lg</div>
<div className="prop-item"><span className="prop-name">disabled:</span> boolean</div>
</div>
</div>
</div>
    );
};

export default Buttons;