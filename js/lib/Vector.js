/**
 * I made this Vector library for this project and it has jsdoc but it's not released or anything!
 * @class Vector
 * @version v0.1.1
 * @author Prajwal Pokhrel
 * @param {number} x
 * @param {number} y
 */

class Vector {

    /**
     * Create a new 2D vector
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    /**
     * Adds two vectors and returns the resultant
     * @param {Vector} v1
     * @param {Vector} v2
     * @return {Vector}
     */
    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }

    /**
     * Subtracts two vectors and returns the resultant
     * @param {Vector} v1
     * @param {Vector} v2
     * @return {Vector}
     */
    static subtract(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    /**
     * Returns distance between two vectors
     * @param {Vector} v1
     * @param {Vector} v2
     * @return {number}
     */
    static distance(v1, v2) {
        return v1.distance(v2);
    }

    /**
     * Returns the squared distance from two vectors
     * @param {Vector} v1
     * @param {Vector} v2
     * @return {number}
     */
    static squaredDistance(v1, v2) {
        return v1.squaredDistance(v2);
    }

    /**
     * Creates the vector from angle
     * @param {number} angle
     */
    static vectorFromAngle(angle) {
        let vector = new Vector(0, 0);
        vector.x = Math.cos(angle);
        vector.y = Math.sin(angle);
        return vector;
    }

    /**
     * Creates the random2D vector
     * @return {Vector}
     */
    static random2DVector() {
        return Vector.vectorFromAngle(Math.random() * Math.PI * 180);
    }

    /**
     * Adds this vector to a given vector
     * @param {Vector|number} x
     * @param {Number} y
     * @return {Vector}
     */
    add(x, y) {
        if (arguments.length === 1) {
            this.x += x.x;
            this.y += x.y;
        } else if (arguments.length === 2) {
            this.x += x;
            this.y += y;
        }
        return this;
    }

    /**
     * Subtracts this vector to a given vector
     * @param {Vector|number} x
     * @param {Number} y
     * @return {Vector}
     */
    subtract(x, y) {
        if (arguments.length === 1) {
            this.x -= x.x;
            this.y -= x.y;
        } else if (arguments.length === 2) {
            this.x -= x;
            this.y -= y;
        }
        return this;
    }

    /**
     * Multiply's this vector to a scalar value or a vector
     * @param {Vector|number} vector
     * @return {Vector}
     */
    multiply(vector) {
        if (typeof vector === 'number') {
            this.x *= vector;
            this.y *= vector;
        } else {
            this.x *= vector.x;
            this.y *= vector.y;
        }
        return this;
    }

    /**
     * Divides this vector to a scalar value or a vector
     * @param {Vector|number} vector
     * @return {Vector}
     */
    divide(vector) {
        if (typeof vector === 'number') {
            this.x /= vector;
            this.y /= vector;
        } else {
            this.x /= vector.x;
            this.y /= vector.y;
        }
        return this;
    }

    /**
     * Returns the magnitude of this vector
     * @return {number}
     */
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Returns the squared magnitude of this vector
     * @return {number}
     */
    squaredMagnitude() {
        return (this.x * this.x + this.y * this.y);
    }

    /**
     * Sets the magnitude of this vector
     * @param {number} value
     * @return {Vector}
     */
    setMagnitude(value) {
        this.normalize();
        this.multiply(value);
        return this;
    }

    /**
     * Normalizes this vector
     * @return {Vector}
     */
    normalize() {
        let mag = this.magnitude();
        if (mag > 0) {
            this.divide(mag);
        }
        return this;
    }

    /**
     * limits this vector
     * @param {number} maximum
     * @return {Vector}
     */
    limit(maximum) {
        if (this.magnitude() > maximum) {
            this.normalize();
            this.multiply(maximum);
        }
        return this;
    }

    /**
     * Get heading of this vector in radians
     * @return {number}
     */
    heading() {
        return (-Math.atan2(-this.y, this.x));
    }

    /**
     * Returns the distance between this and specific vector
     * @param {Vector} vector
     * @return {number}
     */
    distance(vector) {
        let distX = this.x - vector.x;
        let distY = this.y - vector.y;
        return Math.sqrt(distX * distX + distY * distY);
    }

    /**
     * Returns the squared distance between this and specific vector
     * @param {Vector} vector
     * @return {number}
     */
    squaredDistance(vector) {
        let distX = this.x - vector.x;
        let distY = this.y - vector.y;
        return (distX * distX + distY * distY);
    }

    /**
     * Returns the copy/replica of this vector
     * @return {Vector}
     */
    replica() {
        return new Vector(this.x, this.y);
    }

    /**
     * Reverts this vector
     * @return {Vector}
     */
    negativeVector() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    /**
     * Returns an array representation of this vector
     * @return {Array}
     */
    array() {
        return [this.x, this.y];
    }
}
