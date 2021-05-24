/**
 * @class Steer
 */
class Steer {

    constructor(currentAgent) {
        this.currentAgent = currentAgent;
        this.wandertheta = 0;
    }

    /**
     * @method seek()
     * @param {*} target
     *
     */
    seek(target) {
        let desired = null;
        desired = Vector.subtract(target.position, this.currentAgent.position);
        desired.normalize();
        desired.multiply(this.currentAgent.maximumSpeed);
        let steer = Vector.subtract(desired, this.currentAgent.velocity);
        steer.limit(this.currentAgent.maximumForce);
        return steer;
    }

    /**
     * @param {*} sum
     */
    _returnSteer(sum) {
        sum.normalize();
        sum.multiply(this.currentAgent.maximumSpeed);
        let steer = Vector.subtract(sum, this.currentAgent.velocity);
        steer.limit(this.currentAgent.maximumForce);
        return steer;
    }


    flee(target) {
        let desired = null;
        const FLEE_RADIUS = 100;

        let d = Vector.distance(this.currentAgent.position, target);
        if (d < FLEE_RADIUS) {
            desired = Vector.subtract(target, this.currentAgent.position);
            desired.normalize();
            desired.multiply(this.currentAgent.maximumSpeed);
            let steer = Vector.subtract(desired, this.currentAgent.velocity);
            steer.limit(this.currentAgent.maximumForce);
            return steer.multiply(-1);
        } else {
            return new Vector(0, 0);
        }
    }

    // QUEUE - NOT IN USE
    getNeighborAhead(entities) {
        let maxQueueAhead = 500;
        let maxQueueRadius = 500;
        let res;
        let qa = this.currentAgent.velocity.replica().normalize().multiply(maxQueueAhead);
        let ahead = this.currentAgent.position.replica().add(qa);

        for (let i = 0; i < entities.length; i++) {
            let distance = Vector.distance(ahead, entities[i].position);
            if (entities[i] !== this && distance <= maxQueueRadius) {
                res = entities[i];
                break;
            }
        }
        return res;
    }

    queue(entities, maxQueueRadius = 500) {
        let neighbor = this.getNeighborAhead(entities);
        let brake = new Vector(0, 0);
        let steeringForce = new Vector(0, 0);
        let v = this.currentAgent.velocity.replica();
        if (neighbor !== null) {
            brake = steeringForce.replica().negativeVector().multiply(0.8);
            v.negativeVector().normalize();
            brake.add(v);
            if (Vector.distance(this.currentAgent.position, neighbor.position) <= maxQueueRadius) {
                this.currentAgent.velocity.multiply(0.3);
            }
        }
        steeringForce.add(brake);
    }

    /**
     * @method wander()
     *
     */
    wander() {
        let wanderR = 25;
        let wanderD = 80;
        let change = 0.1;
        this.wandertheta += randomFromRange(-change, change);

        let circleloc = this.currentAgent.velocity.replica();
        circleloc.normalize();
        circleloc.multiply(wanderD);
        circleloc.add(this.currentAgent.position);

        let h = this.currentAgent.velocity.heading();

        let circleOffSet = new Vector(wanderR * Math.cos(this.wandertheta + h), wanderR * Math.sin(this.wandertheta + h));
        let target = Vector.add(circleloc, circleOffSet);

        // SEEK
        let desired = null;
        desired = Vector.subtract(target, this.currentAgent.position);
        desired.normalize();
        desired.multiply(this.currentAgent.maximumSpeed);
        let steer = Vector.subtract(desired, this.currentAgent.velocity);
        steer.limit(this.currentAgent.maximumForce);
        return steer;
    }

    /**
     * @method separate()
     * @param {Array} agents
     *
     */
    separate(agents) {
        let steering = this.currentAgent.radius * 4;
        let sum = new Vector(0, 0);
        let count = 0;
        for (let i = 0; i < agents.length; i++) {
            let d = Vector.squaredDistance(this.currentAgent.position, agents[i].position);
            if ((d > 0) && (d < steering * steering)) {
                let difference = Vector.subtract(this.currentAgent.position, agents[i].position);
                difference.normalize();
                difference.divide(d);
                sum.add(difference);
                count++;
            }
        }
        if (count > 0) {
            sum.divide(count);
            return this._returnSteer(sum);
        }
        return new Vector(0, 0);
    };

    /**
     * @method align()
     * @param {Array} agents
     *
     */
    align(agents) {
        let neighbourhoodDistance = 50;
        let sum = new Vector(0, 0);
        let count = 0;
        for (let i = 0; i < agents.length; i++) {
            let d = Vector.squaredDistance(this.currentAgent.position, agents[i].position);
            if ((d > 0) && (d < neighbourhoodDistance * neighbourhoodDistance)) {
                sum.add(agents[i].velocity);
                count++;
            }
        }
        if (count > 0) {
            sum.divide(count);
            return this._returnSteer(sum);
        }
        return new Vector(0, 0);
    }


    /**
     * @method cohesion()
     * @param {Array} agents
     *
     */
    cohesion(agents) {
        let neighbourhoodDistance = 30;
        let sum = new Vector(0, 0);
        let count = 0;
        for (let i = 0; i < agents.length; i++) {
            let d = Vector.squaredDistance(this.currentAgent.position, agents[i].position);
            if ((d > 0) && (d < neighbourhoodDistance * neighbourhoodDistance)) {
                sum.add(agents[i].position);
                count++;
            }
        }
        if (count > 0) {
            sum.divide(count);
            sum.subtract(this.currentAgent.position);
            return this._returnSteer(sum);
        }
        return new Vector(0, 0);
    }
}