let canvas = _('#ecosystem');
let WIDTH = canvas.width = window.innerWidth;
let HEIGHT = canvas.height = 600; // window.innerHeight
let ctx = canvas.getContext('2d');

let MAX_CREATURES = 300;
const REPRODUCTION_RATE = 0.5;

const CREATURE = 'CREATURE';
const PREDATOR = 'PREDATOR';
const AVOIDER = 'AVOIDER';
const EATER = 'EATER';
const FOOD = 'FOOD';
const POISON = 'POISON';

function init() {

    const ecosystem = new Ecosystem();

    ecosystem.addEntities({
        FOOD: [],
        POISON: []
    });


    ecosystem.registerAgents({
        CREATURE: Agent,
        PREDATOR: Predator,
        AVOIDER: Avoider,
        EATER: Eater,
    });


    ecosystem.initialPopulation({
        CREATURE: 150,
        PREDATOR: randomIntFromRange(5, 10),
        AVOIDER: randomIntFromRange(10, 20),
        EATER: randomIntFromRange(1, 4),
    });

    // Manually Adding Creatures to ecosystem
    let add = document.getElementById('addnew');
    canvas.addEventListener('click', function (e) {
        ecosystem.add(add.value, e.offsetX, e.offsetY)
    })

    function populationConstraints() {
        if (randomFromRange(1) < 0.03) addItem(ecosystem.entities.FOOD, 8);
        if (randomFromRange(1) < 0.03) addItem(ecosystem.entities.POISON, 1);

        if (randomFromRange(1) < 0.005) addPredators(ecosystem.groups.PREDATOR, 1);
        if (randomFromRange(1) < 0.005) addAvoiders(ecosystem.groups.AVOIDER, 1);

        if (ecosystem.groups.CREATURE.length < 20) addCreatures(ecosystem.groups.CREATURE, 10);
        if (ecosystem.groups.EATER.length < 1) addEaters(ecosystem.groups.EATER, 1);
        if (ecosystem.entities.FOOD.length < 50) addItem(ecosystem.entities.FOOD, 20);
        if (ecosystem.groups.CREATURE.length > MAX_CREATURES) ecosystem.groups.CREATURE.pop()
    }


    let lastFrame;
    let fps;

    function animate() {
        const HALF_W = WIDTH / 2;
        const HALF_H = HEIGHT / 2;
        let grd = ctx.createRadialGradient(HALF_W, HALF_H, 0, HALF_W, HALF_H, WIDTH);
        grd.addColorStop(0, "rgba(25,25,25,1)");
        grd.addColorStop(1, "rgba(0,0,25,1)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        /**
         * Creature: Good Creature
         * They like food and dislike poison.
         * They avoid Predators and Eaters.
         * They can clone themselves and reproduce.
         */
        ecosystem.addBehavior({
            name: CREATURE,
            like: FOOD,
            dislike: POISON,
            fear: {
                PREDATOR: [-4, 75],
                EATER: [-2, 100]
            },
            cloneItSelf: 0.0015,
            callback: function () {
                if (ecosystem.groups.CREATURE.length < MAX_CREATURES
                    && randomFromRange(1) < REPRODUCTION_RATE) {
                    this.reproduce(ecosystem.groups.CREATURE);
                }
            }
        });

        /**
         * Creature: Predator
         * They seek and eat creatures.
         * They like Poison and dislike Food.
         * They are afraid of Eaters.
         */
        ecosystem.addBehavior({
            name: PREDATOR,
            like: POISON,
            dislike: FOOD,
            likeDislikeWeight: [1, -1],
            fear: {
                EATER: [-10, 50],
                CREATURE: [1, 200, function (agents, i) {
                    agents.splice(i, 1);
                    this.health += this.goodNutritionEffect;
                    this.radius += this.goodNutritionEffect;
                }]
            },
        });

        /**
         * Creature: Avoider
         * They like Food and dislike Poison.
         * They are super fast.
         * They avoid all other creatures.
         * They are somehow responsible to create food scarcity.
         */
        ecosystem.addBehavior({
            name: AVOIDER,
            like: FOOD,
            dislike: POISON,
            cloneItSelf: 0.0005,
            fear: {
                CREATURE: [-0.9, 100],
                EATER: [-1, 100],
                PREDATOR: [-1, 100, function () {
                    this.health += this.badNutritionEffect;
                }]
            },
        });

        /**
         * Creature: Eater
         * They like poison and leaves Food behind.
         * They seek good creatures, predators, avoiders and eat them.
         * They are smart and powerful creature.
         */
        ecosystem.addBehavior({
            name: EATER,
            like: POISON,
            dislike: POISON,
            likeDislikeWeight: [1, 1],
            fear: {
                CREATURE: [1.0, 100, function (list, i) {
                    list.splice(i, 1);
                    this.health += this.goodNutritionEffect;
                    this.radius += this.goodNutritionEffect;
                }],
                PREDATOR: [1.0, 100, function (list, i) {
                    list.splice(i, 1);
                    this.health += this.goodNutritionEffect;
                    this.radius += this.goodNutritionEffect;
                }],
                AVOIDER: [1.0, 100, function (list, i) {
                    list.splice(i, 1);
                    this.health += this.goodNutritionEffect;
                    this.radius += this.goodNutritionEffect;
                }],
            },
            callback: function () {
                if (randomFromRange(0, 1) < 0.05) {
                    addItem(ecosystem.entities.FOOD, 1, this.position.x, this.position.y)
                }
            }
        });

        // update and render ecosystem.
        ecosystem.render();
        ecosystem.update();
        renderItem(ecosystem.entities.FOOD, '#FFFFFF', 1, true);
        renderItem(ecosystem.entities.POISON, '#E0245E', 2);

        populationConstraints();


        requestAnimationFrame(animate);
        if (!lastFrame) {
            lastFrame = Date.now();
            fps = 0;
            return;
        }
        let timeDelta = (Date.now() - lastFrame) / 1000;
        lastFrame = Date.now();
        fps = (1 / timeDelta).toFixed(2);
    }
    animate();


    // Creatures, Food and Poison Statistics
    window.setInterval(function () {
        renderStats({
            'Good Creatures': ecosystem.groups.CREATURE.length,
            'Predators': ecosystem.groups.PREDATOR.length,
            'Avoiders': ecosystem.groups.AVOIDER.length,
            'Eaters': ecosystem.groups.EATER.length,
            'Foods': ecosystem.entities.FOOD.length,
            'Poison': ecosystem.entities.POISON.length,
            'FPS': fps
        });
    }, 100);
}

window.onload = init;