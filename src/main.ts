import { render } from "@render";
import { continueStory } from "@story";
import "@ui";
import { renderUI } from "@ui";
import "./style.css";

const canvas = document.querySelector("canvas");
if (!canvas) {
    throw new Error("missing canvas somehow");
}

const setCanvasToWindowSize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

window.addEventListener("resize", setCanvasToWindowSize);

setCanvasToWindowSize();

if (import.meta.hot) {
    import.meta.hot.accept();
}

requestAnimationFrame(render);

renderUI();

continueStory();
