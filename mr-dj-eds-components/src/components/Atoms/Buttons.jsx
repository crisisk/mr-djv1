import React from 'react';

<<<<<<< HEAD
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
=======
const Button = ({ children, variant = 'primary', size = 'medium', onClick, className = '' }) => {
  const baseStyle = 'font-semibold rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-4';
  
  const variantStyles = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-300',
    secondary: 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300 focus:ring-neutral-400',
    outline: 'bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white focus:ring-primary-300',
    ghost: 'bg-transparent text-neutral-800 hover:bg-neutral-100 focus:ring-neutral-200',
  };
>>>>>>> a17057fd1b60325dffe5679689a8e8abbbe39b4d

  const sizeStyles = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;

