import { CanvasManager } from "./canvas.js"
import { numBetween } from "./util.js"

const SCORE = {
    TIME: 1,
    FOOD: 150,
}

const COLOR = {
    SNAKE: "rgba(0, 161, 70)",
    FOOD: "tomato",
    BOARD: {
        EVEN: "white",
        ODD: "rgba(0, 161, 70, 0.1)",
    },
}

const ENDING_CREDIT = ["스네이크~", "게임은 게임.", "😛", "잘했어요!"]

/** @type {{type: ActionType, direc: 1 | -1 | 2 | -2}[]} */
const KEYS_INFO = [
    {
        type: "ArrowUp",
        direc: 1,
    },
    {
        type: "ArrowDown",
        direc: -1,
    },
    {
        type: "ArrowLeft",
        direc: -2,
    },
    {
        type: "ArrowRight",
        direc: 2,
    },
]
const KEYS_TYPE_NAMES = Object.values(KEYS_INFO).map(({ type }) => type)

class SnakeManager {
    /** @type {SnakeManager} */
    static #instance

    /** @type {CanvasManager} */
    #cv

    /** @type {CanvasManager} */
    #board

    /** @type {CanvasRenderingContext2D} */
    #ctx

    /** @type {number} */
    #boardSize

    /** @type {number} */
    #rowCount

    /** @type {Coord | null} */
    #food = null

    /** @type {number} */
    #boxSize

    /** @type {{[key in ActionType]: Coord}} */
    #actionType

    /** @typedef {[number, number]} Coord */
    /** @typedef {Array<Coord>} SnakeBody */
    /** @type {SnakeBody} */
    #snakeBody

