/**
 * @class BuildCreature
 * @pattern Builder Design Pattern
 * BuildCreature class Builds a Creature Class with specific variables
 */

class BuildCreature {
    constructor(creatureType) {
        this.acceleration = new Vector(0, 0);
        this.velocity = new Vector(0, -2);

        this.creatureType = creatureType;
    }

    setPosition(x, y) {
        this.position = new Vector(x, y);

        return this;
    }

    setMaximumRadius(radius = 20) {
        this.maximumRadius = radius;

        return this;
    }

    setRadius(radius = 5) {
        this.radius = radius;

        return this;
    }

    setMaximumSpeed(maxValue = 1.5) {
        this.maximumSpeed = maxValue;

        return this;
    }

    setMaximumForce(maxValue = 0.05) {
        this.maximumForce = maxValue;

        return this;
    }

    setHealthReduce(maxValue = 0.003) {
        this.healthReduce = maxValue;

        return this;
    }

    setNutritionEffect(array) {
        this.goodNutritionEffect = array[0];
        this.badNutritionEffect = array[1];

        return this;
    }

    setCreatureColor(creatureColor) {
        this.creatureColor = creatureColor;

        return this;
    }

    setDNA(DNA) {
        this.DNA = DNA;

        return this;
    }

    build() {
        return new Creature(
            this.position.x,
            this.position.y,
            this.radius,
            this.DNA,
            this.creatureColor,
            this
        );
    }
}


/**
 * @class Agent: Good Creatures
 * @extends Creature
 */
let Agent = new BuildCreature('CREATURE');


/**
 * @class Predator
 * @extends Creature
 */
let Predator = new BuildCreature('PREDATOR')
    .setRadius(10)
    .setMaximumSpeed(2)
    .setMaximumForce(0.05)
    .setHealthReduce(0.002)
    .setCreatureColor([220, 0, 78])
    .setNutritionEffect([0.5, -0.5]);


/**
 * @class Avoider
 * @extends Creature
 */
let Avoider = new BuildCreature('AVOIDER')
    .setRadius(5)
    .setMaximumRadius(8)
    .setMaximumSpeed(4)
    .setMaximumForce(0.2)
    .setHealthReduce(0.003)
    .setCreatureColor([244, 93, 34])
    .setNutritionEffect([0.5, -0.5])


/**
 * @class Eater
 * @extends Creature
 */
let Eater = new BuildCreature('EATER')
    .setRadius(5)
    .setMaximumRadius(20)
    .setMaximumSpeed(1.7)
    .setMaximumForce(0.05)
    .setHealthReduce(0.001)
    .setCreatureColor([121, 75, 196])
    .setNutritionEffect([0.5, 0])
