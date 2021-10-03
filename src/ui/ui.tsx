import { shouldShowDialog } from "@story";
import { Dialogue } from "@ui/Dialogue";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { CombatLog } from "./CombatLog";
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
            {shouldShowDialog() ? <Dialogue /> : <CombatLog />}
        </>
    );
};

export function renderUI() {
    forceRender();
}

export function setupUI() {
    ReactDOM.render(<UI />, uiContainer);
}
