import React from 'react';
// De styling voor deze componenten is gedefinieerd in de globale CSS of de App.css.
// De inline <style> blokken van de originele HTML zijn verwijderd.

const ImplementationGuide = () => {
    return (
        <div className="slide-container">
<h1>Implementation Guide</h1>
<p className="subtitle">Tech stack, development workflow en component architectuur voor Mr. DJ Design System</p>
<div className="content-grid">
<!-- Tech Stack -->
<div className="tech-stack">
<h2 className="section-title">
<span>⚙️</span>
<span>Tech Stack</span>
</h2>
<div className="tech-categories">
<div className="tech-category">
<div className="category-label">Frontend Framework</div>
<div className="tech-items">
<div className="tech-item">
<span className="tech-icon">⚛️</span>
<span>React 18</span>
</div>
<div className="tech-item">
<span className="tech-icon">📘</span>
<span>TypeScript</span>
</div>
<div className="tech-item">
<span className="tech-icon">⚡</span>
<span>Vite</span>
</div>
</div>
</div>
<div className="tech-category">
<div className="category-label">Styling &amp; UI</div>
<div className="tech-items">
<div className="tech-item">
<span className="tech-icon">🎨</span>
<span>Tailwind CSS</span>
</div>
<div className="tech-item">
<span className="tech-icon">✨</span>
<span>Framer Motion</span>
</div>
<div className="tech-item">
<span className="tech-icon">🎭</span>
<span>Headless UI</span>
</div>
</div>
</div>
<div className="tech-category">
<div className="category-label">Content Management</div>
<div className="tech-items">
<div className="tech-item">
<span className="tech-icon">📝</span>
<span>Netlify CMS</span>
</div>
<div className="tech-item">
<span className="tech-icon">🔐</span>
<span>Netlify Identity</span>
</div>
</div>
</div>
<div className="tech-category">
<div className="category-label">Deployment &amp; Hosting</div>
<div className="tech-items">
<div className="tech-item">
<span className="tech-icon">🚀</span>
<span>Netlify</span>
</div>
<div className="tech-item">
<span className="tech-icon">🔄</span>
<span>GitHub Actions</span>
</div>
<div className="tech-item">
<span className="tech-icon">🌐</span>
<span>CDN</span>
</div>
</div>
</div>
<div className="tech-category">
<div className="category-label">Development Tools</div>
<div className="tech-items">
<div className="tech-item">
<span className="tech-icon">📚</span>
<span>Storybook</span>
</div>
<div className="tech-item">
<span className="tech-icon">✅</span>
<span>ESLint</span>
</div>
<div className="tech-item">
<span className="tech-icon">💅</span>
<span>Prettier</span>
</div>
</div>
</div>
</div>
</div>
<!-- Development Workflow -->
<div className="workflow-section">
<h2 className="section-title" style="color: #1A2C4B;">
<span>🔄</span>
<span>Development Workflow</span>
</h2>
<div className="workflow-steps">
<div className="workflow-step">
<div className="step-number">1</div>
<div className="step-content">
<div className="step-title">Design in Figma</div>
<div className="step-description">
                                Component design met brand guidelines, export design tokens
                            </div>
</div>
</div>
<div className="workflow-step">
<div className="step-number">2</div>
<div className="step-content">
<div className="step-title">Build Component</div>
<div className="step-description">
                                React component met TypeScript, Tailwind CSS styling
                            </div>
</div>
</div>
<div className="workflow-step">
<div className="step-number">3</div>
<div className="step-content">
<div className="step-title">Document in Storybook</div>
<div className="step-description">
                                Stories voor alle varianten, props documentatie, usage examples
                            </div>
</div>
</div>
<div className="workflow-step">
<div className="step-number">4</div>
<div className="step-content">
<div className="step-title">Test &amp; Review</div>
<div className="step-description">
                                Unit tests, accessibility checks, cross-browser testing
                            </div>
</div>
</div>
<div className="workflow-step">
<div className="step-number">5</div>
<div className="step-content">
<div className="step-title">Deploy to Production</div>
<div className="step-description">
                                Git push → GitHub Actions → Netlify deployment (automatic)
                            </div>
</div>
</div>
</div>
</div>
<!-- Component Structure -->
<div className="component-structure">
<h2 className="section-title" style="color: #1A2C4B;">
<span>📦</span>
<span>Component Structure</span>
</h2>
<div className="code-block">
<span className="code-comment">// Example: Button Component</span>
<span className="code-keyword">import</span> { <span className="code-function">ButtonHTMLAttributes</span> } <span className="code-keyword">from</span> <span className="code-string">'react'</span>
<span className="code-keyword">interface</span> <span className="code-function">ButtonProps</span> {
  variant: <span className="code-string">'primary'</span> | <span className="code-string">'secondary'</span> | <span className="code-string">'outline'</span>
  size: <span className="code-string">'sm'</span> | <span className="code-string">'md'</span> | <span className="code-string">'lg'</span>
  children: React.ReactNode
}

<span className="code-keyword">export const</span> <span className="code-function">Button</span> = ({
  variant = <span className="code-string">'primary'</span>,
  size = <span className="code-string">'md'</span>,
  children,
  ...props
}) =&gt; {
  <span className="code-keyword">return</span> (
    &lt;<span className="code-keyword">button</span>
<span className="code-function">className</span>={<span className="code-string">`btn btn-${variant} btn-${size}`</span>}
      {...props}
    &gt;
      {children}
    &lt;/<span className="code-keyword">button</span>&gt;
  )
}
                </div>
</div>
<!-- Best Practices -->
<div className="best-practices">
<h2 className="section-title" style="color: #1A2C4B;">
<span>⭐</span>
<span>Best Practices</span>
</h2>
<div className="practice-list">
<div className="practice-item">
<span className="practice-icon">✓</span>
<span className="practice-text">
<span className="practice-highlight">Component-first:</span> Bouw herbruikbare components, geen page-specific code
                        </span>
</div>
<div className="practice-item">
<span className="practice-icon">✓</span>
<span className="practice-text">
<span className="practice-highlight">TypeScript:</span> Gebruik types voor alle props en state voor type safety
                        </span>
</div>
<div className="practice-item">
<span className="practice-icon">✓</span>
<span className="practice-text">
<span className="practice-highlight">Accessibility:</span> WCAG 2.1 AA compliance, keyboard navigation, ARIA labels
                        </span>
</div>
<div className="practice-item">
<span className="practice-icon">✓</span>
<span className="practice-text">
<span className="practice-highlight">Performance:</span> Lazy loading, code splitting, image optimization
                        </span>
</div>
<div className="practice-item">
<span className="practice-icon">✓</span>
<span className="practice-text">
<span className="practice-highlight">Mobile-first:</span> Design en ontwikkel eerst voor mobile, dan desktop
                        </span>
</div>
<div className="practice-item">
<span className="practice-icon">✓</span>
<span className="practice-text">
<span className="practice-highlight">Documentation:</span> Elke component gedocumenteerd in Storybook met examples
                        </span>
</div>
<div className="practice-item">
<span className="practice-icon">✓</span>
<span className="practice-text">
<span className="practice-highlight">Version Control:</span> Semantic versioning, changelog bijhouden, feature branches
                        </span>
</div>
</div>
</div>
</div>
</div>
    );
};

export default ImplementationGuide;