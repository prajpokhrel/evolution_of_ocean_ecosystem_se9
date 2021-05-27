const mutationRate = 0.5;

/**
 * @class Creature
 * @extends Display
 * This class creates specific creatures and sets different essential traits to them
 */

class Creature extends Display {

    /**
     * @param {Number} x
     * @param {Number} y
     * @param {Number} radius
     * @param DNA
     * @param creatureColor
     * @param builder
     */
    constructor(x, y, radius = 5, DNA, creatureColor, builder = {}) {
        super();
        this.position = new Vector(x, y);
        this.acceleration = new Vector(0, 0);
        this.velocity = new Vector(0, -2);

        this.builder = builder;
        this.age = 1;
        this.health = 1;
        this.radius = radius || 5;
        this.maximumSpeed = builder.maximumSpeed || 1.5;
        this.maximumForce = builder.maximumForce || 0.05;
        this.healthReduce = builder.healthReduce || 0.003;
        this.goodNutritionEffect = builder.goodNutritionEffect || 0.5;
        this.badNutritionEffect = builder.badNutritionEffect || -0.4;
        this.creatureColor = creatureColor;
        this.hasReproduced = 0;

        this.steer = new Steer(this);
        this.steeringEffect = {
            separate: -0.1,
            align: 0.8,
            cohesion: 0.7
        };

        // name for male and female creatures
        this.maleNames = [
            'jack', 'luke', 'kent',
            'john', 'grey', 'aaron',
            'adam', 'alex', 'avis',
            'ben', 'carl', 'ethan'
        ];

        this.femaleNames = [
            'rose', 'eve', 'lily',
            'love', 'ellie', 'jane',
            'pearl', 'quinn', 'grace',
            'olivia', 'sofia', 'layla'
        ];


        this.creatureType = builder.creatureType;
        this.sex = randomFromRange(1) < 0.5 ? 'MALE' : 'FEMALE';

        if (!this.creatureColor && this.getGender() === 'MALE') this.creatureColor = [29, 161, 242];
        if (!this.creatureColor && this.getGender() === 'FEMALE') this.creatureColor = [23, 191, 99];

        this.name = this.getRandomCreatureName()
        this.maximumRadius = builder.maximumRadius || (this.getGender() === 'FEMALE') ? 15 : 10;

        this.mutate = function (dnaIndex, mr, value) {
            if (randomFromRange(1) < mr) {
                dnaIndex += randomFromRange(value[0], value[1]);
            }
        };
        this.DNA = this.setDNA(DNA);
    }

    getRandomCreatureName() {
        if (this.getGender() === 'MALE') {
            return getRandomArrayItem(this.maleNames);
        }
        return getRandomArrayItem(this.femaleNames);
    }

    getGender() {
        return this.sex;
    }

    setDNA(DNA) {
        let tempDNA = [];

        if (DNA === undefined) {
            tempDNA[0] = randomFromRange(0.5, 1);     // Food attraction
            tempDNA[1] = randomFromRange(-0.3, -0.8); // Poison attraction
            tempDNA[2] = randomFromRange(20, 100);    // Food perception
            tempDNA[3] = randomFromRange(20, 100);    // Poison perception
        } else {
            tempDNA[0] = DNA[0];
            tempDNA[1] = DNA[1];
            tempDNA[2] = DNA[2];
            tempDNA[3] = DNA[3];
            this.mutate(tempDNA[0], mutationRate, [0.2, -0.2]);
            this.mutate(tempDNA[1], mutationRate, [-0.2, 0.2]);
            this.mutate(tempDNA[2], mutationRate, [-10, 20]);
            this.mutate(tempDNA[3], mutationRate, [-10, 20]);
        }
        return tempDNA;
    }

