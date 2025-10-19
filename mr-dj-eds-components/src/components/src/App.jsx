// src/App.jsx (modification)
import HeatmapTracker from './components/analytics/HeatmapTracker';

// Add this component near the root of your app
function App() {
  return (
    <>
      <HeatmapTracker 
        hotjarId={process.env.REACT_APP_HOTJAR_ID} 
        hotjarSnippetVersion={process.env.REACT_APP_HOTJAR_SNIPPET_VERSION}
      />
      {/* Rest of your app */}
    </>
  );
}