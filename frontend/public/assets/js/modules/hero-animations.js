/**
 * Hero Section Animations
 * Counter animations for hero stats
 */

export function initHeroAnimations() {
    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    };

    // Intersection Observer to trigger counter when hero is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const countersInView = entry.target.querySelectorAll('.counter');
                countersInView.forEach(counter => {
                    // Reset counter
                    counter.textContent = '0';
                    // Animate
                    animateCounter(counter);
                });
                // Only animate once
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Observe hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        observer.observe(heroSection);
    }
}