    /**
     * @method update()
     * This method updates Velocity, Position and Acceleration of creatures
     */
    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maximumSpeed);
        this.position.add(this.velocity);
        this.acceleration.multiply(0);
        this.health -= this.healthReduce;
        this.health = clamp(this.health, 0, 1);
        this.radius = clamp(this.radius, 0, this.maximumRadius);
        this.age += 0.01;
    }

    /**
     * @method applyForce()
     * @param {Number} force
     * This method applies force to the acceleration.
     * We could add mass here if we want "Acceleration = Force / Mass".
     */
    applyForce(force) {
        this.acceleration.add(force);
    }

    handleCreatureDeath() {
        return (this.health <= 0);
    }

    /**
     * @method checkBorderLine()
     * This methods checks for border line to keep all the creatures inside ecosystem.
     *
     */
    checkBorderLine() {
        let maximumDistance = 100;
        let desire = null;
        if (this.position.x < maximumDistance) {
            desire = new Vector(this.maximumSpeed, this.velocity.y);
        }
        else if (this.position.x > WIDTH - maximumDistance) {
            desire = new Vector(-this.maximumSpeed, this.velocity.y);
        }
        if (this.position.y < maximumDistance) {
            desire = new Vector(this.velocity.x, this.maximumSpeed);
        }
        else if (this.position.y > HEIGHT - maximumDistance) {
            desire = new Vector(this.velocity.x, -this.maximumSpeed);
        }
        if (desire !== null) {
            desire.normalize();
            desire.multiply(this.maximumSpeed);
            let steer = Vector.subtract(desire, this.velocity);
            steer.limit(this.maximumForce);
            this.applyForce(steer);
        }
    }


    /**
     * @method addFearBehavior()
     * @param list
     * @param {Number} weight
     * @param {Number} perception
     * @param {Function} callback
     * This method is used to add fear behavior to the creatures,
     * which also can be used inversely. Good creatures and Avoiders will fear Predators and Eaters,
     * whereas Predator fears with Eaters.
     */
    addFearBehavior(list, weight, perception, callback) {
        let record = Infinity;
        let close = null;

        for (let i = list.length - 1; i >= 0; i--) {
            let maximumDistance = getDistance(this.position.x, this.position.y, list[i].position.x, list[i].position.y);
            if (maximumDistance < this.radius) {
                callback && callback.call(this, list, i);
            } else {
                if (maximumDistance < record && maximumDistance < perception) {
                    record = maximumDistance;
                    close = list[i];
                }
            }
        }
        // seek
        if (close !== null) {
            this.applyForce(this.steer.seek(close).multiply(weight));
        }
    }


    /**
     * @method addFoodBehavior()
     * @param {*} good
     * @param {*} bad
     * @param {*} weights
     * This method is used to handle Food and Poison behavior. Depending upon the type
     * of creature, Food and Poison increases or reduces health based on what
     * creatures thinks nutrients is for them.
     *
     */
    addFoodBehavior(good, bad, weights) {
        let goodFood = this.consumeFood(good, this.goodNutritionEffect, this.DNA[2]);
        let badFood = this.consumeFood(bad, this.badNutritionEffect, this.DNA[3]);
        if (!weights) {
            goodFood.multiply(this.DNA[0]);
            badFood.multiply(this.DNA[1]);
        } else {
            goodFood.multiply(weights[0]);
            badFood.multiply(weights[1]);
        }
        this.applyForce(goodFood);
        this.applyForce(badFood);
    }

    /**
     * @method applySteeringBehavior()
     * @param {*} agents
     * This methods applies flocking behavior to the creatures.
     * To obtain this behavior three different algorithms - Separation,
     * Alignment and Cohesion are utilized.
     *
     */
    applySteeringBehavior(agents) {
        let separation = this.steer.separate(agents);
        let alignment = this.steer.align(agents);
        let cohesion = this.steer.cohesion(agents);

        separation.multiply(this.steeringEffect.separate);
        alignment.multiply(this.steeringEffect.align);
        cohesion.multiply(this.steeringEffect.cohesion);
        this.applyForce(separation);
        this.applyForce(alignment);
        this.applyForce(cohesion);
    }

    /**
     * @method updateSteeringBehavior()
     * @param {*} separate
     * @param {*} align
     * @param {*} cohesion
     * This method will update the steering forces of the creatures.
     * If changed, creatures will act differently.
     */
    updateSteeringBehavior(separate, align, cohesion) {
        this.steeringEffect = {
            separate: parseFloat(separate),
            align: parseFloat(align),
            cohesion: parseFloat(cohesion)
        };
    }

    /**
     * Consume Nutrition
     * @param {Array} list
     * @param nutrition
     * @param {Number} perception
     * This method handles food and poison eating. This also removes ate food and also
     * updated heath value based on good and bad nutrition. After eating food, creatures will
     * start to search for nearest food available.
     */
    consumeFood(list, nutrition, perception) {
        let record = Infinity;
        let close = null;
        for (let i = list.length - 1; i >= 0; i--) {
            let maximumDistance = getDistance(this.position.x, this.position.y, list[i].position.x, list[i].position.y);
            // delete
            if (maximumDistance < (5 + this.radius)) {
                list.splice(i, 1);
                this.health += nutrition;
                this.radius += nutrition;
                if (this.radius > this.maximumRadius) {
                    this.radius = this.maximumRadius;
                }
            } else {
                if (maximumDistance < record && maximumDistance < perception) {
                    record = maximumDistance;
                    close = list[i];
                }
            }
        }
        // seek
        if (close !== null) {
            return this.steer.seek(close);
        }
        return new Vector(0, 0);
    }

    /**
     * @method clone()
     * @param {float} probability
     * This method is used to return new Creatures.
     */
    clone(probability) {
        if (Math.random() < probability) {
            return this.builder
                .setPosition(this.position.x, this.position.y)
                .setRadius(5)
                .build();
        }
        return null;
    }

    /**
     * @param {Creature} agentA
     * @returns {Boolean}
     * This method is used to check for reproduction eligibility to see
     * if creatures can reproduce with each other. Three basic requirements
     * have to be met inorder to reproduce -
     * 1. Creatures should be of different gender
     * 2. Should be mature and close enough to reproduce
     * 3. Should be healthy
     */
    checkReproductionEligibility(agentA) {
        let isAdult = (agentA.radius + this.radius > 16);
        let isSameGender = agentA.getGender() === this.getGender();
        let isHealthy = (agentA.health + this.health > 0.9);

        return (isAdult && !isSameGender && isHealthy)
    }

    /**
     * @param {Array} boids [Boids are an artificial life program, which simulates the flocking behavior]
     * @param {Creature} agentA
     * This method is used to give birth to off-springs after reproduction.
     */
    handleChildBirth(boids, agentA) {
        this.hasReproduced++;
        agentA.hasReproduced++;
        let x = this.position.x + randomFromRange(this.velocity.x, agentA.velocity.x);
        let y = this.position.y + randomFromRange(this.velocity.y, agentA.velocity.y);
        let newChild = this.builder
            .setPosition(x, y)
            .setRadius(5)
            .setDNA(this.DNA)
            .build()

        boids.push(newChild);
    }

    /**
     * @method reproduce()
     * @param {Array} boids
     * This methods uses other methods to check for reproduction.
     * This starts reproduction process.
     *
     */
    reproduce(boids) {
        let maximumDistance = Infinity;
        let agentB = this;
        for (let i = 0; i < boids.length - 1; i++) {
            let agentA = boids[i];
            maximumDistance = getDistance(agentA.position.x, agentA.position.y, this.position.x, this.position.y);

            if (maximumDistance < (agentB.radius + agentA.radius)) {
                if (this.checkReproductionEligibility(agentA)) {
                    this.handleChildBirth(boids, agentA);
                    return;
                }
            }
        }
    }
}
