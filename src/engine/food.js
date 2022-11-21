import { COLOR } from "../constant/snake.js"
import { getRandomGridCoord, renderSquare } from "./util.js"

class Food {
    #foodSize

    #ctx

    #food

    #gridLimit

    /**
     * @param {{foodSize: number, gridLimit: number, ctx: CanvasRenderingContext2D}} FoodOption
     */
    constructor({ foodSize, gridLimit, ctx }) {
        this.#food = getRandomGridCoord({
            gridSize: foodSize,
            gridLimit,
        })

        this.#gridLimit = gridLimit
        this.#foodSize = foodSize
        this.#ctx = ctx
    }

    getLocation() {
        return this.#food
    }

    updateLocation() {
        this.#food = getRandomGridCoord({
            gridSize: this.#foodSize,
            gridLimit: this.#gridLimit,
        })
    }

    render() {
        this.updateLocation()
        renderSquare({
            ctx: this.#ctx,
            coord: this.#food,
            size: this.#foodSize,
            fill: COLOR.FOOD,
        })
    }
}

export { Food }
