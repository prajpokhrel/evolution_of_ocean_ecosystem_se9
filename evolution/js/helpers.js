const TWO_PI = Math.PI * 2;

/**
 * @param {String} selector
 * @returns {HTMLElement}
 */

function _(selector) {
    return document.querySelector(selector);
}

/**
 * @param {String} selector
 * @returns {NodeList}
 */

function __(selector) {
    return document.querySelectorAll(selector);
}

function randomColor() {
    function c() {
        let hex = Math.floor(Math.random() * 256).toString(16);
        return ("0" + String(hex)).substr(-2);
    }
    return "#"+c()+c()+c();
}

function getRandomArrayItem(array) {
    return array[Math.floor(randomFromRange(0, array.length - 1))];
}

function randomFromRange(min, max) {
    if (max === undefined) return Math.random() * min;
    return min + Math.random() * max
}

function randomIntFromRange(min, max) {
    return Math.floor(randomFromRange(min, max));
}

function clamp(value, min, max) {
    if (value >= max) {
        return max;
    } else if (value <= min) {
        return min;
    }
    return value;
}

function getDistance(px, py, qx, qy) {
    let dx = px - qx;
    let dy = py - qy;
    return Math.sqrt(dx * dx + dy * dy);
}

function addCreatures(list, max) {
    for (let i = 0; i < max; i++) {
        let x = randomFromRange(WIDTH);
        let y = randomFromRange(HEIGHT);
        let radius = randomIntFromRange(5, 7);
        if (isInsideWall(x, y, radius)) {
            x = randomFromRange(WIDTH);
            y = randomFromRange(HEIGHT);
        }
        list.push(Agent.setPosition(x, y).setRadius(radius).build());
    }
}

function addPredators(list, max) {
    for (let i = 0; i < max; i++) {
        let x = randomFromRange(WIDTH);
        let y = randomFromRange(HEIGHT);
        let radius = randomIntFromRange(6, 10);
        if (isInsideWall(x, y, radius)) {
            x = randomFromRange(WIDTH);
            y = randomFromRange(HEIGHT);
        }
        list.push(Predator.setPosition(x, y).setRadius(radius).build());
    }
}

function addAvoiders(list, max) {
    for (let i = 0; i < max; i++) {
        let x = randomFromRange(WIDTH);
        let y = randomFromRange(HEIGHT);
        let radius = randomIntFromRange(3, 8);
        if (isInsideWall(x, y, radius)) {
            x = randomFromRange(WIDTH);
            y = randomFromRange(HEIGHT);
        }
        list.push(Avoider.setPosition(x, y).setRadius(radius).build());
    }
}

function addEaters(list, max) {
    for (let i = 0; i < max; i++) {
        let x = randomFromRange(WIDTH);
        let y = randomFromRange(HEIGHT);
        let radius = randomIntFromRange(3, 8);
        if (isInsideWall(x, y, radius)) {
            x = randomFromRange(WIDTH);
            y = randomFromRange(HEIGHT);
        }
        list.push(Eater.setPosition(x, y).setRadius(radius).build());
    }
}

function addItem(list, max, xx, yy) {
    for (let i = 0; i < max; i++) {
        let x = xx;
        let y = yy;
        if (x === undefined && y === undefined) {
            x = randomFromRange(WIDTH);
            y = randomFromRange(HEIGHT);
            if (isInsideWall(x, y, 0)) {
                x = randomFromRange(WIDTH);
                y = randomFromRange(HEIGHT);
            }
        }
        list.push({ position: new Vector(x, y) });
    }
}

function isInsideWall(x, y, padding) {
    if (typeof walls === 'undefined') { return false }
    for (let w = 0; w < walls.length; w++) {
        let wall = walls[w];
        if (
            (x + padding >= wall.x && x - padding <= wall.x + wall.width) &&
            (y + padding >= wall.y && y - padding <= wall.y + wall.height)) {
            return true;
        }
    }
    return false;
}

function renderItem(list, color, radius, rect) {
    for (let i = 0; i < list.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = color;
        if (rect) {
            ctx.fillRect(list[i].position.x, list[i].position.y, radius * 2, radius * 2);
        } else {
            // ctx.arc(list[i].pos.x, list[i].pos.y, (radius || 5), 0, Math.PI * 2);
            ctx.fillRect(list[i].position.x, list[i].position.y, radius * 2, radius * 2);
        }
        ctx.fill();
        ctx.closePath();
    }
}

let flk_slider_separate = document.getElementById('separate');
let flk_slider_align = document.getElementById('align');
let flk_slider_cohesion = document.getElementById('cohesion');
let renderhealth_checkbox = document.getElementById('render_health');
let debug_checkbox = document.getElementById('debug');
let dnadebug_checkbox = document.getElementById('dnadebug');
let render_names = document.getElementById('names');

function batchDisplayCreatures(list) {
    for (let i = 0; i < list.length; i++) {
        list[i].displayCreatures(ctx);

        // DEBUG
        if (renderhealth_checkbox.checked) list[i].displayCreatureHealthStatus(ctx);
        if (debug_checkbox.checked) list[i].displayPerceptionDebug(ctx);
        if (dnadebug_checkbox.checked) list[i].displayDNADebug(ctx);
        if (render_names.checked) list[i].displayCreatureNames(ctx);
    }
}

/**
 * @metod renderStats()
 * @param {*} data
 */
let statistics = document.getElementById('statistics');

function renderStats(data) {
    let creatureStatistics = '';
    for (let creature in data) {
        creatureStatistics += creature + ': ' + data[creature] + " \n";
    }
    statistics.innerText = creatureStatistics;
}


