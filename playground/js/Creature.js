class Creature {
    constructor(x, y, radius, color) {
        this.position = new Vector(x, y);
        this.acceleration = new Vector(0, 0);
        this.velocity = Vector.random2DVector();
        this.velocity.multiply(10);

        this.radius = radius || 5;
        this.maximumSpeed = 3;
        this.maximumForce = 0.05;
        this.mass = 0.2;
        this.color = color;

        this.steer = new Steer(this);
        this.steeringEffect = {
            separate: 2.0,
            align: 1.2,
            cohesion: 1.3,
            wander: 0.5
        };
    }

    update() {
        // Some physics stuffs
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maximumSpeed);
        this.position.add(this.velocity);
        this.acceleration.multiply(0);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    /**
     * @method checkBorderLine()
     *
     */
    checkBorderLine() {
        let d = 100;
        let desire = null;
        if (this.position.x < d) {
            desire = new Vector(this.maximumSpeed, this.velocity.y);
        } else if (this.position.x > width - d) {
            desire = new Vector(-this.maximumSpeed, this.velocity.y);
        }
        if (this.position.y < d) {
            desire = new Vector(this.velocity.x, this.maximumSpeed);
        } else if (this.position.y > height - d) {
            desire = new Vector(this.velocity.x, -this.maximumSpeed);
        }
        if (desire !== null) {
            desire.normalize();
            desire.multiply(this.maximumSpeed);
            let steer = Vector.subtract(desire, this.velocity);
            steer.limit(0.10);
            this.applyForce(steer);
        }
    }

    /**
     * @method applySteeringBehavior()
     * @param {*} agents
     *
     */
    applySteeringBehavior(agents) {
        let separation = this.steer.separate(agents);
        let alignment = this.steer.align(agents);
        let cohesion = this.steer.cohesion(agents);
        let wander = this.steer.wander();
        let flee = this.steer.flee(new Vector(mouseX, mouseY))

        separation.multiply(this.steeringEffect.separate);
        alignment.multiply(this.steeringEffect.align);
        cohesion.multiply(this.steeringEffect.cohesion);
        wander.multiply(this.steeringEffect.wander);
        flee.multiply(50);
        this.applyForce(separation);
        this.applyForce(alignment);
        this.applyForce(cohesion);
        this.applyForce(wander);
        this.applyForce(flee);
    }

    /**
     * Display Creatures
     * @param {CanvasRenderingContext2D} ctx
     */
    displayCreatures(ctx) {
        ctx.beginPath();
        let angle = this.velocity.heading();
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(angle);
        ctx.arc(0, 0, 4, 0, Math.PI * 2)
        ctx.fill();
        ctx.restore();
        ctx.closePath();
    }
}