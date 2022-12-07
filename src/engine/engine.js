import { INITIAL_GAME_LEVEL, INITIAL_GAME_SCORE } from "../constant/game.js"
import { COLOR, ENDING_CREDIT, SCORE } from "../constant/snake.js"
import { signal } from "../core/core.js"
import { Board } from "./board.js"
import { CanvasManager } from "./canvas.js"
import { Snake } from "./snake.js"
import { util } from "./utils.js"

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

        const snakeCanvas = new CanvasManager()
        this.#snake = new Snake({
            canvas: snakeCanvas,
            boardSize,
            rowCount,
            className,
        })

        const boardCanvas = new CanvasManager()
        this.#board = new Board({
            canvas: boardCanvas,
            boardSize,
            className,
        })

        this.#isGameOver = false

        this.#rowCount = rowCount
        this.#squareSize = boardSize / rowCount
    }

    /**
     * Render snake game
     * @param {string} [renderTargetID]
     */
    render(renderTargetID = "app") {
        this.#board.render({
            fillColorLogic: (i) =>
                i % 2 === 0 ? COLOR.BOARD.EVEN : COLOR.BOARD.ODD,
            size: this.#rowCount / 2,
            step: this.#squareSize,
            renderTargetID,
        })

        this.#snake.canvas.render(renderTargetID)

        this.#renderGame()
    }

    /**
     * Update snake game's level
     * @param {number} newLevel
     */
    updateLevel(newLevel) {
        if (this.#isGameOver) {
            this.#setLevel(newLevel)
            this.#resetGame()
            this.#renderGame()
        }
    }

    #updateGameUI() {
        this.#snake.canvas.clearCanvas()

        this.#snake.snakeBody.forEach((coord) => {
            util.renderSquare({
                coord,
                ctx: this.#snake.ctx,
                size: this.#squareSize,
                fill: COLOR.SNAKE,
            })
        })

        util.renderSquare({
            coord: this.#snake.food.getLocation(),
            ctx: this.#snake.ctx,
            size: this.#squareSize,
            fill: COLOR.FOOD,
        })
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

    #updateGame() {
        this.#updateGameUIState()
        this.#updateGameUI()
    }

    #stopGameUI() {
        if (this.#currentPlayID && this.#throttleID) {
            window.cancelAnimationFrame(this.#currentPlayID)
            clearTimeout(this.#throttleID)
        }
    }

    #stopGameUIState() {
        this.#isGameOver = true

        const finalGameScoreMessage = `${this.scoreBoard()} ${
            ENDING_CREDIT[
                util.randIntBetweenMinMax(0, ENDING_CREDIT.length - 1)
            ]
        }`
        this.#setScoreBoard(finalGameScoreMessage)
    }

    #stopGame() {
        this.#stopGameUIState()
        this.#stopGameUI()
    }

    #restartGameUI() {
        this.#snake.canvas.clearCanvas()
    }

    #restartGameUIState() {
        this.#snake.resetSnakeState()
        this.#isGameOver = false

        this.#setScoreBoard(0)

        this.#currentPlayID = null
        this.#throttleID = null
    }

    #resetGame() {
        this.#restartGameUIState()
        this.#restartGameUI()
    }

    #renderGame = () => {
        const throttle = () => {
            this.#throttleID = setTimeout(
                this.#renderGame,
                this.#level(),
                "SNAKE_THROTTLE"
            )
        }
        this.#currentPlayID = window.requestAnimationFrame(throttle)

        this.#updateGame()

        if (this.#snake.getSnakeDeadState()) {
            this.#stopGame()
        }
    }
}

export { SnakeEngine }
