let trackConversionModulePromise;

export const loadTrackConversion = () => {
  if (!trackConversionModulePromise) {
    trackConversionModulePromise = import('./trackConversion');
  }

  return trackConversionModulePromise;
};

export default loadTrackConversion;
