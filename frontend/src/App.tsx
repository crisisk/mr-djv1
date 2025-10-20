import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './styles/typography.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="typography-base">
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="typography-title">Vite + React</h1>
      <div className="card typography-body-large">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p className="typography-body">
          Edit{' '}
          <code className="typography-code">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs typography-caption">
        Click on the Vite and React logos to learn more
      </p>
    </main>
  )
}

export default App
