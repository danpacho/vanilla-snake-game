import { KEYS_INFO, KEYS_TYPE_NAMES } from "../constant/snake.js"
import { CanvasManager } from "./canvas.js"
import { Food } from "./food.js"

class Snake {
    /** @type {Snake} */
    static #instance

    gameCanvas

    ctx

    boardSize

    rowCount

    squareSize

    food

    actionType

    /** @typedef {[number, number]} Coord */
    /** @typedef {Array<Coord>} SnakeBody */
    /** @type {SnakeBody} */
    snakeBody

    /** @typedef {"ArrowUp" | "ArrowDown" | "ArrowRight" | "ArrowLeft"} ActionType */
    /** @type {{type :ActionType, direction: 1 | -1 | 2 | -2}} */
    currentDirection = {
        type: "ArrowRight",
        direction: 2,
    }

    /**
     * @param {{ boardSize: number, rowCount: number, className?: string }} option
     */
    constructor({ boardSize, rowCount, className }) {
        Snake.#instance = this

        this.boardSize = boardSize
        this.rowCount = rowCount
        this.squareSize = boardSize / rowCount

        this.snakeBody = [
            [this.squareSize, 0],
            [this.squareSize * 2, 0],
            [this.squareSize * 3, 0],
        ]
        this.actionType = {
            ArrowUp: [0, -this.squareSize],
            ArrowDown: [0, this.squareSize],
            ArrowRight: [this.squareSize, 0],
            ArrowLeft: [-this.squareSize, 0],
        }

        this.gameCanvas = new CanvasManager({
            width: boardSize,
            height: boardSize,
        })
        this.ctx = this.gameCanvas.getCtx()

        this.food = new Food({
            ctx: this.ctx,
            foodSize: this.squareSize,
            gridLimit: rowCount / 2 - 1,
        })

        if (className) {
            this.gameCanvas.getCanvas().classList.add(className)
        }

        this.#setupKeyboardEvent()
    }

    #setupKeyboardEvent() {
        window.addEventListener("keydown", (e) => {
            const actionType = e.key
            // @ts-ignore
            if (KEYS_TYPE_NAMES.includes(actionType)) {
                // @ts-ignore
                this.#updateCurrentDirection(actionType)
            }
        })
    }

    /**
     * @param {ActionType} nextDirectionType
     */
    #updateCurrentDirection(nextDirectionType) {
        const directionIndex = KEYS_TYPE_NAMES.findIndex(
            (key) => key === nextDirectionType
        )
        const nextDirection = KEYS_INFO[directionIndex].direction

        const isNotOppositeDirection =
            this.currentDirection.direction !== -nextDirection

        if (isNotOppositeDirection) {
            this.currentDirection = {
                type: nextDirectionType,
                direction: nextDirection,
            }
        }
    }

    moveSnakeBody() {
        /** @type {Coord | undefined} */
        const head = this.snakeBody.at(-1)

        if (head) {
            /** @type {Coord} */
            const newHead = [
                head[0] + this.actionType[this.currentDirection.type][0],
                head[1] + this.actionType[this.currentDirection.type][1],
            ]
            this.snakeBody.shift()
            this.snakeBody.push(newHead)
        }
    }

    getSnakeFoodEatenState() {
        const head = this.snakeBody.at(-1)

        return (
            head &&
            this.food &&
            head[0] === this.food.getLocation()[0] &&
            head[1] === this.food.getLocation()[1]
        )
    }

    addSnakeBody() {
        /** @type {Coord} */
        // @ts-ignore
        const tail = this.snakeBody.at(0)

        /** @type {Coord} */
        this.snakeBody = [tail, ...this.snakeBody]

        this.food.updateLocation()
    }

    getSnakeDeadState() {
        const head = this.snakeBody.at(-1)

        if (head) {
            const isBorderCollide =
                head[0] === -this.squareSize ||
                head[0] === this.boardSize / 2 ||
                head[1] === -this.squareSize ||
                head[1] === this.boardSize / 2

            const snakeHeadIndex = this.snakeBody.length - 1
            const isSnakeSelfCollide = this.snakeBody.some(
                (body, index) =>
                    index !== snakeHeadIndex &&
                    body[0] === head[0] &&
                    body[1] === head[1]
            )

            return isBorderCollide || isSnakeSelfCollide
        }

        return false
    }

    resetSnakeState() {
        this.currentDirection = {
            direction: 2,
            type: "ArrowRight",
        }

        this.food.updateLocation()

        this.snakeBody = [
            [this.squareSize, 0],
            [this.squareSize * 2, 0],
            [this.squareSize * 3, 0],
        ]
    }

    getSnakeEngine() {
        return Snake.#instance ?? this
    }
}

export { Snake }
