const canvas = _('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

// Handling resizing of canvas
addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init();
});

// Creating mountain range
function createMountainRange(mountainAmount, height, color) {
    for (let i = 0; i < mountainAmount; i++) {
        const mountainWidth = canvas.width / mountainAmount;
        ctx.beginPath();
        ctx.moveTo(i * mountainWidth, canvas.height);
        ctx.lineTo(i * mountainWidth + mountainWidth + 325, canvas.height);
        ctx.lineTo(i * mountainWidth + mountainWidth / 2, canvas.height - height);
        ctx.lineTo(i * mountainWidth - 325, canvas.height);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }
}

// Night Gradient Effect
const backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
backgroundGradient.addColorStop(0, '#171E26');
backgroundGradient.addColorStop(1, '#3F586B');

let stars;
let miniStars;
let backgroundStars;
let frameRate = 0;
let starSpawnRate = 75;
let groundHeight = 100;
function init() {
    stars = [];
    miniStars = [];
    backgroundStars = [];

    for (let i = 0; i < 150; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 3;
        backgroundStars.push(new Star(x, y, radius, '#FFFFFF'));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    backgroundStars.forEach(backgroundStar => {
        backgroundStar.draw();
    });

    createMountainRange(1, canvas.height - 50, '#384551');
    createMountainRange(2, canvas.height - 100, '#2B3843');
    createMountainRange(3, canvas.height - 300, '#26333E');

    ctx.fillStyle = '#182028';
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

    stars.forEach((star, index) => {
        star.update();
        if (star.radius === 0) {
            stars.splice(index, 1);
        }
    });

    miniStars.forEach((miniStar, index) => {
        miniStar.update();
        if (miniStar.startFadeDuration === 0) {
            miniStars.splice(index, 1);
        }
    });

    frameRate++;
    if (frameRate % starSpawnRate === 0) {
        const radius = 12;
        const x = Math.max(radius, Math.random() * canvas.width - radius);
        stars.push(new Star(x, -100, 12, '#FFFFFF'));
        starSpawnRate = randomIntFromRange(75, 200);
    }
}

init();
animate();