import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ConsentManager } from './components/ConsentManager.jsx';
import { applyDesignTokens } from './main.js';

if (typeof window !== 'undefined') {
  applyDesignTokens();
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConsentManager>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConsentManager>
  </StrictMode>,
)
