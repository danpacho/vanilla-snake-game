// @ts-ignore
import style from "./app.module.css"
import { GAME_LEVEL, GAME_OPTION } from "./constant/game.js"
import { $component, component, html } from "./core/index.js"
import { SnakeEngine } from "./engine/engine.js"

const SnakeGame = () => {
    const Snake = new SnakeEngine({
        boardSize: GAME_OPTION.BOARD_SIZE,
        rowCount: GAME_OPTION.ROW_COUNT,
        className: style.canvas,
    })

    const AppContainer = component(
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

    /**
     * @param {{text: string, level: number}} props
     */
    const LevelButton = ({ text, level }) =>
        $component(
            () =>
                html`
                    <button type="button" class="${style.btn}">${text}</button>
                `
        ).addEvent(() => ({
            type: "click",
            handler: () => {
                Snake.updateLevel(level)
            },
        }))

    const Score = () =>
        $component(
            () =>
                html` <h1 class="${style.score}">
                    Snake🐍 ${Snake.scoreBoard()}
                </h1>`
        )

    return {
        render: () => {
            AppContainer.render()
            Snake.render("game")

            GAME_LEVEL.forEach((levelProps) => {
                LevelButton(levelProps).render("levelContainer")
            })
            Score().render("score")
        },
    }
}

export { SnakeGame }
