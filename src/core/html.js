// @ts-nocheck
/**
 * Support syntax highlighting, returns `string`.
 * @note Use it with `lit-html` vscode plugin for syntax highlighting.
 */
const html = (templateStrings, ...variables) => {
    const toStringVariables = variables.map((v) =>
        // eslint-disable-next-line no-nested-ternary
        v ? (typeof v === "string" ? v : String(v)) : ""
    )
    return toStringVariables.reduce(
        (finalString, variable, index) =>
            `${finalString}${variable}${templateStrings[index + 1]}`,
        templateStrings[0] ?? ""
    )
}

export { html }
