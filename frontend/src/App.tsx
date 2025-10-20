import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { pushEvent } from './lib/analytics/ga4'

function App() {
  const [count, setCount] = useState(0)

  const handleBookingClick = (ctaLocation: string) => {
    pushEvent({
      name: 'booking_cta_click',
      params: {
        location: ctaLocation,
      },
    })
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((value) => value + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div className="card">
        <button
          type="button"
          onClick={() => handleBookingClick('primary-cta')}
          className="booking-button"
        >
          Book your consultation
        </button>
        <p className="read-the-docs">
          Clicking the booking button will send a GA4 event when analytics is available.
        </p>
      </div>
    </>
  )
}

export default App
