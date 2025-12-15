/**
 * Particle Animation System
 * Creates an interactive particle background with floating effect
 */

(function() {
    'use strict';

    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let mouseX = 0;
    let mouseY = 0;
    let isMouseMoving = false;
    let mouseTimeout;

    // Configuration
    const config = {
        particleCount: getParticleCount(),
        particleMinRadius: 1,
        particleMaxRadius: 3,
        particleSpeed: 0.3,
        connectionDistance: 120,
        mouseInfluence: 100,
        colors: [
            'rgba(0, 217, 255, 0.6)',    // Cyan
            'rgba(255, 0, 128, 0.6)',    // Pink  
            'rgba(124, 58, 237, 0.6)',   // Purple
            'rgba(255, 255, 255, 0.4)',  // White
            'rgba(103, 126, 234, 0.5)',  // Blue
        ]
    };

    // Get particle count based on screen size
    function getParticleCount() {
        const width = window.innerWidth;
        if (width < 480) return 30;
        if (width < 768) return 50;
        if (width < 1024) return 70;
        return 100;
    }

    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * (config.particleMaxRadius - config.particleMinRadius) + config.particleMinRadius;
            this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
            this.speedX = (Math.random() - 0.5) * config.particleSpeed;
            this.speedY = (Math.random() - 0.5) * config.particleSpeed;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulseOffset = Math.random() * Math.PI * 2;
        }

        update() {
            // Movement
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            if (isMouseMoving) {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.mouseInfluence) {
                    const force = (config.mouseInfluence - distance) / config.mouseInfluence;
                    this.x -= dx * force * 0.02;
                    this.y -= dy * force * 0.02;
                }
            }

            // Boundary check with wrap around
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;

            // Pulse effect
            this.currentRadius = this.radius + Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset) * 0.5;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.max(0.5, this.currentRadius), 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Initialize canvas
    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Initialize particles
    function initParticles() {
        particles = [];
        config.particleCount = getParticleCount();
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Draw connections between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.connectionDistance) {
                    const opacity = (1 - distance / config.connectionDistance) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections
        drawConnections();

        animationId = requestAnimationFrame(animate);
    }

    // Event listeners
    function setupEventListeners() {
        // Resize handler with debounce
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                initCanvas();
                initParticles();
            }, 250);
        });

        // Mouse move handler
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMouseMoving = true;

            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(function() {
                isMouseMoving = false;
            }, 100);
        });

        // Touch support
        document.addEventListener('touchmove', function(e) {
            if (e.touches.length > 0) {
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
                isMouseMoving = true;

                clearTimeout(mouseTimeout);
                mouseTimeout = setTimeout(function() {
                    isMouseMoving = false;
                }, 100);
            }
        }, { passive: true });

        // Visibility change - pause animation when tab is hidden
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        });
    }

    // Initialize
    function init() {
        initCanvas();
        initParticles();
        setupEventListeners();
        animate();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
