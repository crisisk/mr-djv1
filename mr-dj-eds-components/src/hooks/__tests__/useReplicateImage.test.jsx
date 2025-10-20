import { renderHook, act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../services/replicate.js', () => ({
  getCachedOrGenerateImage: vi.fn(),
  generateHeroImage: vi.fn(),
  generateEventImage: vi.fn(),
}));

import { useReplicateImage, useHeroImage } from '../useReplicateImage.js';
import { getCachedOrGenerateImage, generateHeroImage, generateEventImage } from '../../services/replicate.js';

describe('useReplicateImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCachedOrGenerateImage.mockImplementation(async (_key, generator) => {
      return generator ? await generator() : null;
    });
    generateHeroImage.mockResolvedValue('hero-url');
    generateEventImage.mockResolvedValue('event-url');
  });

  it('routes hero requests through generateHeroImage', async () => {
    const { result } = renderHook(() => useReplicateImage());

    const params = { type: 'hero', city: 'Amsterdam', eventType: 'feest' };
    let returnedUrl;
    await act(async () => {
      returnedUrl = await result.current.generateImage(params);
    });

    expect(getCachedOrGenerateImage).toHaveBeenCalledWith(JSON.stringify(params), expect.any(Function));
    expect(generateHeroImage).toHaveBeenCalledWith(params);
    expect(generateEventImage).not.toHaveBeenCalled();
    expect(returnedUrl).toBe('hero-url');
    expect(result.current.imageUrl).toBe('hero-url');
  });

  it('routes event requests through generateEventImage', async () => {
    const { result } = renderHook(() => useReplicateImage());

    const params = { type: 'event', prompt: 'Dance floor', aspectRatio: '4:3' };
    let returnedUrl;
    await act(async () => {
      returnedUrl = await result.current.generateImage(params);
    });

    expect(getCachedOrGenerateImage).toHaveBeenCalledWith(JSON.stringify(params), expect.any(Function));
    expect(generateEventImage).toHaveBeenCalledWith(params);
    expect(generateHeroImage).not.toHaveBeenCalled();
    expect(returnedUrl).toBe('event-url');
    expect(result.current.imageUrl).toBe('event-url');
  });

  it('updates error state when generation fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useReplicateImage());

    getCachedOrGenerateImage.mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      await result.current.generateImage({ type: 'hero', city: 'Rotterdam' });
    });

    await waitFor(() => expect(result.current.error).toBe('Network error'));
    expect(result.current.isLoading).toBe(false);

    consoleErrorSpy.mockRestore();
  });

  it('allows imperative overrides through setImageUrl', () => {
    const { result } = renderHook(() => useReplicateImage({ placeholder: 'initial' }));

    expect(result.current.imageUrl).toBe('initial');

    act(() => {
      result.current.setImageUrl('manual-url');
    });

    expect(result.current.imageUrl).toBe('manual-url');
  });
});

describe('useHeroImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCachedOrGenerateImage.mockImplementation(async (_key, generator) => await generator());
    generateHeroImage.mockResolvedValue('auto-hero-url');
  });

  it('auto generates a hero image when city and autoGenerate are provided', async () => {
    const { result } = renderHook(() =>
      useHeroImage({ city: 'Utrecht', eventType: 'bruiloft', autoGenerate: true })
    );

    await waitFor(() =>
      expect(generateHeroImage).toHaveBeenCalledWith({
        type: 'hero',
        city: 'Utrecht',
        eventType: 'bruiloft',
      })
    );

    expect(result.current.imageUrl).toBe('auto-hero-url');
  });

  it('skips generation when required data is missing', async () => {
    renderHook(() => useHeroImage({ city: undefined, autoGenerate: true }));
    renderHook(() => useHeroImage({ city: 'Eindhoven', autoGenerate: false }));

    await waitFor(() => expect(generateHeroImage).not.toHaveBeenCalled());
  });
});
