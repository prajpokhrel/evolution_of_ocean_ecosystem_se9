class MiniStar extends Star{
    constructor(x, y, radius, color) {
        super(x, y, radius, color);
        this.velocity = {
            x: randomIntFromRange(-5, 5),
            y: randomIntFromRange(-15, 15)
        };
        this.friction = 0.8;
        this.gravity = 0.1;
        this.startFadeDuration = 200;
        this.opacity = 1;
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(227, 234, 239, ${this.opacity})`;
        ctx.shadowColor = '#E3EAEF';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    update() {
        this.draw();

        if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
            this.velocity.y = -this.velocity.y * this.friction;
        } else {
            this.velocity.y += this.gravity;
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.startFadeDuration -= 1;
        this.opacity -= 1 / this.startFadeDuration;
    }
}