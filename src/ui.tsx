import { continueStory, getLog, selectChoice, StoryChoices, StoryMessage } from "@story";
import cx from "classnames";
import { render } from "preact";
import "./ui.css";

const uiContainer = document.getElementById("ui")!;

if (!uiContainer) {
    throw new Error("missing required #ui element");
}

interface DialogueMessageProps {
    readonly storyMessage: StoryMessage;
}
const DialogueMessage = ({ storyMessage }: DialogueMessageProps) => {
    const { message, speaker, isNarration } = storyMessage;
    return <div class={cx("message", speaker, isNarration && "narration")}>{message}</div>;
};

interface DialogueChoicesProps {
    readonly storyChoices: StoryChoices;
}
const DialogueChoices = ({ storyChoices }: DialogueChoicesProps) => {
    return (
        <ul>
            {storyChoices.choices.map(({ speaker, message, index }) => (
                <li key={index}>
                    <button class={cx("choice", speaker)} onClick={() => selectChoice(index)}>
                        {message}
                    </button>
                </li>
            ))}
        </ul>
    );
};
const Dialogue = () => {
    const log = getLog();

    return (
        <div id="dialogue">
            {log.map((storyBeat, index) => {
                switch (storyBeat.type) {
                    case "message":
                        return <DialogueMessage storyMessage={storyBeat} key={index} />;
                    case "choices":
                        return <DialogueChoices storyChoices={storyBeat} key={index} />;
                }
            })}
        </div>
    );
};

const UI = () => {
    return (
        <>
            <Dialogue />
            <div onClick={() => continueStory()} id="backdrop"></div>
        </>
    );
};

export function renderUI() {
    render(<UI />, uiContainer);
}
