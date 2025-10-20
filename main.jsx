import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './mr-dj-eds-components/src/App.css';
import App from './App.jsx';
import { ConsentManager } from './ConsentManager.jsx';
import { applyDesignTokens } from './main.js';

if (typeof document !== 'undefined') {
  applyDesignTokens();
}

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ConsentManager>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConsentManager>
    </StrictMode>,
  );
}
