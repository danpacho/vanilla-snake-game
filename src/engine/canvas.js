class CanvasManager {
    #pixelRatio

    #canvas

    #ctx

    /**
     * @param {{ width: number, height: number }} option
     */
    constructor(option) {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        this.#pixelRatio = window.devicePixelRatio > 1 ? 2 : 1
        this.#canvas = canvas
        if (ctx === null) {
            throw Error("canvas ctx is null")
        }
        this.#ctx = ctx
        this.option = option

        this.#setupCanvasSize(option)
    }

    /**
     * @param {string} [targetID]
     */
    render(targetID = "app") {
        const renderTarget = document.getElementById(targetID)
        renderTarget?.appendChild(this.#canvas)
    }

    /**
     * @param {{ width: number, height: number }} option
     */
    #setupCanvasSize(option) {
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
}

export { CanvasManager }
