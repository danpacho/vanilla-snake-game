class CanvasManager {
    #pixelRatio

    #canvas

    #ctx

    /**
     * @param {{ width: number, height: number }} [option]
     */
    constructor(option) {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        this.#canvas = canvas
        this.#pixelRatio = window.devicePixelRatio > 1 ? 2 : 1

        if (ctx === null) {
            throw Error("canvas ctx is null")
        }
        this.#ctx = ctx

        if (option) this.setCanvasSize(option)
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
    setCanvasSize(option) {
        this.width = option.width
        this.height = option.height

        this.#canvas.setAttribute("width", String(option.width))
        this.#canvas.setAttribute("height", String(option.height))

        this.#ctx?.scale(this.#pixelRatio, this.#pixelRatio)
    }

    /**
     * @param {string} [styleClass]
     */
    setCanvasStyle(styleClass) {
        if (styleClass) this.#canvas.classList.add(styleClass)
    }

    getCanvas() {
        return this.#canvas
    }

    getCtx() {
        return this.#ctx
    }

    clearCanvas() {
        // @ts-ignore
        this.#ctx?.clearRect(0, 0, this.width, this.height)
    }
}

export { CanvasManager }
