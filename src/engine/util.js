/**
 * Random number(`int`) between min max
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const randBetweenMinMax = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min)

/**
 * Render square with specific 2D ctx
 * @param {{coord: [number, number], fill: string, ctx: CanvasRenderingContext2D, size: number}} param0
 */
const renderSquare = ({ coord, fill, ctx, size }) => {
    ctx.fillStyle = fill
    ctx.fillRect(coord[0], coord[1], size, size)
}

/**
 * Get random grid coordinate
 * @param {{gridSize: number, gridLimit: number}} arg
 * @returns {[number, number]}
 */
const getRandomGridCoord = ({ gridSize, gridLimit }) => [
    gridSize * randBetweenMinMax(0, gridLimit),
    gridSize * randBetweenMinMax(0, gridLimit),
]

export { randBetweenMinMax, renderSquare, getRandomGridCoord }
