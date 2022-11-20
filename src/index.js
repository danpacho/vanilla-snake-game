import { $component, component, html, signal, track } from "./core"
import { SnakeManager } from "./engine/snake.js"
// @ts-ignore
import style from "./index.module.css"

const App = () =>
    component(
        () => html`
            <div class="${style.container}">
                <div id="game" class="${style.canvasContainer}"></div>
                <nav class="${style.stateContainer}">
                    <div id="score"></div>
                    <div
                        id="levelContainer"
                        class="${style.levelContainer}"
                    ></div>
                </div>
            </div>
        `
    )
App().render()

const GAME_LEVEL = [
    { text: "easy", level: 150 },
    { text: "medium", level: 100 },
    { text: "hard", level: 75 },
]
const GAME_OPTION = {
    BOARD_SIZE: 600,
    ROW_COUNT: 50,
    RENDER_TARGET_ID: "game",
}

const [level, setLevel] = signal(GAME_LEVEL[1].level)
const [score, setScore] = signal(0)

const Snake = new SnakeManager({
    boardSize: GAME_OPTION.BOARD_SIZE,
    rowCount: GAME_OPTION.ROW_COUNT,
    targetID: GAME_OPTION.RENDER_TARGET_ID,
    initialLevel: level(),
    scoreSetter: setScore,
    className: style.canvas,
}).getEngine()

track(() => {
    Snake.updateLevel(level())
})

/**
 * @param {{text: string, level: number}} props
 * @returns
 */
const LevelButton = ({ text, level: levelType }) =>
    $component(
        () =>
            html`
                <button type="button" id="btn" class="${style.btn}">
                    ${text}
                </button>
            `
    ).addEvent(() => ({
        type: "click",
        handler: () => {
            setLevel(levelType)
        },
    }))

GAME_LEVEL.forEach((levelProps) => {
    LevelButton(levelProps).render("levelContainer")
})

const Score = () =>
    $component(() => html` <h1 class="${style.score}">Snake🐍 ${score()}</h1>`)
Score().render("score")
