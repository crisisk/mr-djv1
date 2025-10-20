import { renderHook, act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useReplicateImage, useHeroImage } from '../useReplicateImage.js';
import { getCachedOrGenerateImage, generateHeroImage, generateEventImage } from '../services/replicate';

vi.mock('../services/replicate', () => ({
  getCachedOrGenerateImage: vi.fn(),
  generateHeroImage: vi.fn(),
  generateEventImage: vi.fn(),
}));

describe('useReplicateImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('routes hero and event generation through their respective services', async () => {
    vi.mocked(getCachedOrGenerateImage).mockImplementation(async (_key, generator) => generator());
    vi.mocked(generateHeroImage).mockResolvedValue('hero-url');
    vi.mocked(generateEventImage).mockResolvedValue('event-url');

    const { result } = renderHook(() => useReplicateImage());

    await act(async () => {
      await result.current.generateImage({ type: 'hero', city: 'Paris' });
    });

    expect(generateHeroImage).toHaveBeenCalledWith({ type: 'hero', city: 'Paris' });
    expect(result.current.imageUrl).toBe('hero-url');

    await act(async () => {
      await result.current.generateImage({ type: 'event', name: 'Gala' });
    });

    expect(generateEventImage).toHaveBeenCalledWith({ type: 'event', name: 'Gala' });
    expect(result.current.imageUrl).toBe('event-url');
  });

  it('updates error state when generation fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(getCachedOrGenerateImage).mockRejectedValue(new Error('generation failed'));

    const { result } = renderHook(() => useReplicateImage());

    await act(async () => {
      const response = await result.current.generateImage({ type: 'hero', city: 'Berlin' });
      expect(response).toBeNull();
    });

    expect(result.current.error).toBe('generation failed');
    expect(result.current.isLoading).toBe(false);

    consoleSpy.mockRestore();
  });

  it('exposes setImageUrl for imperative overrides', () => {
    const { result } = renderHook(() => useReplicateImage());

    act(() => {
      result.current.setImageUrl('manual-url');
    });

    expect(result.current.imageUrl).toBe('manual-url');
  });
});

describe('useHeroImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates hero images only when autoGenerate is enabled with a city', async () => {
    vi.mocked(getCachedOrGenerateImage).mockImplementation(async (_key, generator) => generator());
    vi.mocked(generateHeroImage).mockResolvedValue('auto-hero-url');

    const { rerender } = renderHook((props) => useHeroImage(props), {
      initialProps: { city: undefined, eventType: 'festival', autoGenerate: true },
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(generateHeroImage).not.toHaveBeenCalled();

    rerender({ city: 'Amsterdam', eventType: 'festival', autoGenerate: true });

    await waitFor(() => {
      expect(generateHeroImage).toHaveBeenCalledTimes(1);
    });

    expect(generateHeroImage).toHaveBeenCalledWith({
      type: 'hero',
      city: 'Amsterdam',
      eventType: 'festival',
    });
  });
});
