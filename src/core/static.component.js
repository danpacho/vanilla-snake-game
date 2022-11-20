// @ts-nocheck
import { Component } from "./component.js"

/**
 * Static component class wrapper function
 * @param htmlSetter `html` template function
 */
const component = (htmlSetter) => {
    const $target = new Component({
        template: htmlSetter,
    })

    return $target
}

export { component }
