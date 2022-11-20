/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const numBetween = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min)

export { numBetween }
