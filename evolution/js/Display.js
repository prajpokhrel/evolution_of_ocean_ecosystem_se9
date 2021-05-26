/**
 * @class Display
 * This class is used to display different creatures with their debugging information,
 * health status, and names too.
 */

class Display {

    /**
     * Display different Creatures
     * @param {CanvasRenderingContext2D} ctx
     */

    displayCreatures(ctx) {
        ctx.beginPath();

        ctx.fillStyle = `rgba(${this.creatureColor[0]},${this.creatureColor[1]},${this.creatureColor[2]},${this.health})`;
        let angle = this.velocity.heading();

        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(angle);
        ctx.moveTo(this.radius, 0);
        ctx.lineTo(-this.radius, -this.radius + 2);
        ctx.lineTo(-this.radius, this.radius - 4);
        ctx.lineTo(this.radius, 0);
        ctx.fill();
        ctx.restore();

        ctx.closePath();
    }

    /**
     * Display creatures health status
     * @param {CanvasRenderingContext2D} ctx
     */

    displayCreatureHealthStatus(ctx) {
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.position.x - 10, this.position.y - 10, this.health * 20, 3);
        ctx.lineWidth = 0.3;
        ctx.strokeStyle = '#FFFFFF';
        ctx.strokeRect(this.position.x - 10, this.position.y - 10, 20, 2);
        ctx.restore();
    }

    /**
     * Display Food and Poison Perception of each creatures
     * @param {CanvasRenderingContext2D} ctx
     */

    displayPerceptionDebug(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = '#17BF63';
        ctx.arc(this.position.x, this.position.y, clamp(this.DNA[2], 0, 100), 0, TWO_PI);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.strokeStyle = '#E0245E';
        ctx.arc(this.position.x, this.position.y, clamp(this.DNA[3], 0, 100), 0, TWO_PI);
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * Display Food and Poison Attraction [DNA] of each creatures
     * @param {CanvasRenderingContext2D} ctx
     */

    displayDNADebug(ctx) {
        let angle = this.velocity.heading() + (Math.PI / 2);
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(angle);
        ctx.strokeStyle = '#17BF63';
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -this.DNA[0] * 20);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.strokeStyle = '#E0245E';
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -this.DNA[1] * 20);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    /**
     * Display names of each creatures
     * @param {CanvasRenderingContext2D} ctx
     */
    displayCreatureNames(ctx) {
        ctx.beginPath();
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(this.name, this.position.x - this.radius, this.position.y - this.radius - 5);
        ctx.fill();
        ctx.closePath();
    }
}