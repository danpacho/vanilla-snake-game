import { CanvasManager } from "./canvas.js"
import { renderSquare } from "./util.js"

class Board {
    #board

    /**
     * @param {{boardSize: number, className?: string}} BoardOption
     */
    constructor({ boardSize, className }) {
        this.#board = new CanvasManager({
            width: boardSize,
            height: boardSize,
        })
        if (className) {
            this.#board.getCanvas().classList.add(className)
        }
    }

    /**
     * @param {{step: number, size: number, fillColorLogic: (boardIndex: number) => string, renderTargetID?: string}} drawOption
     */
    renderBoard({ step, size, fillColorLogic, renderTargetID = "app" }) {
        this.#board.render(renderTargetID)

        /** @type {Array<[number, number]>} */
        const allBoardCoordinate = Array.from({ length: size ** 2 }, (_, i) => [
            (i * step) % (size ** 2 / (size / step)),
            Math.floor((i * step) / (step * size)) * step,
        ])

        allBoardCoordinate.forEach((coord, i) => {
            renderSquare({
                coord,
                ctx: this.#board.getCtx(),
                fill: fillColorLogic(i),
                size,
            })
        })
        return allBoardCoordinate
    }
}

export { Board }
