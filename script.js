// test trigger inside updateCountdown function
const NEW_YEAR_MESSAGE = `madari porte bos 🤬, programmer hote hobe 🤬 --- message from omi ---`; // Add your personalized message here

// ===== Configuration =====
const canvas = document.getElementById('celebrationCanvas');
const ctx = canvas.getContext('2d');
const heartsContainer = document.getElementById('heartsContainer');
const popupOverlay = document.getElementById('popupOverlay');
const popupMessage = document.getElementById('popupMessage');

let fireworks = [];
let particles = [];
let mouseX = 0;
let mouseY = 0;
let celebrationActive = false;

// ===== Automatic Timezone Detection =====
function getNextNewYear() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const nextYear = currentYear + 1;

    // Create New Year date in user's local timezone
    const newYear = new Date(2026, 0, 1, 0, 0, 0, 0);

    // Update year display
    document.getElementById('yearDisplay').textContent = nextYear;

    return newYear;
}

// ===== Countdown Timer =====
function updateCountdown() {
    const now = new Date();
    const newYear = getNextNewYear();
    const timeDifference = newYear - now;

    // Check if New Year has arrived
    if (timeDifference <= 0) {
        triggerCelebration();
        return;
    }


    // test trigger 

    //triggerCelebration();
    // Calculate time units
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // Update display with zero-padding
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// ===== Celebration Effects =====
function triggerCelebration() {
    if (celebrationActive) return;

    celebrationActive = true;
    canvas.classList.add('active');

    // Resize canvas
    resizeCanvas();

    // Show popup message
    setTimeout(() => {
        popupMessage.innerHTML = NEW_YEAR_MESSAGE || "Wishing you a year filled with love, joy, and endless possibilities! 🌹💕";
        popupOverlay.classList.add('active');
    }, 2000);

    // Start fireworks animation
    animateCelebration();

    // Create screen flash effect
    document.body.style.animation = 'flash 0.5s ease-out';
}

// ===== Canvas Setup =====
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// ===== Firework Class =====
class Firework {
    constructor(x, y) {
        this.x = x || Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = y || Math.random() * canvas.height * 0.5;
        this.speed = 5 + Math.random() * 3;
        this.color = this.getRandomColor();
        this.exploded = false;
    }

    getRandomColor() {
        const colors = ['#DC143C', '#FF69B4', '#FFD700', '#FF1493', '#CD5C5C', '#FFA500'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        if (!this.exploded) {
            this.y -= this.speed;

            if (this.y <= this.targetY) {
                this.exploded = true;
                createParticles(this.x, this.y, this.color);
            }
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
}

// ===== Particle Class =====
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.alpha = 1;
        this.decay = 0.015;
        this.size = 2 + Math.random() * 3;
    }

    update() {
        this.velocity.y += 0.1; // Gravity
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
}

// ===== Create Particles =====
function createParticles(x, y, color) {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y, color));
    }
}

// ===== Animation Loop =====
function animateCelebration() {
    if (!celebrationActive) return;

    ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create new fireworks
    if (Math.random() < 0.1) {
        fireworks.push(new Firework());
    }

    // Update and draw fireworks
    fireworks = fireworks.filter(firework => !firework.exploded);
    fireworks.forEach(firework => {
        firework.update();
        firework.draw();
    });

    // Update and draw particles
    particles = particles.filter(particle => particle.alpha > 0);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animateCelebration);
}

// ===== Floating Hearts =====
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = ['❤️', '💕', '💖', '💗', '🌹'][Math.floor(Math.random() * 5)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (5 + Math.random() * 5) + 's';
    heart.style.animationDelay = Math.random() * 5 + 's';
    heart.style.fontSize = (1 + Math.random() * 1.5) + 'rem';

    heartsContainer.appendChild(heart);

    // Remove after animation
    setTimeout(() => {
        heart.remove();
    }, 15000);
}

// ===== Mouse Parallax Effect =====
function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const decorations = document.querySelectorAll('.decoration');
    decorations.forEach((decoration, index) => {
        const speed = (index + 1) * 0.015;
        const x = (window.innerWidth - mouseX * speed) / 90;
        const y = (window.innerHeight - mouseY * speed) / 90;

        decoration.style.transform = `translate(${x}px, ${y}px)`;
    });
}

// ===== Touch Support =====
function handleTouch(e) {
    const touch = e.touches[0];
    mouseX = touch.clientX;
    mouseY = touch.clientY;

    handleMouseMove({ clientX: mouseX, clientY: mouseY });
}

// ===== Initialize =====
function init() {
    // Start countdown
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Create initial floating hearts
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createFloatingHeart(), i * 500);
    }

    // Keep creating hearts periodically
    setInterval(createFloatingHeart, 3000);

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouch);
    window.addEventListener('resize', () => {
        if (celebrationActive) {
            resizeCanvas();
        }
    });

    // Close popup on click
    popupOverlay.addEventListener('click', () => {
        popupOverlay.classList.remove('active');
    });
}

// ===== Add Flash Animation to CSS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes flash {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; background: radial-gradient(circle, rgba(220, 20, 60, 0.3) 0%, transparent 70%); }
    }
`;
document.head.appendChild(style);

// ===== Start Application =====
init();



