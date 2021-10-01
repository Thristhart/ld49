import storyContent from "@ink/main.ink";
import { renderUI } from "@ui";
import { Story } from "inkjs/engine/Story";

let story = new Story(storyContent);

if (import.meta.env.DEV) {
    //@ts-ignore
    window.DEBUG_STORY = story;
}

export enum Speaker {
    None = "none",
}

export interface StoryMessage {
    readonly type: "message";
    readonly speaker: Speaker;
    readonly message: string;
    readonly isNarration: boolean;
}
export interface StoryChoice {
    readonly speaker: Speaker;
    readonly message: string;
    readonly index: number;
}
export interface StoryChoices {
    readonly type: "choices";
    readonly choices: StoryChoice[];
}

type StoryBeat = StoryMessage | StoryChoices;

const log: StoryBeat[] = [];

const SPEAKER_REGEX = /(\w+)(\$?):\s?(.*)/;

function getSpeaker(text: string) {
    let speaker: Speaker = Speaker.None;
    let isNarration = true;

    let message = text;

    const match = message.match(SPEAKER_REGEX);
    if (match) {
        speaker = match[1] as Speaker;
        isNarration = !!match[2];
        message = match[3];
    }
    return { speaker, message, isNarration };
}

function parseCurrentText() {
    const current = story.currentText;
    if (!current) {
        return;
    }
    log.push({ ...getSpeaker(current), type: "message" });
}

export const getLog = () => log;
export const continueStory = () => {
    if (story.canContinue) {
        story.Continue();
        parseCurrentText();
        renderUI();
    } else if (story.currentChoices.length > 0 && log[log.length - 1].type !== "choices") {
        log.push({
            type: "choices",
            choices: story.currentChoices.map((choice) => ({ ...getSpeaker(choice.text), index: choice.index })),
        });
        renderUI();
    }
};
export const selectChoice = (choiceIndex: number) => {
    story.ChooseChoiceIndex(choiceIndex);
    log.pop();
    continueStory();
};

if (import.meta.hot) {
    import.meta.hot.accept();
    import.meta.hot.accept("/src/ink/main.ink", (main) => {
        const saveStateJSON = story.state.toJson();
        const newStory = new Story(main.default);
        newStory.state.LoadJson(saveStateJSON);
        story = newStory;
        //@ts-ignore
        window.DEBUG_STORY = story;
    });
}