    /** @typedef {"ArrowUp" | "ArrowDown" | "ArrowRight" | "ArrowLeft"} ActionType */
    /** @type {{type :ActionType, direc: 1 | -1 | 2 | -2}} */
    #currentDirection = {
        type: "ArrowRight",
        direc: 2,
    }

    /** @type {null | number} */
    #currentPlayID = null

    /** @type {null | number} */
    #throttleID = null

    /** @type { (...arg: any[]) => any;} */
    #scoreSetter

    #score = 0

    /** @type {number} */
    #level

    #isGameOver = false

    /**
     * @param {{ initialLevel: number, boardSize: number, rowCount: number, scoreSetter: (...arg: any[]) => any; className?: string, targetID?: string, }} option
     */
    constructor({
        initialLevel,
        boardSize,
        rowCount,
        scoreSetter,
        className,
        targetID = "app",
    }) {
        SnakeManager.#instance = this

        this.#level = initialLevel

        this.#scoreSetter = scoreSetter
        this.#boardSize = boardSize
        this.#rowCount = rowCount
        this.#boxSize = boardSize / rowCount

        this.#snakeBody = [
            [this.#boxSize, 0],
            [this.#boxSize * 2, 0],
            [this.#boxSize * 3, 0],
        ]

        this.#actionType = {
            ArrowUp: [0, -this.#boxSize],
            ArrowDown: [0, this.#boxSize],
            ArrowRight: [this.#boxSize, 0],
            ArrowLeft: [-this.#boxSize, 0],
        }

        this.#board = new CanvasManager(
            {
                width: boardSize,
                height: boardSize,
            },
            targetID
        )

        this.#cv = new CanvasManager(
            {
                width: boardSize,
                height: boardSize,
            },
            targetID
        )

        this.#ctx = this.#cv.getCtx()
        const canvas = this.#cv.getCanvas()
        const boardCanvas = this.#board.getCanvas()

        if (className) {
            canvas.classList.add(className)
            boardCanvas.classList.add(className)
        }

        this.#food = this.#generateRandomCoord()
        this.#renderBody(this.#food, "red")

        this.#setupKeyboardEvent()

        this.#drawBoard()
        this.#play()
    }

    #drawBoard() {
        const rowNumber = this.#rowCount / 2
        const step = this.#boxSize
        const size = rowNumber
        /** @type {Coord[]} */
        const allBoardCoordinate = Array.from({ length: size ** 2 }, (_, i) => [
            (i * step) % (size ** 2 / (size / step)),
            Math.floor((i * step) / (step * size)) * step,
        ])

        const boardCtx = this.#board.getCtx()
        allBoardCoordinate.forEach((boardCoord, i) => {
            const isEven = i % 2 === 0
            this.#renderBody(
                boardCoord,
                isEven ? COLOR.BOARD.EVEN : COLOR.BOARD.ODD,
                boardCtx
            )
        })
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
     * @param {ActionType} nextDirection
     */
    #updateCurrentDirection(nextDirection) {
        const direcIndex = KEYS_TYPE_NAMES.findIndex(
            (key) => key === nextDirection
        )
        const nextDirec = KEYS_INFO[direcIndex].direc

        if (this.#currentDirection.direc !== -nextDirec) {
            this.#currentDirection = {
                type: nextDirection,
                direc: nextDirec,
            }
        }
    }

    #moveSnakeBody() {
        /** @type {Coord | undefined} */
        const head = this.#snakeBody.at(-1)

        if (head) {
            /** @type {Coord} */
            const newHead = [
                head[0] + this.#actionType[this.#currentDirection.type][0],
                head[1] + this.#actionType[this.#currentDirection.type][1],
            ]
            this.#snakeBody.shift()
            this.#snakeBody.push(newHead)
        }
    }

    #addSnakeBody() {
        /** @type {Coord} */
        // @ts-ignore
        const tail = this.#snakeBody.at(0)
        const head = this.#snakeBody.at(-1)

        const isFoodEaten =
            head &&
            this.#food &&
            head[0] === this.#food[0] &&
            head[1] === this.#food[1]

        if (isFoodEaten) {
            /** @type {Coord} */
            this.#snakeBody = [tail, ...this.#snakeBody]

            this.#addScore(SCORE.FOOD)
            this.#food = this.#generateRandomCoord()
        }
    }

    #generateRandomCoord() {
        /** @type {Coord} */
        const randomCoord = [
            this.#boxSize * numBetween(0, this.#rowCount / 2 - 1),
            this.#boxSize * numBetween(0, this.#rowCount / 2 - 1),
        ]

        return randomCoord
    }

    /**
     * @param {Coord} renderCoord
     */
    #renderBody(renderCoord, fillStyle = COLOR.SNAKE, ctx = this.#ctx) {
        ctx.fillStyle = fillStyle
        ctx.fillRect(
            renderCoord[0],
            renderCoord[1],
            this.#boxSize,
            this.#boxSize
        )
    }

    #gamePlay() {
        this.#cv.clearCanvas()
        this.#moveSnakeBody()
        this.#addSnakeBody()
        this.#snakeBody.forEach((body) => {
            this.#renderBody(body)
        })

        this.#addScore(SCORE.TIME)
        if (this.#food === null) {
            this.#food = this.#generateRandomCoord()
        }
        this.#renderBody(this.#food, COLOR.FOOD)
    }

    #gameEnd() {
        const head = this.#snakeBody.at(-1)
        if (head) {
            const isExitBoard =
                head[0] === -this.#boxSize ||
                head[0] === this.#boardSize / 2 ||
                head[1] === -this.#boxSize ||
                head[1] === this.#boardSize / 2
            const snakeLength = this.#snakeBody.length
            const isSelfCrash = this.#snakeBody.some(
                (body, index) =>
                    index !== snakeLength - 1 &&
                    body[0] === head[0] &&
                    body[1] === head[1]
            )
            return isExitBoard || isSelfCrash
        }
        return false
    }

    /**
     * @param {number} addMount
     */
    #addScore(addMount) {
        this.#score += addMount
        this.#scoreSetter(this.#score)
    }

    /**
     * @param {number} newLevel
     */
    updateLevel(newLevel) {
        if (this.#isGameOver) {
            this.#level = newLevel
            this.#restartGame()
            this.#play()
        }
    }

    #play = () => {
        const throttle = () => {
            this.#throttleID = setTimeout(
                this.#play,
                this.#level,
                "SNAKE_THROTTLE"
            )
        }
        this.#currentPlayID = window.requestAnimationFrame(throttle)

        this.#gamePlay()

        const head = this.#snakeBody.at(-1)
        if (head) {
            const isGameEnd = this.#gameEnd()

            if (isGameEnd) {
                this.#stopGame()
            }
        }
    }

    #stopGame() {
        if (this.#currentPlayID && this.#throttleID) {
            window.cancelAnimationFrame(this.#currentPlayID)
            clearTimeout(this.#throttleID)
        }
        this.#scoreSetter(
            `${this.#score} ${
                ENDING_CREDIT[numBetween(0, ENDING_CREDIT.length - 1)]
            }`
        )
        this.#isGameOver = true
    }

    #restartGame() {
        this.#isGameOver = false

        this.#score = 0
        this.#addScore(0)

        this.#currentPlayID = null
        this.#throttleID = null

        this.#currentDirection = {
            direc: 2,
            type: "ArrowRight",
        }

        this.#cv.clearCanvas()

        this.#food = this.#generateRandomCoord()

        this.#snakeBody = [
            [this.#boxSize, 0],
            [this.#boxSize * 2, 0],
            [this.#boxSize * 3, 0],
        ]
    }

    getEngine() {
        return SnakeManager.#instance ?? this
    }
}

export { SnakeManager }
