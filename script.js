document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------------------
    // Preloader
    // -----------------------------------------------------------------------
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const hidePreloader = () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 500);
        };
        if (document.readyState === 'complete') {
            hidePreloader();
        } else {
            window.addEventListener('load', hidePreloader);
        }
    }

    // -----------------------------------------------------------------------
    // Navbar Scroll Effect
    // -----------------------------------------------------------------------
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('glass-nav', 'shadow-lg');
            navbar.classList.remove('py-4');
            navbar.classList.add('py-2');
        } else {
            navbar.classList.remove('glass-nav', 'shadow-lg');
            navbar.classList.remove('py-2');
            navbar.classList.add('py-4');
        }
    });

    // -----------------------------------------------------------------------
    // Mobile Menu Toggle
    // -----------------------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        mobileMenu.classList.toggle('translate-x-full');
        document.body.classList.toggle('overflow-hidden');
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', toggleMenu);
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('translate-x-full')) {
                toggleMenu();
            }
        });
    });

    // -----------------------------------------------------------------------
    // Back to Top Button
    // -----------------------------------------------------------------------
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.remove('hidden', 'opacity-0', 'translate-y-10');
            backToTopBtn.classList.add('flex', 'opacity-100', 'translate-y-0');
        } else {
            backToTopBtn.classList.add('opacity-0', 'translate-y-10');
            backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
            // Wait for transition to finish before hiding
            setTimeout(() => {
                if (window.scrollY <= 500) {
                    backToTopBtn.classList.add('hidden');
                    backToTopBtn.classList.remove('flex');
                }
            }, 300);
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // -----------------------------------------------------------------------
    // Update Copyright Year
    // -----------------------------------------------------------------------
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // -----------------------------------------------------------------------
    // Contact Form Handling (AJAX via Web3Forms)
    // -----------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');
    const originalBtnContent = submitBtn.innerHTML;

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Simple Client-side Validation (HTML5 'required' handles most)
            const formData = new FormData(contactForm);
            
            // Convert FormData to JSON object for Web3Forms
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                });

                const result = await response.json();

                formMessage.classList.remove('hidden', 'bg-red-500/20', 'text-red-400', 'bg-green-500/20', 'text-green-400');

                if (response.status === 200 || result.success) {
                    formMessage.classList.add('bg-green-500/20', 'text-green-400');
                    formMessage.innerHTML = `<i class="fa-solid fa-check-circle mr-2"></i> Thank you! Your message has been sent successfully.`;
                    contactForm.reset();
                } else {
                    throw new Error(result.message || 'Something went wrong.');
                }
            } catch (error) {
                formMessage.classList.add('bg-red-500/20', 'text-red-400');
                formMessage.innerHTML = `<i class="fa-solid fa-circle-exclamation mr-2"></i> ${error.message}`;
            } finally {
                formMessage.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;

                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.classList.add('hidden');
                }, 5000);
            }
        });
    }

    // -----------------------------------------------------------------------
    // Active Link Highlighting (ScrollSpy)
    // -----------------------------------------------------------------------
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a:not([href="#contact"]), #mobile-menu .mobile-link:not([href="#contact"])');

    let sectionPositions = [];
    function calculatePositions() {
        sectionPositions = Array.from(sections).map(section => ({
            id: section.getAttribute('id'),
            top: section.offsetTop
        }));
    }
    calculatePositions();
    window.addEventListener('resize', calculatePositions);

    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                let current = '';
                const scrollY = window.scrollY || window.pageYOffset;
                
                sectionPositions.forEach(sec => {
                    if (scrollY >= (sec.top - 250)) {
                        current = sec.id;
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('text-brand-400');
                    link.classList.add('text-gray-300');
                    if (link.getAttribute('href') === `#${current}`) {
                        link.classList.add('text-brand-400');
                        link.classList.remove('text-gray-300');
                    }
                });
                
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    // -----------------------------------------------------------------------
    // Dynamic Typist (Typing Animation)
    // -----------------------------------------------------------------------
    const words = ['Full Stack Developer', 'IT Student', 'Problem Solver', 'UI/UX Enthusiast'];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typingSpan = document.getElementById('typing-text');
    
    function type() {
        if (!typingSpan) return;
        const currentWord = words[wordIdx];
        if (isDeleting) {
            typingSpan.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typingSpan.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
        }
        
        let typeSpeed = isDeleting ? 40 : 80;
        
        if (!isDeleting && charIdx === currentWord.length) {
            typeSpeed = 1500; // Pause at the end of word
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            typeSpeed = 300; // Pause before starting next word
        }
        
        setTimeout(type, typeSpeed);
    }
    type();

    // -----------------------------------------------------------------------
    // Custom Interactive Cursor Follower & Ambient Spotlights
    // -----------------------------------------------------------------------
    const cursorDot = document.getElementById('custom-cursor-dot');
    const cursorRing = document.getElementById('custom-cursor-ring');
    const ambientGlow = document.getElementById('ambient-glow');
    
    // Only initialize custom cursor on devices that support hover (non-touch)
    if (cursorDot && cursorRing && window.matchMedia('(hover: hover)').matches) {
        document.documentElement.classList.add('has-custom-cursor');
        
        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;
        let isMoving = false;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!isMoving) {
                cursorDot.style.opacity = '1';
                cursorRing.style.opacity = '1';
                isMoving = true;
            }
            
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
            
            // Ambient glow coordinates update
            if (ambientGlow) {
                ambientGlow.style.setProperty('--mouse-x', `${mouseX}px`);
                ambientGlow.style.setProperty('--mouse-y', `${mouseY}px`);
                if (ambientGlow.style.opacity === '0' || !ambientGlow.style.opacity) {
                    ambientGlow.style.opacity = '1';
                }
            }
        });
        
        // Loop to animate ring with elastic physics (lerping)
        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            
            requestAnimationFrame(animateRing);
        }
        animateRing();
        
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorRing.style.opacity = '0';
            isMoving = false;
            if (ambientGlow) ambientGlow.style.opacity = '0';
        });
        
        document.addEventListener('mousedown', () => {
            cursorRing.style.transform = 'translate(-50%, -50%) scale(0.65)';
        });
        document.addEventListener('mouseup', () => {
            cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        // Attach cursor states for clickable items
        function updateHoverTargets() {
            const hoverTargets = document.querySelectorAll('a, button, input, textarea, [role="button"], .magnetic-wrap, .glow-card');
            hoverTargets.forEach(target => {
                // Remove existing to avoid multiple listeners if updated dynamically
                target.removeEventListener('mouseenter', onMouseEnterTarget);
                target.removeEventListener('mouseleave', onMouseLeaveTarget);
                
                target.addEventListener('mouseenter', onMouseEnterTarget);
                target.addEventListener('mouseleave', onMouseLeaveTarget);
            });
        }
        
        function onMouseEnterTarget() {
            cursorRing.style.width = '48px';
            cursorRing.style.height = '48px';
            cursorRing.style.backgroundColor = 'rgba(14, 165, 233, 0.12)';
            cursorRing.style.borderColor = '#38bdf8';
            cursorDot.style.backgroundColor = '#38bdf8';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
        }
        
        function onMouseLeaveTarget() {
            cursorRing.style.width = '36px';
            cursorRing.style.height = '36px';
            cursorRing.style.backgroundColor = 'transparent';
            cursorRing.style.borderColor = 'rgba(56, 189, 248, 0.4)';
            cursorDot.style.backgroundColor = '#38bdf8';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        }
        
        updateHoverTargets();
        
        // Re-run hover selector binding when dynamic items load (like contact status replies)
        const observer = new MutationObserver(updateHoverTargets);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // -----------------------------------------------------------------------
    // Scroll-Reveal observer
    // -----------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    // Add dynamic transition delays for staggered container reveals
    revealElements.forEach((el) => {
        const parent = el.parentElement;
        if (parent && (parent.classList.contains('grid') || parent.id === 'services' || parent.id === 'skills' || parent.id === 'projects')) {
            const siblings = Array.from(parent.children).filter(child => child.nodeType === 1);
            const idx = siblings.indexOf(el);
            if (idx !== -1) {
                el.style.transitionDelay = `${idx * 0.08}s`;
            }
        }
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));

    // -----------------------------------------------------------------------
    // 3D Card Hover Tilts & Spotlight glow coordinates
    // -----------------------------------------------------------------------
    // Only apply hover-based 3D tilts and magnetic pull physics on hover-capable devices (mouse)
    if (window.matchMedia('(hover: hover)').matches) {
        const cards = document.querySelectorAll('.tilt-element, .glow-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Set variables relative to card coordinates
                card.style.setProperty('--card-mouse-x', `${x}px`);
                card.style.setProperty('--card-mouse-y', `${y}px`);
                
                // If card has 3D tilt class
                if (card.classList.contains('tilt-element')) {
                    const xc = rect.width / 2;
                    const yc = rect.height / 2;
                    const angleX = (yc - y) / (yc / 8); // Max tilt around 8 degrees
                    const angleY = (x - xc) / (xc / 8);
                    card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (card.classList.contains('tilt-element')) {
                    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                    card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
                }
            });
            
            card.addEventListener('mouseenter', () => {
                if (card.classList.contains('tilt-element')) {
                    card.style.transition = 'none';
                }
            });
        });

        // -----------------------------------------------------------------------
        // Magnetic Pull Physics
        // -----------------------------------------------------------------------
        const magnets = document.querySelectorAll('.magnetic-wrap');
        magnets.forEach(magnet => {
            magnet.addEventListener('mousemove', (e) => {
                const rect = magnet.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                // Translate the element towards the cursor by a fraction of displacement
                magnet.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
            });
            
            magnet.addEventListener('mouseleave', () => {
                magnet.style.transform = 'translate(0px, 0px)';
            });
        });
    }
});
