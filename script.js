// ============================================================
// ASSESSORIA VITTUS — Premium Interactive JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------
    // 1. Lucide Icons Initialization
    // ----------------------------------------------------------
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ----------------------------------------------------------
    // 2. Custom Cursor (Luxury Fluid Cursor)
    // ----------------------------------------------------------
    const cursorDot = document.getElementById('cursor-dot');
    const cursorCircle = document.getElementById('cursor-circle');

    if (cursorDot && cursorCircle) {
        const isTouchDevice = window.matchMedia('(hover: none)').matches || window.innerWidth <= 991;

        if (isTouchDevice) {
            cursorDot.style.display = 'none';
            cursorCircle.style.display = 'none';
        } else {
            let mouseX = 0;
            let mouseY = 0;
            let dotX = 0;
            let dotY = 0;
            let circleX = 0;
            let circleY = 0;

            const lerp = (start, end, factor) => start + (end - start) * factor;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }, { passive: true });

            const animateCursor = () => {
                // Dot follows faster (speed 0.35)
                dotX = lerp(dotX, mouseX, 0.35);
                dotY = lerp(dotY, mouseY, 0.35);
                cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;

                // Circle follows slower (speed 0.15)
                circleX = lerp(circleX, mouseX, 0.15);
                circleY = lerp(circleY, mouseY, 0.15);
                cursorCircle.style.transform = `translate(${circleX}px, ${circleY}px)`;

                requestAnimationFrame(animateCursor);
            };

            requestAnimationFrame(animateCursor);

            // Hover expansion on interactive elements
            const interactiveSelectors = 'a, button, .service-card, .about-pillar-card, .case-card, input, select, textarea';
            const interactiveElements = document.querySelectorAll(interactiveSelectors);

            interactiveElements.forEach((el) => {
                el.addEventListener('mouseenter', () => {
                    cursorCircle.classList.add('hover');
                }, { passive: true });
                el.addEventListener('mouseleave', () => {
                    cursorCircle.classList.remove('hover');
                }, { passive: true });
            });
        }
    }

    // ----------------------------------------------------------
    // 3. Hero Particles (Canvas-based Monochrome Dust)
    // ----------------------------------------------------------
    const particleCanvas = document.getElementById('hero-particles');

    if (particleCanvas) {
        const ctx = particleCanvas.getContext('2d');
        let canvasWidth, canvasHeight;
        let particleMouse = { x: -9999, y: -9999 };
        const PARTICLE_COUNT = 60;
        const particles = [];

        const resizeCanvas = () => {
            const parent = particleCanvas.parentElement;
            if (parent) {
                canvasWidth = parent.offsetWidth;
                canvasHeight = parent.offsetHeight;
                particleCanvas.width = canvasWidth;
                particleCanvas.height = canvasHeight;
            }
        };

        const createParticle = () => ({
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight,
            size: Math.random() * 1.5 + 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.3 + 0.1,
        });

        const initParticles = () => {
            particles.length = 0;
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(createParticle());
            }
        };

        // Track mouse position relative to canvas for parallax
        particleCanvas.addEventListener('mousemove', (e) => {
            const rect = particleCanvas.getBoundingClientRect();
            particleMouse.x = e.clientX - rect.left;
            particleMouse.y = e.clientY - rect.top;
        }, { passive: true });

        particleCanvas.addEventListener('mouseleave', () => {
            particleMouse.x = -9999;
            particleMouse.y = -9999;
        }, { passive: true });

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            particles.forEach((p) => {
                // Subtle mouse influence — push particles away
                const dx = p.x - particleMouse.x;
                const dy = p.y - particleMouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const influenceRadius = 120;

                if (dist < influenceRadius && dist > 0) {
                    const force = (influenceRadius - dist) / influenceRadius * 0.15;
                    p.x += (dx / dist) * force;
                    p.y += (dy / dist) * force;
                }

                // Move
                p.x += p.speedX;
                p.y += p.speedY;

                // Wrap around edges
                if (p.x < 0) p.x = canvasWidth;
                if (p.x > canvasWidth) p.x = 0;
                if (p.y < 0) p.y = canvasHeight;
                if (p.y > canvasHeight) p.y = 0;

                // Draw
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                ctx.fill();
            });

            requestAnimationFrame(animateParticles);
        };

        resizeCanvas();
        initParticles();
        requestAnimationFrame(animateParticles);

        window.addEventListener('resize', () => {
            resizeCanvas();
        }, { passive: true });
    }

    // ----------------------------------------------------------
    // 4. Smart Header Hide/Reveal
    // ----------------------------------------------------------
    const header = document.querySelector('header');

    if (header) {
        let lastScrollY = window.scrollY;
        const scrollThreshold = 10;

        const handleHeaderScroll = () => {
            const currentScrollY = window.scrollY;
            const diff = currentScrollY - lastScrollY;

            // Add/remove scrolled class
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide on scroll down, show on scroll up (with threshold)
            if (Math.abs(diff) > scrollThreshold) {
                if (diff > 0 && currentScrollY > 200) {
                    header.classList.add('header-hidden');
                } else if (diff < 0) {
                    header.classList.remove('header-hidden');
                }
                lastScrollY = currentScrollY;
            }
        };

        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    }

    // ----------------------------------------------------------
    // 5. Mobile Navigation Toggle
    // ----------------------------------------------------------
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu on nav link click
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ----------------------------------------------------------
    // 6. Qualification Form (Simple)
    // ----------------------------------------------------------

    // ⚡ GOOGLE SHEETS INTEGRATION
    const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbw8xAmGNz5vy5vSliIwb95rPm85R29Ke7kiZh6u32F73lymaoL3dEGyv02fEgOv1601/exec';

    const form = document.getElementById('qualification-form');
    const btnSubmit = document.getElementById('form-btn-submit');

    if (form && btnSubmit) {
        // Phone Mask: (XX) XXXXX-XXXX
        const phoneInput = document.getElementById('form-phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 11) value = value.slice(0, 11);

                if (value.length > 6) {
                    value = value.replace(/^(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
                } else if (value.length > 2) {
                    value = value.replace(/^(\d{2})(\d{1,5})/, '($1) $2');
                } else if (value.length > 0) {
                    value = value.replace(/^(\d{1,2})/, '($1');
                }

                e.target.value = value;
            });
        }

        const validateEmail = (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        };

        const validateForm = () => {
            const inputs = form.querySelectorAll('input[required], select[required]');
            let isValid = true;

            inputs.forEach((input) => {
                input.classList.remove('input-error');

                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('input-error');
                }

                // Email validation
                if (input.type === 'email' && input.value.trim() && !validateEmail(input.value.trim())) {
                    isValid = false;
                    input.classList.add('input-error');
                }
            });

            return isValid;
        };

        const sendToGoogleSheets = async (formData) => {
            if (!GOOGLE_SHEETS_URL || GOOGLE_SHEETS_URL === 'COLE_SUA_URL_AQUI') return false;
            try {
                await fetch(GOOGLE_SHEETS_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                return true;
            } catch (error) {
                return false;
            }
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!validateForm()) return;

            const originalText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = 'Processando...';
            btnSubmit.disabled = true;

            const name = document.getElementById('form-name')?.value || '';
            const email = document.getElementById('form-email')?.value || '';
            const phone = document.getElementById('form-phone')?.value || '';
            const company = document.getElementById('form-company')?.value || '';
            const segment = document.getElementById('form-segment')?.value || '';
            const revenue = document.getElementById('form-revenue')?.value || '';

            // Data object for Google Sheets
            const formData = {
                timestamp: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
                nome: name,
                email: email,
                telefone: phone,
                empresa: company,
                cnpj: '',
                segmento: segment,
                faturamento: revenue,
                investimento: '',
            };

            // 1) Send to Google Sheets (non-blocking)
            sendToGoogleSheets(formData);

            // 2) Build WhatsApp message
            const message = `🏛️ *NOVA QUALIFICAÇÃO — ASSESSORIA VITTUS*\n\n` +
                `👤 *Nome:* ${name}\n` +
                `📧 *E-mail:* ${email}\n` +
                `📱 *Telefone:* ${phone}\n` +
                `🏢 *Empresa:* ${company}\n` +
                `📊 *Segmento:* ${segment}\n` +
                `💰 *Faturamento:* ${revenue}`;

            const whatsappNumber = '5562994525599';
            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            setTimeout(() => {
                const successPopup = document.getElementById('form-success-popup');
                if (successPopup) {
                    successPopup.style.display = 'flex';
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                    // Esconder o popup depois de 4 segundos
                    setTimeout(() => {
                        successPopup.style.display = 'none';
                    }, 4000);
                }

                window.open(whatsappURL, '_blank');
                
                btnSubmit.innerHTML = originalText;
                btnSubmit.disabled = false;
            }, 1000);
        });
    }

    // ----------------------------------------------------------
    // 7. Reveal Scroll Animations (Intersection Observer)
    // ----------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -40px 0px',
            }
        );

        revealElements.forEach((el) => revealObserver.observe(el));
    }

    // ----------------------------------------------------------
    // 8. Mouse-Tracking Border Glow on Cards
    // ----------------------------------------------------------
    const glowCards = document.querySelectorAll('.service-card, .about-pillar-card');

    glowCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }, { passive: true });
    });

    // ----------------------------------------------------------
    // 9. Scroll-Activated Timeline Progress (Method Section)
    // ----------------------------------------------------------
    const methodContainer = document.querySelector('.method-container');
    const methodLineActive = document.querySelector('.method-line-active');
    const methodStepRows = document.querySelectorAll('.method-step-row');

    if (methodContainer && methodLineActive && methodStepRows.length > 0) {
        const handleMethodScroll = () => {
            const containerRect = methodContainer.getBoundingClientRect();
            const containerTop = containerRect.top;
            const containerHeight = containerRect.height;
            const viewportHeight = window.innerHeight;

            // Calculate how far through the container the user has scrolled
            // 0% when container top is at bottom of viewport
            // 100% when container bottom is at top of viewport
            const scrollStart = viewportHeight;
            const scrollEnd = -containerHeight;
            const scrollRange = scrollStart - scrollEnd;
            const currentPosition = scrollStart - containerTop;

            let progress = (currentPosition / scrollRange) * 100;
            progress = Math.max(0, Math.min(100, progress));

            methodLineActive.style.height = `${progress}%`;

            // Activate step rows based on viewport position
            const activationPoint = viewportHeight * 0.6;

            methodStepRows.forEach((row) => {
                const rowRect = row.getBoundingClientRect();
                if (rowRect.top < activationPoint) {
                    row.classList.add('active');
                } else {
                    row.classList.remove('active');
                }
            });
        };

        window.addEventListener('scroll', handleMethodScroll, { passive: true });
        handleMethodScroll(); // Run once on load
    }

    // ----------------------------------------------------------
    // 10. Active Menu Link Highlighting
    // ----------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navMenuLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    if (sections.length > 0 && navMenuLinks.length > 0) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.getAttribute('id');
                        navMenuLinks.forEach((link) => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${sectionId}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            },
            {
                threshold: 0.2,
                rootMargin: '-20% 0px -60% 0px',
            }
        );

        sections.forEach((section) => sectionObserver.observe(section));
    }

    // ----------------------------------------------------------
    // 11. Smooth Scroll for Anchor Links
    // ----------------------------------------------------------
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth',
            });
        });
    });

}); // END DOMContentLoaded
