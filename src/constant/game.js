const GAME_OPTION = {
    BOARD_SIZE: 600,
    ROW_COUNT: 50,
    RENDER_TARGET_ID: "game",
}

const GAME_LEVEL = [
    { text: "easy", level: 150 },
    { text: "medium", level: 100 },
    { text: "hard", level: 75 },
]
const INITIAL_GAME_LEVEL = GAME_LEVEL[1].level

const INITIAL_GAME_SCORE = 0

export { GAME_LEVEL, GAME_OPTION, INITIAL_GAME_LEVEL, INITIAL_GAME_SCORE }
