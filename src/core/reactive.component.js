// @ts-nocheck
import { Component } from "./component.js"
import { track } from "./core.js"

/**
 * Reactive component class wrapper function
 * @param htmlSetter `html` template function
 */
const $component = (htmlSetter) => {
    const $target = new Component({
        template: htmlSetter,
    })

    track(() => {
        $target.updateDOM()
    })
    return $target
}

export { $component }
