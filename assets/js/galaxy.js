// assets/js/galaxy.js
// Galaxy background with moving planets

const canvas = document.getElementById('galaxy-canvas');
const ctx = canvas.getContext('2d');

// Responsive canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Starfield
const STAR_COUNT = 200;
const stars = [];
for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        alpha: Math.random() * 0.5 + 0.5
    });
}

// Planet colors
const planetColors = [
    '#f5c542', // yellow
    '#42a7f5', // blue
    '#f542a7', // pink
    '#42f554', // green
    '#f54242', // red
    '#b142f5', // purple
    '#f5e142', // light yellow
    '#42f5e6', // cyan
];

// Planets
const PLANET_COUNT = 10;
const planets = [];
for (let i = 0; i < PLANET_COUNT; i++) {
    const radius = Math.random() * 30 + 20;
    planets.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: radius,
        color: planetColors[Math.floor(Math.random() * planetColors.length)],
        speed: Math.random() * 0.5 + 0.1,
        angle: Math.random() * Math.PI * 2,
        orbitRadius: Math.random() * 100 + 50,
        orbitCenterX: Math.random() * canvas.width,
        orbitCenterY: Math.random() * canvas.height,
        orbitSpeed: (Math.random() - 0.5) * 0.002
    });
}

function drawGalaxyBackground() {
    // Gradient background
    const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.width / 8,
        canvas.width / 2, canvas.height / 2, canvas.width / 1.2
    );
    grad.addColorStop(0, '#1a0033');
    grad.addColorStop(0.5, '#12002a');
    grad.addColorStop(1, '#090013');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawStars() {
    for (const star of stars) {
        ctx.save();
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.restore();
    }
}

function drawPlanets() {
    for (const planet of planets) {
        // Orbit movement
        planet.angle += planet.orbitSpeed;
        planet.x = planet.orbitCenterX + Math.cos(planet.angle) * planet.orbitRadius;
        planet.y = planet.orbitCenterY + Math.sin(planet.angle) * planet.orbitRadius;

        // Draw planet
        ctx.save();
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.r, 0, Math.PI * 2);
        ctx.fillStyle = planet.color;
        ctx.shadowColor = planet.color;
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.restore();
    }
}

function animate() {
    drawGalaxyBackground();
    drawStars();
    drawPlanets();
    requestAnimationFrame(animate);
}

animate();
