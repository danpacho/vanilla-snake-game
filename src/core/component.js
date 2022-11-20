// @ts-nocheck
/**
 * Get default `fragment` element. It's like react `fragment`.
 * @note  For practical fragment role, `display: "contents"` makes it acting like non-exisisting element.
 * @param template HTML setter function
 * @param id fragment unique ID
 */
const createFragment = (template, id) => {
    const fragment = document.createElement("div")
    fragment.id = id
    fragment.innerHTML = template()
    fragment.style.display = "contents"
    return {
        fragment,
    }
}

const DEFAULT_RENDER_TARGET_ID = "app"

class Component {
    #eventInfoList = []

    #renderTargetID = DEFAULT_RENDER_TARGET_ID

    #fragment

    #ref

    template

    id

    constructor({ template }) {
        const id = window.crypto.randomUUID()
        const { fragment } = createFragment(template, id)

        this.#fragment = fragment
        this.#ref = this.#fragment

        this.id = id
        this.template = template
    }

    #updateRenderTargetID(newID) {
        this.#renderTargetID = newID
    }

    /**
     * Update `ref` element
     */
    #updateRef() {
        this.#ref = this.#fragment
    }

    /**
     * Mount `fragment` `DOM` element at `this.#renderTargetID`
     */
    #mount(renderTargetID = "app") {
        if (renderTargetID) {
            this.#updateRenderTargetID(renderTargetID)
        }
        const target = document.getElementById(this.#renderTargetID)
        target?.appendChild(this.#fragment)

        this.mountEvent()
    }

    /**
     * Update `HTML` template in fragment
     * @note core functionality of updating `DOM`.
     */
    updateDOM() {
        this.#fragment.innerHTML = this.template()
        this.#updateRef()
    }

    /**
     * Use fragment element, when mounted to the `DOM` tree.
     * @note should be called after `render` or `staticRender`
     * @param mountedCallback get mounted fragment as first argument
     * @example
     * .onMounted((fragment) => {
     *  // use fragment DOM in callback
     * })
     */
    onMounted(mountedCallback, renderTargetID = "app") {
        this.#mount(renderTargetID)
        mountedCallback({ target: this.#fragment })
        return this
    }

    /**
     * Render statefull component
     * @param renderTargetID if renderTargetID is provided, component will be mounted there
     */
    render(renderTargetID = "app") {
        this.#mount(renderTargetID)
        return this
    }

    /**
     * Get `fragment` reference.
     * @note Same as current fragment, but it is not mounted in `DOM` tree.
     */
    ref() {
        return this.#ref
    }

    #updateEventHandler(updateIndex, updatedHandler) {
        const updatedEventInfo = {
            ...this.#eventInfoList[updateIndex],
            handler: updatedHandler,
        }
        this.#eventInfoList.splice(updateIndex, 1, updatedEventInfo)
    }

    /**
     * Add eventlistner
     * @param eventHandler returns `evntInfo` that is stored in specific component
     */
    addEvent(eventHandler) {
        const eventInfo = eventHandler({ target: this.#fragment })
        const { handler, type, name } = eventInfo

        this.#eventInfoList.push({
            name,
            type,
            handler,
            targetType: eventInfo.targetType,
            targetId: eventInfo.targetId,
        })

        return this
    }

    /**
     * Mount event at the `fragment`
     * @note sync event with component rendering cycles.
     */
    mountEvent() {
        this.#eventInfoList.forEach((eventInfo, index) => {
            const { type } = eventInfo
            if (eventInfo.targetType === "window") {
                const handler = (e) => {
                    eventInfo.handler(e)
                }
                this.#updateEventHandler(index, handler)

                window.addEventListener(type, handler)
                return this
            }
            const handler = (e) => {
                if (eventInfo?.targetId) {
                    if (e.target.id === eventInfo.targetId) {
                        eventInfo.handler(e)
                    }
                } else {
                    eventInfo.handler(e)
                }
            }
            this.#updateEventHandler(index, handler)

            this.#fragment.addEventListener(type, handler)
            return this
        })
    }

    /**
     * Remove specific eventw
     * @param targetName remove event target name
     */
    removeEvent(targetName) {
        const removedEventInfoList = this.#eventInfoList.filter(
            (e) => e.name !== targetName
        )
        this.#eventInfoList = removedEventInfoList
        return this
    }
}

export { Component }
