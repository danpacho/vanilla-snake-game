const SCORE = {
    TIME: 1,
    FOOD: 150,
}

const COLOR = {
    SNAKE: "rgba(0, 161, 70)",
    FOOD: "tomato",
    BOARD: {
        EVEN: "white",
        ODD: "rgba(0, 161, 70, 0.1)",
    },
}

const ENDING_CREDIT = ["스네이크~", "게임은 게임.", "😛", "잘했어요!"]

/** @type {{type: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight", direction: 1 | -1 | 2 | -2}[]} */
const KEYS_INFO = [
    {
        type: "ArrowUp",
        direction: 1,
    },
    {
        type: "ArrowDown",
        direction: -1,
    },
    {
        type: "ArrowLeft",
        direction: -2,
    },
    {
        type: "ArrowRight",
        direction: 2,
    },
]

const KEYS_TYPE_NAMES = Object.values(KEYS_INFO).map(({ type }) => type)

export { SCORE, COLOR, ENDING_CREDIT, KEYS_INFO, KEYS_TYPE_NAMES }
