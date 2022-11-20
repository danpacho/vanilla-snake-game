class CanvasManager {
    /** @type CanvasManager */
    static #instance

    #pixelRatio

    #canvas

    /** @type {CanvasRenderingContext2D} */
    #ctx

    /**
     * @param {{ width: number, height: number }} option
     * @param {string} [targetID]
     */
    constructor(option, targetID = "app") {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        this.#pixelRatio = window.devicePixelRatio > 1 ? 2 : 1
        this.#canvas = canvas
        if (ctx === null) {
            throw Error("canvas ctx is null")
        }
        this.#ctx = ctx
        this.option = option

        this.#mount(targetID)
        this.#setupCanvas(option)
    }

    /**
     * @param {string} [targetID]
     */
    #mount(targetID = "app") {
        const renderTarget = document.getElementById(targetID)
        renderTarget?.appendChild(this.#canvas)
    }

    /**
     * @param {{ width: number, height: number }} option
     */
    #setupCanvas(option) {
        this.#canvas.setAttribute("width", String(option.width))
        this.#canvas.setAttribute("height", String(option.height))

        this.#ctx?.scale(this.#pixelRatio, this.#pixelRatio)
    }

    getCanvas() {
        return this.#canvas
    }

    getCtx() {
        return this.#ctx
    }

    clearCanvas() {
        this.#ctx?.clearRect(0, 0, this.option.width, this.option.height)
    }

    trailingCanvas(opacity = 0.75) {
        const TRAILING_COLOR = `rgba(255, 255, 255, ${String(opacity)})`
        // @ts-ignore
        this.#ctx.fillStyle = TRAILING_COLOR
        this.#ctx?.fillRect(0, 0, this.option.width, this.option.height)
    }
}

export { CanvasManager }
