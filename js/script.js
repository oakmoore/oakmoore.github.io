document.addEventListener('DOMContentLoaded', () => {
    console.log('Project loaded successfully!');

    // -------------------------
    // Mobile Navigation Toggle
    // -------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const navLeft = document.querySelector('.nav-left');

    if (menuToggle && navLeft) {
        menuToggle.addEventListener('click', () => {
            navLeft.classList.toggle('active');
        });
    }

    // -------------------------
    // Popular Products Carousel
    // -------------------------
    const track = document.querySelector('.carousel-track');
    const popularProductsSection = document.querySelector('.popular-products');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    if (track && popularProductsSection) {
        let currentIndex = 0;
        const items = track.querySelectorAll('.carousel-item');
        const gap = 20; // 20px gap defined in CSS
        let autoPlayInterval;
        let pauseTimeout;

        function getItemsPerView() {
            const width = window.innerWidth;
            if (width <= 600) return 1;
            if (width <= 900) return 2;
            return 3;
        }

        function slideNext() {
            const itemsPerView = getItemsPerView();
            const maxIndex = items.length - itemsPerView;

            if (currentIndex >= maxIndex) {
                currentIndex = 0; // Loop to start
            } else {
                currentIndex++;
            }
            updateCarouselPosition();
        }

        function slidePrev() {
            const itemsPerView = getItemsPerView();
            const maxIndex = items.length - itemsPerView;

            if (currentIndex <= 0) {
                currentIndex = maxIndex; // Loop to end
            } else {
                currentIndex--;
            }
            updateCarouselPosition();
        }

        function updateCarouselPosition() {
            const itemWidth = items[0].getBoundingClientRect().width;
            const moveDistance = (itemWidth + gap) * currentIndex;
            track.style.transform = `translateX(-${moveDistance}px)`;
        }

        function startCarousel() {
            // Only start if not already playing and not manually paused
            if (!autoPlayInterval && !pauseTimeout) {
                autoPlayInterval = setInterval(slideNext, 3500);
            }
        }

        function stopCarousel() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }

        function handleManualInteraction() {
            stopCarousel();
            // Clear existing timeout to reset the 15s counter
            if (pauseTimeout) clearTimeout(pauseTimeout);
            
            // Pause auto-rotation for 15 seconds after manual interaction
            pauseTimeout = setTimeout(() => {
                pauseTimeout = null;
                // Check if still in view before restarting
                const rect = popularProductsSection.getBoundingClientRect();
                const inView = (rect.top <= window.innerHeight && rect.bottom >= 0);
                if (inView) startCarousel();
            }, 15000);
        }

        // Event Listeners for Arrows
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                slideNext();
                handleManualInteraction();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                slidePrev();
                handleManualInteraction();
            });
        }

        // Use IntersectionObserver to play animation ONLY when in view
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCarousel();
                } else {
                    stopCarousel();
                }
            });
        }, observerOptions);

        observer.observe(popularProductsSection);

        // Pause on mouse hover (doesn't trigger the 15s pause)
        popularProductsSection.addEventListener('mouseenter', stopCarousel);
        popularProductsSection.addEventListener('mouseleave', () => {
            const rect = popularProductsSection.getBoundingClientRect();
            const inView = (rect.top <= window.innerHeight && rect.bottom >= 0);
            if (inView && !pauseTimeout) startCarousel();
        });

        // Reset positions on window resize
        window.addEventListener('resize', () => {
            currentIndex = 0;
            updateCarouselPosition();
        });
    }
});
