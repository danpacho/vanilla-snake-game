/**
 * utility functions
 */
const util = {
    /**
     * Random `int` between min max
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    randIntBetweenMinMax: (min, max) =>
        Math.floor(Math.random() * (max - min + 1) + min),
    /**
     * Render square with specific `2D ctx`
     * @param {{coord: [number, number], fill: string, ctx: CanvasRenderingContext2D, size: number}} renderOption
     */
    renderSquare: ({ coord, fill, ctx, size }) => {
        ctx.fillStyle = fill
        ctx.fillRect(coord[0], coord[1], size, size)
    },
    /**
     * Get random grid coordinate
     * @param {{gridSize: number, gridLimit: number}} gridCoordOption
     * @returns {[number, number]}
     */
    getRandomGridCoord: ({ gridSize, gridLimit }) => [
        gridSize * util.randIntBetweenMinMax(0, gridLimit),
        gridSize * util.randIntBetweenMinMax(0, gridLimit),
    ],
}

export { util }
