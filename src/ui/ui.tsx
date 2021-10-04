import { shouldShowDialog } from "@story";
import { Dialogue } from "@ui/Dialogue";
import { render } from "preact";
import { useState } from "preact/hooks";
import { RPG } from "./RPG";
import "./ui.css";

const uiContainer = document.getElementById("ui")!;

if (!uiContainer) {
    throw new Error("missing required #ui element");
}

let forceRender: () => void = () => {};
const UI = () => {
    const [_, setRenderCounter] = useState(0);
    forceRender = () => setRenderCounter((val) => (val + 1) % 32);
    const [isTitleScreen, setIsTitleScreen] = useState(true);

    if (isTitleScreen) {
        return (
            <div id="titleScreen" onClick={() => setIsTitleScreen(false)}>
                <span className="title1">CASSIE'S</span>
                <div id="logo" />
                <span className="title2">HAT</span>
            </div>
        );
    }
    return (
        <>
            <RPG />
            {shouldShowDialog() && <Dialogue />}
        </>
    );
};

export function renderUI() {
    forceRender();
}

export function setupUI() {
    render(<UI />, uiContainer);
}
