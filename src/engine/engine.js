import { INITIAL_GAME_LEVEL, INITIAL_GAME_SCORE } from "../constant/game.js"
import { COLOR, ENDING_CREDIT, SCORE } from "../constant/snake.js"
import { signal } from "../core/core.js"
import { Board } from "./board.js"
import { Snake } from "./snake.js"
import { randBetweenMinMax, renderSquare } from "./util.js"

class SnakeEngine {
    #snake

    #board

    #rowCount

    #squareSize

    #isGameOver

    /** @type {number | null} */
    #throttleID = null

    /** @type {number | null} */
    #currentPlayID = null

    #level

    #setLevel

    scoreBoard

    #setScoreBoard

    /**
     * @param {{ boardSize: number, rowCount: number, className?: string }} option
     */
    constructor({ boardSize, rowCount, className }) {
        const [scoreBoard, setScoreBoard] = signal(INITIAL_GAME_SCORE)
        this.scoreBoard = scoreBoard
        this.#setScoreBoard = setScoreBoard

        const [level, setLevel] = signal(INITIAL_GAME_LEVEL)
        this.#level = level
        this.#setLevel = setLevel

        this.#snake = new Snake({
            boardSize,
            rowCount,
            className,
        })

        this.#board = new Board({
            boardSize,
            className,
        })

        this.#isGameOver = false

        this.#rowCount = rowCount
        this.#squareSize = boardSize / rowCount
    }

    /**
     * @param {string} [renderTargetID]
     */
    render(renderTargetID = "app") {
        this.#board.renderBoard({
            fillColorLogic: (i) =>
                i % 2 === 0 ? COLOR.BOARD.EVEN : COLOR.BOARD.ODD,
            size: this.#rowCount / 2,
            step: this.#squareSize,
            renderTargetID,
        })

        this.#snake.gameCanvas.render(renderTargetID)

        this.#playGame()
    }

    /**
     * @param {number} newLevel
     */
    updateLevel(newLevel) {
        if (this.#isGameOver) {
            this.#setLevel(newLevel)

            this.#resetGameUI()
            this.#resetGameUIState()

            this.#playGame()
        }
    }

    #updateGameUIState() {
        this.#snake.moveSnakeBody()

        if (this.#snake.getSnakeFoodEatenState()) {
            this.#setScoreBoard(
                (/** @type {number} */ score) => score + SCORE.FOOD
            )
            this.#snake.addSnakeBody()
        }

        this.#setScoreBoard((/** @type {number} */ score) => score + SCORE.TIME)
    }

    #updateGameUI() {
        this.#snake.gameCanvas.clearCanvas()

        this.#snake.snakeBody.forEach((coord) => {
            renderSquare({
                coord,
                ctx: this.#snake.ctx,
                size: this.#squareSize,
                fill: COLOR.SNAKE,
            })
        })

        renderSquare({
            coord: this.#snake.food.getLocation(),
            ctx: this.#snake.ctx,
            size: this.#squareSize,
            fill: COLOR.FOOD,
        })
    }

    #stopGameUI() {
        if (this.#currentPlayID && this.#throttleID) {
            window.cancelAnimationFrame(this.#currentPlayID)
            clearTimeout(this.#throttleID)
        }
    }

    #stopGameUIState() {
        this.#isGameOver = true

        this.#setScoreBoard(
            `${this.scoreBoard()} ${
                ENDING_CREDIT[randBetweenMinMax(0, ENDING_CREDIT.length - 1)]
            }`
        )
    }

    #resetGameUI() {
        this.#snake.gameCanvas.clearCanvas()
    }

    #resetGameUIState() {
        this.#snake.resetSnakeState()
        this.#isGameOver = false

        this.#setScoreBoard(0)

        this.#currentPlayID = null
        this.#throttleID = null
    }

    #playGame = () => {
        const throttle = () => {
            this.#throttleID = setTimeout(
                this.#playGame,
                this.#level(),
                "SNAKE_THROTTLE"
            )
        }
        this.#currentPlayID = window.requestAnimationFrame(throttle)

        this.#updateGameUIState()
        this.#updateGameUI()

        if (this.#snake.getSnakeDeadState()) {
            this.#stopGameUI()
            this.#stopGameUIState()
        }
    }
}

export { SnakeEngine }
