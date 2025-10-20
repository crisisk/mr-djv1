import './App.css'
import ConversionMetricsPanel from './components/Generated/dashboard/ConversionMetricsPanel'

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Dashboard conversiestatistieken</h1>
        <p>Voorbeeldweergave van de nieuwe configuratiedashboard API voor conversies en funnel metrics.</p>
      </header>
      <main>
        <ConversionMetricsPanel />
      </main>
    </div>
  )
}

export default App
