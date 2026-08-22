/**
 * ARCHIK ARCHITECTURE & DESIGN - MAIN JS
 * Interactive features, slider, portfolio filter, modal lightbox, form handler.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Preloader Handler ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 600);
        });
        // Fallback timeout in case window.load fires early/late
        setTimeout(() => {
            if (preloader.style.opacity !== '0') {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }
        }, 2000);
    }

    // --- 2. Sticky Navbar & Scroll Top Button ---
    const header = document.getElementById('siteHeader');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }

        // Active link indicator on scroll
        updateActiveNavLink();
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- 3. Mobile Navigation Drawer ---
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerClose = document.getElementById('drawerClose');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    if (mobileToggle && mobileDrawer) {
        mobileToggle.addEventListener('click', () => {
            mobileDrawer.classList.add('open');
        });

        drawerClose.addEventListener('click', () => {
            mobileDrawer.classList.remove('open');
        });

        drawerLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.remove('open');
            });
        });
    }

    // --- 4. Hero Slider Implementation ---
    const slides = document.querySelectorAll('.hero-slider .slide');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsContainer = document.getElementById('sliderDots');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0) {
        // Create navigation dots
        slides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(idx));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.slider-dots .dot');

        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            
            currentSlide = (index + slides.length) % slides.length;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });

        function startInterval() {
            slideInterval = setInterval(nextSlide, 6000);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }

        startInterval();
    }

    // --- 5. Portfolio Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // --- 6. Lightbox Modal Details Viewer ---
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalImg = document.getElementById('modalImg');
    const modalTag = document.getElementById('modalTag');
    const modalTitle = document.getElementById('modalTitle');
    const modalLocation = document.getElementById('modalLocation');
    const modalYear = document.getElementById('modalYear');
    const modalArea = document.getElementById('modalArea');

    const viewBtns = document.querySelectorAll('.portfolio-item');

    viewBtns.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.getAttribute('data-img');
            const title = item.getAttribute('data-title');
            const loc = item.getAttribute('data-location');
            const year = item.getAttribute('data-year');
            const area = item.getAttribute('data-area');
            const cat = item.querySelector('.port-cat').textContent;

            modalImg.src = img;
            modalTag.textContent = cat;
            modalTitle.textContent = title;
            modalLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${loc}`;
            modalYear.textContent = year;
            modalArea.textContent = area;

            modal.classList.add('open');
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    function closeModal() {
        if (modal) modal.classList.remove('open');
    }
    window.closeModal = closeModal;

    // --- 7. Animated Counter for Stats ---
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;

    function countStats() {
        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;

        const sectionPos = statsSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight / 1.2;

        if (sectionPos < screenPos && !counted) {
            counted = true;
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const duration = 2000;
                const stepTime = 30;
                const steps = duration / stepTime;
                const increment = target / steps;
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target >= 1000 ? target.toLocaleString('fr-FR') + '+' : target + (target === 99 ? '%' : '+');
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current).toLocaleString('fr-FR');
                    }
                }, stepTime);
            });
        }
    }

    window.addEventListener('scroll', countStats);

    // --- 8. Contact Form Handling & Toast Notifications ---
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !phone || !message) {
                showToast("Veuillez remplir tous les champs obligatoires (*).", "error");
                return;
            }

            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Envoi en cours...</span> <i class="fas fa-spinner fa-spin"></i>`;

            // Simulate form submission to backend
            setTimeout(() => {
                showToast(`Merci ${name} ! Votre message a été transmis à l'équipe Archik Agadir. Nous vous recontacterons sous 24h.`, "success");
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<span>Envoyer le Message</span> <i class="fas fa-paper-plane"></i>`;
            }, 1200);
        });
    }

    function showToast(msg, type = "success") {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.borderColor = type === "error" ? "#ff4d4d" : "var(--accent-gold)";
        
        toast.innerHTML = `
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}" style="color: ${type === 'error' ? '#ff4d4d' : 'var(--accent-gold)'}"></i>
            <div>${msg}</div>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(50px)';
            setTimeout(() => toast.remove(), 400);
        }, 4500);
    }

    // --- 9. Active Nav Item Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
});
