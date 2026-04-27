document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       PRINTING PRESS LOADING SCREEN
       ========================================================================== */
    const loader = document.getElementById('loader');
    setTimeout(() => {
        if(loader) {
            loader.classList.add('loaded');
            playSound(600, 'triangle', 0.2); 
        }
    }, 2000);

    /* ==========================================================================
       SCROLL OBSERVER POP-IN ANIMATIONS
       ========================================================================== */
    const observerOptions = { root: null, rootMargin: '-50px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.pop-in');
    hiddenElements.forEach(el => observer.observe(el));

    /* ==========================================================================
       AUDIO SYNTHESIZER
       ========================================================================== */
    let audioCtx = null;
    let isMuted = false;
    const muteToggle = document.getElementById('mute-toggle');

    muteToggle.addEventListener('click', (e) => {
        e.preventDefault();
        isMuted = !isMuted;
        const icon = muteToggle.querySelector('i');
        if(isMuted) {
            icon.classList.remove('fa-volume-up');
            icon.classList.add('fa-volume-mute');
        } else {
            icon.classList.remove('fa-volume-mute');
            icon.classList.add('fa-volume-up');
            if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    });

    function playSound(freq = 400, type = 'square', duration = 0.1, isNoise = false) {
        if(isMuted) return;
        if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if(audioCtx.state === 'suspended') audioCtx.resume();

        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        gainNode.connect(audioCtx.destination);

        if(isNoise) {
            const bufferSize = audioCtx.sampleRate * duration;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const noiseSource = audioCtx.createBufferSource();
            noiseSource.buffer = buffer;
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 1000;
            noiseSource.connect(filter);
            filter.connect(gainNode);
            noiseSource.start();
        } else {
            const oscillator = audioCtx.createOscillator();
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
            oscillator.connect(gainNode);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + duration);
        }
    }

    /* ==========================================================================
       KONAMI CODE EASTER EGG
       ========================================================================== */
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    const konamiOverlay = document.getElementById('konami-overlay');
    const confettiContainer = document.getElementById('confetti-container');

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase() || e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateGodMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateGodMode() {
        konamiOverlay.classList.add('active');
        playSound(800, 'square', 1.0); 
        
        for(let i=0; i<50; i++) {
            const conf = document.createElement('div');
            conf.classList.add('confetti');
            conf.style.left = Math.random() * 100 + 'vw';
            conf.style.backgroundColor = ['var(--c-red)', 'var(--c-yellow)', 'var(--c-blue)', 'var(--c-white)'][Math.floor(Math.random()*4)];
            conf.style.animationDelay = (Math.random() * 0.5) + 's';
            confettiContainer.appendChild(conf);
        }

        setTimeout(() => {
            konamiOverlay.classList.remove('active');
            confettiContainer.innerHTML = '';
        }, 4000);
    }

    /* ==========================================================================
       CUSTOM CURSOR & SPOTLIGHT
       ========================================================================== */
    const cursor = document.getElementById('custom-cursor');
    const spotlight = document.getElementById('spotlight');
    let mouseX = window.innerWidth/2;
    let mouseY = window.innerHeight/2;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        spotlight.style.setProperty('--mouse-x', mouseX + 'px');
        spotlight.style.setProperty('--mouse-y', mouseY + 'px');
    });

    const hoverElements = document.querySelectorAll('a, button, .secret-card, .project-card, input, textarea, svg');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    /* ==========================================================================
       NEURAL NETWORK COMIC CANVAS
       ========================================================================== */
    const canvas = document.getElementById('neural-canvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        function resizeCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1;
                this.vy = (Math.random() - 0.5) * 1;
                this.radius = Math.random() * 3 + 2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#ffffff' : '#111111';
                ctx.fill();
            }
        }

        for (let i = 0; i < 40; i++) particles.push(new Particle());

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            const isDark = document.body.classList.contains('dark-mode');
            
            particles.forEach(p => {
                p.update();
                p.draw();
                
                // Connect to mouse
                const dxMouse = mouseX - p.x;
                const dyMouse = mouseY - p.y;
                const distMouse = Math.sqrt(dxMouse*dxMouse + dyMouse*dyMouse);
                if (distMouse < 200) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.strokeStyle = isDark ? `rgba(255,255,255, ${1 - distMouse/200})` : `rgba(17,17,17, ${1 - distMouse/200})`;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }

                // Connect to other particles
                particles.forEach(p2 => {
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = isDark ? `rgba(255,255,255, ${(1 - dist/120)*0.5})` : `rgba(17,17,17, ${(1 - dist/120)*0.5})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
            });
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }

    /* ==========================================================================
       MAGNETIC BUTTONS
       ========================================================================== */
    const magneticButtons = document.querySelectorAll('.comic-btn');
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            btn.style.boxShadow = `${8 - (x * 0.1)}px ${8 - (y * 0.1)}px 0 var(--c-dark)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.boxShadow = '';
        });
    });

    /* ==========================================================================
       HERO 3D PARALLAX
       ========================================================================== */
    const parallaxContainer = document.getElementById('parallax-container');
    const layers = document.querySelectorAll('.parallax-layer');

    if(parallaxContainer) {
        parallaxContainer.addEventListener('mousemove', (e) => {
            const rect = parallaxContainer.getBoundingClientRect();
            const moveX = (e.clientX - rect.left - rect.width / 2);
            const moveY = (e.clientY - rect.top - rect.height / 2);

            layers.forEach(layer => {
                const speed = layer.getAttribute('data-speed');
                layer.style.transform = `translateX(${(moveX * speed) / 1000}px) translateY(${(moveY * speed) / 1000}px)`;
            });
        });
        parallaxContainer.addEventListener('mouseleave', () => {
            layers.forEach(layer => layer.style.transform = `translateX(0px) translateY(0px)`);
        });
    }

    /* ==========================================================================
       COMIC CONTACT FORM SUBMIT (PAPER AIRPLANE)
       ========================================================================== */
    const contactForm = document.getElementById('comic-contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            contactForm.classList.add('fly-away');
            playSound(600, 'sine', 0.8); 
            
            const successMsg = document.createElement('div');
            successMsg.classList.add('form-success-message');
            successMsg.innerText = "SIGNAL SENT!";
            contactForm.parentElement.appendChild(successMsg);
            
            setTimeout(() => successMsg.classList.add('show'), 100);
            
            setTimeout(() => {
                successMsg.classList.remove('show');
                contactForm.reset();
                contactForm.classList.remove('fly-away');
                setTimeout(() => successMsg.remove(), 500);
            }, 3000);
        });
    }

    /* ==========================================================================
       MULTIVERSE GLITCH BUTTON
       ========================================================================== */
    const glitchBtn = document.getElementById('glitch-btn');
    glitchBtn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        document.body.classList.add('glitching');
        
        let count = 0;
        let glitchInterval = setInterval(() => {
            playSound(Math.random() * 800 + 200, 'sawtooth', 0.05);
            count++;
            if(count > 10) clearInterval(glitchInterval);
        }, 100);
        setTimeout(() => document.body.classList.remove('glitching'), 3000);
    });

    /* ==========================================================================
       NIGHT CITY DARK MODE TOGGLE
       ========================================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const heroAvatar = document.querySelector('.comic-avatar');
    
    themeToggle.addEventListener('click', (e) => {
        e.preventDefault(); document.body.classList.toggle('dark-mode');
        const icon = themeToggle.querySelector('i');
        if(document.body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            if(heroAvatar) heroAvatar.src = 'avatar-night.png';
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            if(heroAvatar) heroAvatar.src = 'avatar.png';
        }
        playSound(200, 'sine', 0.1);
    });

    /* ==========================================================================
       COMIC CLICK ACTION WORDS
       ========================================================================== */
    const actionWords = ["BAM!", "POW!", "ZAP!", "BOOM!", "CRACK!", "SMASH!", "WHAM!"];
    const actionLayer = document.getElementById('action-layer');
    const colors = ["var(--c-red)", "var(--c-blue)", "var(--c-yellow)"];

    document.addEventListener('click', (e) => {
        if(e.target.closest('a') || e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea') || e.target.closest('svg')) {
            if(e.target.closest('a') || e.target.closest('button') || e.target.closest('svg')) playSound(600, 'sine', 0.05);
            return;
        }

        const word = actionWords[Math.floor(Math.random() * actionWords.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const span = document.createElement('span');
        span.classList.add('floating-action');
        span.innerText = word;
        span.style.left = `${e.clientX - 40}px`;
        span.style.top = `${e.clientY - 20}px`;
        span.style.color = color;
        span.style.setProperty('--final-rot', `${Math.floor(Math.random() * 40) - 20}deg`);

        actionLayer.appendChild(span);
        playSound(300, 'sawtooth', 0.15); 
        setTimeout(() => span.remove(), 500);
    });

    /* ==========================================================================
       PAGE FLIP WIPE SCROLLING
       ========================================================================== */
    const pageWipe = document.getElementById('page-wipe');
    const navLinksList = document.querySelectorAll('.nav-link');

    navLinksList.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if(targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if(targetSection) {
                    pageWipe.classList.add('animating');
                    playSound(800, 'triangle', 0.2); 
                    setTimeout(() => window.scrollTo({ top: targetSection.offsetTop, behavior: 'auto' }), 300);
                    setTimeout(() => pageWipe.classList.remove('animating'), 800);
                }
            }
        });
    });

    /* ==========================================================================
       DYNAMIC SPEECH BUBBLES
       ========================================================================== */
    const speechText = document.getElementById('hero-speech');
    const thoughts = ["Ready for a new mission!", "Currently debugging...", "Building proof of work.", "Refactoring the universe...", "Just one more line of code..."];
    let thoughtIndex = 0;
    if(speechText) {
        setInterval(() => {
            thoughtIndex = (thoughtIndex + 1) % thoughts.length;
            speechText.style.opacity = 0;
            setTimeout(() => {
                speechText.innerText = thoughts[thoughtIndex];
                speechText.style.opacity = 1;
            }, 300);
        }, 4000);
    }

    /* ==========================================================================
       SECRET UNLOCKABLE PANEL
       ========================================================================== */
    const secretCard = document.getElementById('secret-cert');
    if(secretCard) {
        secretCard.addEventListener('click', () => {
            const overlay = secretCard.querySelector('.secret-overlay');
            if(overlay && !overlay.classList.contains('revealed')) {
                overlay.classList.add('revealed');
                playSound(1000, 'square', 0.3); 
            }
        });
    }

    /* ==========================================================================
       "TO BE CONTINUED" PAPER RIP TELEPORT
       ========================================================================== */
    const teleportBtn = document.getElementById('teleport-btn');
    const ripContainer = document.getElementById('paper-rip-container');
    if(teleportBtn && ripContainer) {
        teleportBtn.addEventListener('click', () => {
            ripContainer.classList.add('active');
            playSound(0, 'noise', 0.6, true); 
            setTimeout(() => ripContainer.classList.add('tearing'), 50);
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'auto' }), 600);
            setTimeout(() => {
                ripContainer.classList.remove('active');
                ripContainer.classList.remove('tearing');
            }, 2500);
        });
    }

    /* ==========================================================================
       MOBILE MENU
       ========================================================================== */
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    hamburger.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        playSound(400, 'sine', 0.1);
    });

});
