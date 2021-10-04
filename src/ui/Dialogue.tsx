import {
    continueStory,
    getCurrentBeat,
    getCurrentChoices,
    getCurrentSpeakers,
    getStoryDecoratorsClassName,
    selectChoice,
    Speaker,
    StoryBeat,
    StoryChoices,
    StoryMessage,
} from "@story";
import cx from "classnames";
import "./Dialogue.css";

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
        <div className={cx("message", speaker, isNarration && "narration")}>
            <Speakers />
            {currentChoices && <DialogueChoices storyChoices={currentChoices} />}
            {speaker !== Speaker.None && (
                <span className={cx("speaker", speaker === currentSpeakers[1] && "speakertag-right")}>
                    {getSpeakerName(speaker)}
                </span>
            )}
            <span className="messageText">{message}</span>
        </div>
    );
};

interface DialogueChoicesProps {
    readonly storyChoices: StoryChoices;
}
const DialogueChoices = ({ storyChoices }: DialogueChoicesProps) => {
    return (
        <ul className="choices">
            {storyChoices.choices.map(({ speaker, message, index }) => (
                <li key={index}>
                    <button
                        className={cx("choice", speaker)}
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

export const Dialogue = () => {
    const storyBeat = getCurrentBeat();

    return (
        <div
            className={getStoryDecoratorsClassName()}
            id="dialogue"
            onClick={(event) => {
                const didContinue = continueStory();
                if (didContinue) {
                    event.preventDefault();
                }
            }}>
            <Beat storyBeat={storyBeat} />
        </div>
    );
};
