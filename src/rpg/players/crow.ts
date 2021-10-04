import portrait_url from "@assets/crow.png";
import { Action } from "@rpg/actions";
import { Fatigued } from "@rpg/effects/fatigued";
import { Fiesty } from "@rpg/effects/fiesty";
import { Player } from "@rpg/player";

const enervationZone: Action = {
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

const healingAbility: Action = {
    id: "healingAbility",
    name: "Energisation Zone",
    range: "melee",
    mainTargetImpact: {
        healing: 7,
        effects: [Fiesty],
    },
    secondaryTargetImpact: {
        damage: 2,
        effects: [Fiesty],
    },
    instabilityMod: 25,
    logTemplate: "{CASTER} uses {NAME} on {MAINTARGET} draining health from their allies, {IMPACT}.",
    waitTime: 4,
    targeting: {
        type: "all",
        filter: "ally",
    },
};

export class CrowPlayer extends Player {
    public id: string = "crow";
    public portraitUrl = portrait_url;
    public health = 25;
    public static actions = [healingAbility, enervationZone];
}
