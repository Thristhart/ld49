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
    Crow = "crow",
    Cat = "cat",
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

export type StoryBeat = StoryMessage;

const log: StoryBeat[] = [];
const speakers: [Speaker?, Speaker?] = [];

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
    if (story.currentTags && story.currentTags.length !== 0) {
        story.currentTags.forEach((tag) => {
            if (tag.startsWith("speaking:")) {
                const newSpeakers = tag
                    .split("speaking:")[1]
                    .split(",")
                    .map((speaker) => (speaker === "" ? undefined : speaker));
                speakers[0] = newSpeakers[0] as Speaker;
                speakers[1] = newSpeakers[1] as Speaker;
            }
        });
    }
    const currentSpeaker = getSpeaker(current);
    if (currentSpeaker.speaker !== Speaker.None && !speakers.includes(currentSpeaker.speaker)) {
        if (speakers[0]) {
            speakers[1] = currentSpeaker.speaker;
        } else {
            speakers[0] = currentSpeaker.speaker;
        }
    }
    log.push({ ...currentSpeaker, type: "message" });
}

let currentChoices: StoryChoices | undefined;

export const getCurrentBeat = (): StoryBeat | undefined => log[log.length - 1];
export const getCurrentSpeakers = () => speakers;
export const getCurrentChoices = () => currentChoices;

export const continueStory = () => {
    if (story.canContinue) {
        story.Continue();
        parseCurrentText();
        renderUI();
    } else if (story.currentChoices.length > 0 && !currentChoices) {
        currentChoices = {
            type: "choices",
            choices: story.currentChoices.map((choice) => ({ ...getSpeaker(choice.text), index: choice.index })),
        };
        renderUI();
    }
};
export const selectChoice = (choiceIndex: number) => {
    story.ChooseChoiceIndex(choiceIndex);
    currentChoices = undefined;
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
