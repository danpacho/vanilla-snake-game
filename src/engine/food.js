import { getRandomGridCoord } from "./util.js"

class Food {
    #foodSize

    #food

    #gridLimit

    /**
     * @param {{foodSize: number, gridLimit: number}} FoodOption
     */
    constructor({ foodSize, gridLimit }) {
        this.#food = getRandomGridCoord({
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
        this.#food = getRandomGridCoord({
            gridSize: this.#foodSize,
            gridLimit: this.#gridLimit,
        })
    }
}

export { Food }
