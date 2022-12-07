import { util } from "./utils.js"

class Board {
    #board

    /** @typedef  {{ setCanvasSize: ({ width, height }: { width: number, height: number }) => void, getCtx: () => CanvasRenderingContext2D, getCanvas: () => HTMLCanvasElement, render: (targetID?: string | undefined) => void, setCanvasStyle: (styleClass?: string | undefined) => void }} CanvasInterface */
    /**
     * @param {{canvas: CanvasInterface, boardSize: number, className?: string}} BoardOption
     */
    constructor({ canvas, boardSize, className }) {
        this.#board = canvas
        this.#board.setCanvasSize({
            width: boardSize,
            height: boardSize,
        })
        this.#board.setCanvasStyle(className)
    }

    /**
     * @param {{step: number, size: number, fillColorLogic: (boardIndex: number) => string, renderTargetID?: string}} drawOption
     */
    render({ step, size, fillColorLogic, renderTargetID = "app" }) {
        this.#board.render(renderTargetID)

        /** @type {Array<[number, number]>} */
        const allBoardCoordinate = Array.from({ length: size ** 2 }, (_, i) => [
            (i * step) % (size ** 2 / (size / step)),
            Math.floor((i * step) / (step * size)) * step,
        ])

        allBoardCoordinate.forEach((coord, i) => {
            util.renderSquare({
                coord,
                ctx: this.#board.getCtx(),
                fill: fillColorLogic(i),
                size,
            })
        })
    }
}

export { Board }
