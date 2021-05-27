/**
 * @class Ecosystem
 * This class is used to set up ecosystem. Handling initial population,
 * adding creatures, foods, add different behaviors, and update creatures.
 */
class Ecosystem {

    constructor() {
        this.groups = {};     // Contains Creatures: Good Creatures, Predators, Avoiders and Eaters
        this.entities = {};   // Contains Nutrients: Food and Poison
        this.agents = {};     // Creatures classes
        this.behaviors = {};  // Creatures calculated behaviors
    }

    /**
     * @method addEntities
     * @param {Object} names
     * This method helps to add Food and Poison to entities object.
     */
    addEntities(names) {
        for (const i in names) {
            this.entities[i] = names[i];
        }
    }

    /**
     * @method registerAgents
     * @param {Object} agents
     * The agents object is a object of Creature constructor.
     */
    registerAgents(agents) {
        this.agents = agents;
        for (const i in agents) {
            this.groups[i] = []
        }
    }

    /**
     * @method initialPopulation
     * @param {Object} init
     * This help to define initial population of the ecosystem.
     */
    initialPopulation(init) {
        this.initPopulation = init;
        for (const i in this.initPopulation) {
            if (this.groups[i] !== undefined) {
                this.addAgent(this.agents[i], this.groups[i], this.initPopulation[i]);
            }
        }
    }

    /**
     * @method add
     * @param {String} type
     * @param {Number} x
     * @param {Number} y
     * @param {Number} radius
     * This method helps to add Creatures to groups object.
     *
     */
    add(type, x, y, radius = 5) {
        let name = this.agents[type]
        this.groups[type].push(name.setPosition(x, y).setRadius(radius).build());
    }

    /**
     * @metho addAgent
     * @param {BuildCreature} name
     * @param {Array} list
     * @param {Number} max
     * This method helps to add Creatures to the list in random position
     */
    addAgent(name, list, max) {
        for (let i = 0; i < max; i++) {
            let x = randomFromRange(WIDTH);
            let y = randomFromRange(HEIGHT);
            const radius = randomFromRange(4, 5);
            if (isInsideWall(x, y, radius)) {
                x = randomFromRange(WIDTH);
                y = randomFromRange(HEIGHT);
            }
            if (name instanceof BuildCreature) {
                list.push(name.setPosition(x, y).setRadius(radius).build());
            }
        }
    }


    /**
     * @method addBehavior
     * @param {Object} config
     * @param {String} config.name
     * @param {String} config.like
     * @param {String} config.dislike
     * @param {Array} config.likeDislikeWeight
     * @param {Number} config.cloneItSelf
     * @param {Object} config.fear
     * @param {Function} config.callback
     * This method is used to set different behaviors to the Creatures
     * based on which they react differently on ecosystem.
     *
     */
    addBehavior(config) {
        const agents = this.groups[config.name];
        const foodPoison = [this.entities[config.like], this.entities[config.dislike]];
        const likeDislikeWeight = config.likeDislikeWeight;
        const callback = config.callback;
        const fear = [];
        const cloneItSelf = config.cloneItSelf;

        if (!agents) return;

        for (const i in config.fear) {
            fear.push([this.groups[i], config.fear[i][0], config.fear[i][1], config.fear[i][2]]);
        }
        this.behaviors[config.name] = { agents, foodPoison, likeDislikeWeight, callback, fear, cloneItSelf }
    }

    /**
     * @method update
     * This methods helps to update all the behaviors
     */
    update() {
        for (const a in this.behaviors) {
            const behave = this.behaviors[a];
            this.batchUpdateCreatures(behave.agents, behave.foodPoison, behave.likeDislikeWeight, (list, i) => {
                let current = list[i];

                if (behave.cloneItSelf) {
                    let child = list[i].clone(behave.cloneItSelf);
                    if (child !== null) {
                        list.push(child);
                    }
                }

                for (let i = 0; i < behave.fear.length; i++) {
                    current.addFearBehavior.apply(current, behave.fear[i]);
                }

                behave.callback && behave.callback.call(current);
            })
        }
    }


    /**
     * @method batchUpdateCreatures
     * @param {Array} list
     * @param {Array} foodPoison
     * @param {Number} weight
     * @param {Function} callback
     * This method is used to update creatures
     */
    batchUpdateCreatures(list, foodPoison, weight, callback) {
        for (let i = list.length - 1; i >= 0; i--) {
            list[i].update();
            list[i].updateSteeringBehavior(slider_separate.value, slider_align.value, slider_cohesion.value);
            list[i].applySteeringBehavior(list);
            if (foodPoison[0] !== undefined && foodPoison[1] !== undefined) {
                list[i].addFoodBehavior(foodPoison[0], foodPoison[1], weight);
            }
            list[i].checkBorderLine();

            callback && callback.call(list[i], list, i);

            // Kill the creatures
            if (list[i].handleCreatureDeath()) {
                const x = list[i].position.x;
                const y = list[i].position.y;
                foodPoison && foodPoison[0].push({ position: new Vector(x, y) });
                list.splice(i, 1);
            }
        }
    }


    /**
     * @method render
     * This method is used to display creatures
     */
    render() {
        for (const i in this.groups) {
            if (this.groups[i][0] instanceof Creature) {
                batchDisplayCreatures(this.groups[i]);
            }
        }
    }
}