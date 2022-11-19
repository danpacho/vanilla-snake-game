import appStyle from "./style/hellow.module.css"

const App = document.getElementById("app")

App.classList.add(appStyle.appFont)
App.innerHTML = `<div class="hellow">Vanilla template</div>`
