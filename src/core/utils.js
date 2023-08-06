// @ts-nocheck
/**
 * @param data array-like data
 * @param render describe rendering logic
 */
const map = (data, render) =>
    data.map(render).reduce((string, curr) => `${string}${curr}`, "")

/**
 * @param attributes `DOM` attributes
 */
const setAttributes = (attributes) =>
    attributes
        ? Object.entries(attributes)
              .map(([key, value]) => `${key}=${value}`)
              .reduce((attr, curr) => `${attr} ${curr}`, "")
        : ""

export { map, setAttributes }
