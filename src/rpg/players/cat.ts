import portrait_url_hat from "@assets/cat_with_hat.png";
import { Action } from "@rpg/actions";
import { Chilled, Wild } from "@rpg/effects";
import { Player } from "@rpg/player";

const iceKnife: Action = {
    id: "iceKnife",
    name: "Ice Knife",
    range: "ranged",
    waitTime: 3,
    mainTargetImpact: {
        damage: 4,
        effects: [Chilled],
    },
    targeting: {
        type: "single",
        filter: "enemy",
    },
    logTemplate: "{CASTER} uses {NAME} on {MAINTARGET} {IMPACT}.",
    instabilityMod: 10,
};

const wildMagic: Action = {
    id: "wildMagic",
    name: "Wild Magic",
    range: "ranged",
    waitTime: 4,
    mainTargetImpact: {
        damage: 2,
        effects: [Wild],
    },
    targeting: {
        type: "single",
        filter: "enemy",
    },
    logTemplate: "{CASTER} uses {NAME} on {MAINTARGET} {IMPACT}.",
    instabilityMod: 40,
};

export class CatPlayer extends Player {
    public id: string = "cat";
    public static actions = [iceKnife, wildMagic];
    public health = 30;
    public precision = 5;
    public portraitUrl = portrait_url_hat;
}
