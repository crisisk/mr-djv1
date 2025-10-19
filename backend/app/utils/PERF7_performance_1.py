import LazyImageLoader from './LazyImageLoader';

describe('LazyImageLoader', () => {
    let lazyLoader;

    beforeEach(() => {
        document.body.innerHTML = `
            <img class="lazy-image" data-src="test1.jpg">
            <img class="lazy-image" data-src="test2.jpg">
        `;
        lazyLoader = new LazyImageLoader();
    });

    test('initializes correctly', async () => {
        await lazyLoader.init();
        expect(lazyLoader.stats.totalImages).toBe(2);
    });

    test('loads images when they intersect', async () => {
        const mockIntersectionObserver = jest.fn();
        window.IntersectionObserver = mockIntersectionObserver;

        await lazyLoader.init();
        
        const callback = mockIntersectionObserver.mock.calls[0][0];
        callback([
            {
                isIntersecting: true,
                target: document.querySelector('.lazy-image')
            }
        ]);

        expect(lazyLoader.stats.loadedImages).toBe(1);
    });

    test('handles errors gracefully', async () => {
        const img = document.querySelector('.lazy-image');
        img.removeAttribute('data-src');

        await lazyLoader.init();
        expect(lazyLoader.stats.failures).toBe(0);
    });
});
