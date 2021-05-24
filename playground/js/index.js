let width;
let height;
let mouseX;
let mouseY;
const OBSTACLE_RADIUS = 100;
const creatureColor = ['#1DA1F2', '#F45D22', '#E0245E', '#794BC4', '#FFAD1F', '#17BF63'];
let showTrails = true;


window.onload = function() {
    // Add something on helper functions
    const canvas = document.querySelector('#playground');
    const ctx = canvas.getContext('2d');
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight - 5;

    let creatures = [];
    for (let i = 0; i < 100; i++) {
        creatures.push(new Creature(Math.random() * width, Math.random() * height, 5, getRandomArrayItem(creatureColor)));
    }

    // Mouse event
    // look for box collision for handling mouse events better
    window.addEventListener('mousemove', function(event) {
        mouseX = event.offsetX;
        mouseY = event.offsetY;
    });

    function animate() {

        ctx.fillStyle = `rgba(1, 1, 10, ${showTrails ? '0.2' : '1'})`;
        ctx.fillRect(0,0, width, height);


        for (const creature of creatures) {
            creature.update();
            creature.applySteeringBehavior(creatures);
            creature.checkBorderLine();
            creature.displayCreatures(ctx);
        }

        // mouse area
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.arc(mouseX, mouseY, OBSTACLE_RADIUS, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();

        requestAnimationFrame(animate);
    }

    animate();
}
