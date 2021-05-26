function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * @param {String} selector
 * @returns {HTMLElement}
 */

function _(selector) {
    return document.querySelector(selector);
}
