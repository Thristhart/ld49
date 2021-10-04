import { instability } from "@rpg/combat";
import cx from "classnames";
import "./InstabilityMeter.css";

export const InstabilityMeter = () => {
    return (
        <div id="instabilityMeter" className={cx(instability > 50 && "medium", instability > 75 && "extreme")}>
            <div className="instabilityBarContainer">
                <div className={"instabilityBar"} style={{ width: `${instability}%` }} />
            </div>
            <span className="instabilityLabel">INSTABILITY</span>
        </div>
    );
};

if ("registerProperty" in CSS) {
    try {
        // @ts-ignore
        window.CSS.registerProperty({
            name: "--instability-color-0",
            syntax: "<color>",
            inherits: false,
            initialValue: "white",
        });
        // @ts-ignore
        window.CSS.registerProperty({
            name: "--instability-color-1",
            syntax: "<color>",
            inherits: false,
            initialValue: "white",
        });
        // @ts-ignore
        window.CSS.registerProperty({
            name: "--instability-color-2",
            syntax: "<color>",
            inherits: false,
            initialValue: "white",
        });
    } catch (e) {}
}
