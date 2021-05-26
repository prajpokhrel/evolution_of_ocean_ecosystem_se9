class Star {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: 3
        };
        this.friction = 0.8;
        this.gravity = 1;
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.shadowColor = '#E3EAEF';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    shatter() {
        this.radius -= 3;
        for (let i = 0; i < 8; i++) {
            miniStars.push(new MiniStar(this.x, this.y, 2));
        }
    }

    update() {
        this.draw();

        // When ball hits bottom of the ground
        if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
            this.velocity.y = -this.velocity.y * this.friction;
            this.shatter();
        } else {
            this.velocity.y += this.gravity;
        }

        // When ball hits side of screen, bounce off
        if (this.x + this.radius + this.velocity > canvas.width || this.x - this.radius <= 0) {
            this.velocity.x = -this.velocity.x * this.friction;
            this.shatter();
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}