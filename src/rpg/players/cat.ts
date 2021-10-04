import portrait_url_hat from "@assets/cat_with_hat.png";
import { Action } from "@rpg/actions";
import { Chilled } from "@rpg/effects/chilled";
import { Ignite } from "@rpg/effects/ignite";
import { Wild } from "@rpg/effects/wild";
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
    instabilityMod: 12,
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

const inferno: Action = {
    id: "inferno",
    name: "Inferno",
    range: "ranged",
    mainTargetImpact: {
        damage: 1,
        effects: [Ignite],
    },
    secondaryTargetImpact: {
        damage: 1,
        effects: [Ignite],
    },
    instabilityMod: 25,
    logTemplate: "{CASTER} uses {NAME} on all enemies, {IMPACT}.",
    waitTime: 4,
    targeting: {
        type: "all",
        filter: "enemy",
    },
};

export class CatPlayer extends Player {
    public static realName = "CatPlayer";
    public id: string = "cat";
    public static actions = [iceKnife, wildMagic, inferno];
    public health = 30;
    public precision = 5;
    public portraitUrl = portrait_url_hat;
}
