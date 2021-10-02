import {
    continueStory,
    getCurrentBeat,
    getCurrentChoices,
    getCurrentSpeakers,
    selectChoice,
    Speaker,
    StoryBeat,
    StoryChoices,
    StoryMessage,
} from "@story";
import cx from "classnames";
import { render } from "preact";
import "./ui.css";

const uiContainer = document.getElementById("ui")!;

if (!uiContainer) {
    throw new Error("missing required #ui element");
}

function getSpeakerName(speaker: Speaker) {
    switch (speaker) {
        default:
            return speaker;
    }
}

interface DialogueMessageProps {
    readonly storyMessage: StoryMessage;
}
const DialogueMessage = ({ storyMessage }: DialogueMessageProps) => {
    const { message, speaker, isNarration } = storyMessage;
    const currentSpeakers = getCurrentSpeakers();
    const currentChoices = getCurrentChoices();

    return (
        <div class={cx("message", speaker, isNarration && "narration")}>
            <Speakers />
            {currentChoices && <DialogueChoices storyChoices={currentChoices} />}
            {speaker !== Speaker.None && (
                <span class={cx("speaker", speaker === currentSpeakers[1] && "speakertag-right")}>
                    {getSpeakerName(speaker)}
                </span>
            )}
            <span class="messageText">{message}</span>
        </div>
    );
};

interface DialogueChoicesProps {
    readonly storyChoices: StoryChoices;
}
const DialogueChoices = ({ storyChoices }: DialogueChoicesProps) => {
    return (
        <ul class="choices">
            {storyChoices.choices.map(({ speaker, message, index }) => (
                <li key={index}>
                    <button
                        class={cx("choice", speaker)}
                        onClick={(event) => {
                            selectChoice(index);
                            event.stopPropagation();
                        }}>
                        {message}
                    </button>
                </li>
            ))}
        </ul>
    );
};
interface StoryBeatProps {
    readonly storyBeat: StoryBeat | undefined;
}
const Beat = ({ storyBeat }: StoryBeatProps) => {
    if (!storyBeat) {
        return null;
    }
    switch (storyBeat.type) {
        case "message":
            return <DialogueMessage storyMessage={storyBeat} />;
    }
};

const Speakers = () => {
    const speakers = getCurrentSpeakers();
    return (
        <>
            {speakers[0] && <div className={cx("speaker-portrait", "left-speaker", speakers[0])} />}
            {speakers[1] && <div className={cx("speaker-portrait", "right-speaker", speakers[1])} />}
        </>
    );
};

const Dialogue = () => {
    const storyBeat = getCurrentBeat();

    return (
        <div id="dialogue" onClick={() => continueStory()}>
            <Beat storyBeat={storyBeat} />
        </div>
    );
};

const UI = () => {
    return (
        <>
            <Dialogue />
        </>
    );
};

export function renderUI() {
    render(<UI />, uiContainer);
}
