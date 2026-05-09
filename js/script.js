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

    // -------------------------
    // Mobile Collage Carousel
    // -------------------------
    const collage = document.querySelector('.collage');
    const dots = document.querySelectorAll('.collage-dot');

    if (collage && dots.length > 0) {
        collage.addEventListener('scroll', () => {
            // Find which item is currently the most prominent based on scroll left
            const itemWidth = collage.offsetWidth;
            const scrollPosition = collage.scrollLeft;
            const currentIndex = Math.round(scrollPosition / itemWidth);

            // Update dots
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        });

        // Auto advanced mobile collage every 4 seconds
        setInterval(() => {
            const itemWidth = collage.offsetWidth;
            const scrollPosition = collage.scrollLeft;
            let currentIndex = Math.round(scrollPosition / itemWidth);
            
            currentIndex++;
            if (currentIndex >= dots.length) {
                currentIndex = 0; // Loop back to start
            }
            
            collage.scrollTo({
                left: currentIndex * itemWidth,
                behavior: 'smooth'
            });
        }, 4000);
    }

    // -------------------------
    // Scroll Entrance Animations
    // -------------------------
    const animatedElements = document.querySelectorAll('.hero-content, .collection-item, .carousel-item, .popular-products h2, .companies-grid, .footer-section');
    
    // Apply starting class to all matched elements immediately
    animatedElements.forEach(el => el.classList.add('animate-on-scroll'));

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Delay the top of the page (hero) to account for initial loading
                const baseDelay = entry.target.classList.contains('hero-content') ? 400 : 0;
                
                // Add staggered delay based on index for simultaneous items
                setTimeout(() => {
                    entry.target.classList.add('is-visible');

                    // If it's the companies grid, trigger the rainbow light-up animation
                    if (entry.target.classList.contains('companies-grid')) {
                        // Wait 1 second after the grid itself fades in
                        setTimeout(() => {
                            const logos = entry.target.querySelectorAll('.company-logo img');
                            logos.forEach((logo, i) => {
                                // Stagger the light-up for each logo
                                setTimeout(() => {
                                    logo.classList.add('color-flash');
                                }, i * 200); // 200ms delay between each logo starting
                            });
                        }, 1000); // 1 second wait
                    }

                }, baseDelay + (index * 150));
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    animatedElements.forEach(el => animationObserver.observe(el));

    // -------------------------
    // Customizer Modal Logic
    // -------------------------
    const btnCustomize = document.querySelector('.btn-customize');
    const customizerModal = document.getElementById('customizerModal');
    const closeModal = document.querySelector('.close-modal');
    const designUpload = document.getElementById('designUpload');
    const uploadedDesign = document.getElementById('uploadedDesign');
    const draggableContainer = document.getElementById('draggableContainer');
    const submitDesignBtn = document.getElementById('submitDesignBtn');
    const resizeHandle = document.getElementById('resizeHandle');
    const customizerWorkspace = document.getElementById('customizerWorkspace');

    if (btnCustomize && customizerModal) {
        btnCustomize.addEventListener('click', () => {
            customizerModal.classList.add('show');
        });

        closeModal.addEventListener('click', () => {
            customizerModal.classList.remove('show');
        });

        submitDesignBtn.addEventListener('click', () => {
            customizerModal.classList.remove('show');
            btnCustomize.textContent = 'CHANGE DESIGN';
            btnCustomize.style.backgroundColor = 'var(--color-accent)';
            btnCustomize.style.borderColor = 'var(--color-accent)';
        });

        // Close when clicking outside of modal
        window.addEventListener('click', (e) => {
            if (e.target === customizerModal) {
                customizerModal.classList.remove('show');
            }
        });

        // Handle Image Upload
        designUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    uploadedDesign.src = event.target.result;
                    draggableContainer.style.display = 'block';
                    
                    // Reset position and default starting size 
                    draggableContainer.style.top = '25%';
                    draggableContainer.style.left = '25%';
                    draggableContainer.style.width = '50%';
                    draggableContainer.style.height = '50%';
                };
                reader.readAsDataURL(file);
            }
        });

        // Dragging Logic
        let isDragging = false;
        let startX, startY, initialTop, initialLeft;

        function dragStart(e) {
            if (e.target === resizeHandle) return; // Ignore if resizing
            isDragging = true;
            // Support both touch and mouse
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            
            startX = clientX;
            startY = clientY;
            
            const rect = draggableContainer.getBoundingClientRect();
            const parentRect = customizerWorkspace.getBoundingClientRect();
            
            initialLeft = rect.left - parentRect.left;
            initialTop = rect.top - parentRect.top;
        }

        function dragAction(e) {
            if (isDragging) {
                // e.preventDefault(); // Prevent scrolling on mobile while dragging
                const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
                
                const dx = clientX - startX;
                const dy = clientY - startY;
                draggableContainer.style.left = `${initialLeft + dx}px`;
                draggableContainer.style.top = `${initialTop + dy}px`;
            }
        }

        function dragEnd() {
            isDragging = false;
        }

        draggableContainer.addEventListener('mousedown', dragStart);
        draggableContainer.addEventListener('touchstart', dragStart, {passive: false});

        window.addEventListener('mousemove', dragAction);
        window.addEventListener('touchmove', dragAction, {passive: false});

        window.addEventListener('mouseup', dragEnd);
        window.addEventListener('touchend', dragEnd);

        // Resizing Logic
        let isResizing = false;
        let startWidth, startHeight;

        if (resizeHandle) {
            function resizeStart(e) {
                e.preventDefault(); // Prevent text selection/scrolling
                e.stopPropagation();
                isResizing = true;
                const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
                
                startX = clientX;
                startY = clientY;
                startWidth = draggableContainer.offsetWidth;
                startHeight = draggableContainer.offsetHeight;
            }

            function resizeAction(e) {
                if (isResizing) {
                    // e.preventDefault(); // Prevent scrolling
                    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
                    
                    const dx = clientX - startX;
                    const dy = clientY - startY;
                    
                    // Maintain aspect ratio 1:1
                    const newSize = Math.max(50, startWidth + Math.max(dx, dy));
                    
                    draggableContainer.style.width = `${newSize}px`;
                    draggableContainer.style.height = `${newSize}px`;
                }
            }

            function resizeEnd() {
                isResizing = false;
            }

            resizeHandle.addEventListener('mousedown', resizeStart);
            resizeHandle.addEventListener('touchstart', resizeStart, {passive: false});

            window.addEventListener('mousemove', resizeAction);
            window.addEventListener('touchmove', resizeAction, {passive: false});

            window.addEventListener('mouseup', resizeEnd);
            window.addEventListener('touchend', resizeEnd);
        }
    }

});
