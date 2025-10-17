import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ConsentManager } from './components/ConsentManager.jsx';
import { applyDesignTokens } from './main.js';
import { getDocument, getWindow } from './lib/environment.js';

const browser = getWindow();
if (browser) {
  applyDesignTokens();
}

const documentRef = getDocument();
const rootElement = documentRef?.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ConsentManager>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConsentManager>
    </StrictMode>
  );
}
