import { KEYS_INFO, KEYS_TYPE_NAMES } from "../constant/snake.js"
import { Food } from "./food.js"

class Snake {
    /** @type {Snake} */
    static #instance

    canvas

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

    /** @typedef {{ setCanvasSize: ({ width, height }: { width: number, height: number }) => void, getCtx: () => CanvasRenderingContext2D, getCanvas: () => HTMLCanvasElement, render: (targetID?: string | undefined) => void, clearCanvas: () => void, setCanvasStyle: (styleClass?: string | undefined) => void  }} CanvasInterface */
    /**
     * @param {{ canvas: CanvasInterface ,boardSize: number, rowCount: number, className?: string }} option
     */
    constructor({ canvas, boardSize, rowCount, className }) {
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

        this.canvas = canvas
        this.canvas.setCanvasSize({
            width: boardSize,
            height: boardSize,
        })
        this.canvas.setCanvasStyle(className)
        this.ctx = this.canvas.getCtx()

        this.food = new Food({
            foodSize: this.squareSize,
            gridLimit: rowCount / 2 - 1,
        })

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

    getSnake() {
        return Snake.#instance ?? this
    }
}

export { Snake }
