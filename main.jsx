import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css';
import App from './App.jsx';
import { ConsentManager } from './ConsentManager.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConsentManager>
      <App />
    </ConsentManager>
  </StrictMode>,
)
