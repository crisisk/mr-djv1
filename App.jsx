import './App.css';
import MrDjApp from './mr-dj-eds-components/src/App.jsx';
import HeroSection from './HeroSection.jsx';

// Export a registry of hero-centric components so that downstream
// instrumentation (analytics, personalization, etc.) can reliably
// reference the building blocks that render the primary fold of the
// experience.
export const HERO_COMPONENTS = {
  HeroSection,
};

function App() {
  return <MrDjApp />;
}

export default App;
export { HeroSection };
