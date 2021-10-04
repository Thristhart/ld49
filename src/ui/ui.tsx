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
