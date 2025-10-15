import { useState } from 'react';
import Button from './components/Atoms/Buttons.jsx';
import DjSaxLanding from './components/Templates/DjSaxLanding.jsx';
import './App.css'

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-neutral-light">
      <DjSaxLanding />
    </div>
  )
}

export default App
