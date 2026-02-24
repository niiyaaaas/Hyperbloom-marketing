/* 
  HYPERBLOOM MARKETING AGENCY
  Main Scripts
*/

// Force scroll to top on refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows exactly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with slight delay based on css transition
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards", easing: "ease-out" });
        });

        // Add hover effect for links and buttons
        const interactables = document.querySelectorAll('a, button, .btn');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    } else {
        // Fallback for touch devices or if cursor elements are missing
        document.body.style.cursor = 'auto';
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
        const interactables = document.querySelectorAll('a, button, .btn');
        interactables.forEach(el => {
            el.style.cursor = 'pointer';
        });
    }

    // --- Navbar Scroll Effect & Scroll Progress ---
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
        // Navbar Scrolled State
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Progress Bar
        const totalScroll = document.documentElement.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scroll = `${totalScroll / windowHeight * 100}%`;

        if (scrollProgress) {
            scrollProgress.style.width = scroll;
        }
    });

    // --- Mobile Menu Toggle ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle hamburger icon animation
            const spans = mobileBtn.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile menu when a link is clicked
        const mobileLinks = navLinks.querySelectorAll('.nav-link, .btn');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = mobileBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scrolled-in');

                // Special case for counters
                if (entry.target.classList.contains('counter-item')) {
                    const counter = entry.target.querySelector('.count-val');
                    if (counter && !counter.classList.contains('counted')) {
                        animateCounter(counter);
                        counter.classList.add('counted');
                    }
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => scrollObserver.observe(el));


    // --- Helper function for Counter Animation ---
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        let current = 0;

        const timer = setInterval(() => {
            current += Math.ceil(target / (duration / 50));
            if (current >= target) {
                element.innerText = target;
                clearInterval(timer);
            } else {
                element.innerText = current;
            }
        }, 50);
    }

    // --- Testimonial Slider ---
    const slides = document.querySelectorAll(".testimonial-slide");
    const dots = document.querySelectorAll(".dot");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        const goToSlide = (n) => {
            if (slides[currentSlide]) slides[currentSlide].classList.remove("active");
            if (dots[currentSlide]) dots[currentSlide].classList.remove("active");

            currentSlide = (n + slides.length) % slides.length;

            if (slides[currentSlide]) slides[currentSlide].classList.add("active");
            if (dots[currentSlide]) dots[currentSlide].classList.add("active");
        }

        const nextSlide = () => goToSlide(currentSlide + 1);
        const prevSlide = () => goToSlide(currentSlide - 1);

        if (prevBtn) prevBtn.addEventListener("click", () => {
            prevSlide();
            resetInterval();
        });

        if (nextBtn) nextBtn.addEventListener("click", () => {
            nextSlide();
            resetInterval();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                goToSlide(index);
                resetInterval();
            });
        });

        const startInterval = () => {
            slideInterval = setInterval(nextSlide, 5000);
        }

        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        }

        startInterval();
    }

    // --- Contact Form ---
    const form = document.getElementById("contactForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const btn = form.querySelector(".submit-btn");
            const originalText = btn.innerHTML;

            btn.innerHTML = "<span class=\"btn-text\">Sending...</span>";
            btn.style.opacity = "0.7";

            setTimeout(() => {
                btn.innerHTML = "<span class=\"btn-text\">Request Sent!</span><span class=\"btn-icon\">✓</span>";
                btn.style.opacity = "1";
                btn.classList.remove("btn-primary");
                btn.style.background = "#22c55e";
                btn.style.borderColor = "#22c55e";

                form.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = "";
                    btn.style.borderColor = "";
                    btn.classList.add("btn-primary");
                }, 3000);
            }, 1500);
        });
    }

    // Set Copyright Year dynamically
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});
