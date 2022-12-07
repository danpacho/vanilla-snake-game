import { util } from "./utils.js"

class Food {
    #foodSize

    #food

    #gridLimit

    /**
     * @param {{foodSize: number, gridLimit: number}} FoodOption
     */
    constructor({ foodSize, gridLimit }) {
        this.#food = util.getRandomGridCoord({
            gridSize: foodSize,
            gridLimit,
        })

        this.#gridLimit = gridLimit
        this.#foodSize = foodSize
    }

    getLocation() {
        return this.#food
    }

    updateLocation() {
        this.#food = util.getRandomGridCoord({
            gridSize: this.#foodSize,
            gridLimit: this.#gridLimit,
        })
    }
}

export { Food }
