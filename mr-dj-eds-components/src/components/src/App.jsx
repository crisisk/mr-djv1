// src/App.jsx (modification)
import React from 'react';
import HeatmapTracker from './components/analytics/HeatmapTracker.jsx';

/**
 * Lightweight wrapper that mounts the Hotjar tracker around the generated
 * application. Environment variables remain the default source for the
 * Hotjar configuration but explicit props can override them when embedding
 * the snippet in another project.
 */
const AppWithHeatmap = ({
  children,
  hotjarId = process.env.REACT_APP_HOTJAR_ID,
  hotjarSnippetVersion = process.env.REACT_APP_HOTJAR_SNIPPET_VERSION,
  renderWhenMissingConfig = null,
}) => {
  const hasTrackingConfig = Boolean(hotjarId && hotjarSnippetVersion);

  return (
    <>
      {hasTrackingConfig ? (
        <HeatmapTracker hotjarId={hotjarId} hotjarSnippetVersion={hotjarSnippetVersion} />
      ) : (
        renderWhenMissingConfig
      )}
      {children}
    </>
  );
};

export default AppWithHeatmap;
