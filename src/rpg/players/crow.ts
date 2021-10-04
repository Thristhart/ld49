import portrait_url from "@assets/crow.png";
import { Action } from "@rpg/actions";
import { Fatigued } from "@rpg/effects";
import { Player } from "@rpg/player";

const iceKnife: Action = {
    id: "evervationZone",
    name: "Enervation Zone",
    range: "ranged",
    mainTargetImpact: {
        damage: 1,
        effects: [Fatigued],
    },
    secondaryTargetImpact: {
        damage: 1,
        effects: [Fatigued],
    },
    instabilityMod: 25,
    logTemplate: "{CASTER} uses {NAME} on all enemies, {IMPACT}.",
    waitTime: 4,
    targeting: {
        type: "all",
        filter: "enemy",
    },
};

export class CrowPlayer extends Player {
    public id: string = "crow";
    public portraitUrl = portrait_url;
    public health = 25;
    public static actions = [iceKnife];
}
