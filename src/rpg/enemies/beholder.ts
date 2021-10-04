import portait_url from "@assets/beholder.png";
import { Action, useAction } from "@rpg/actions";
import { currentCombat } from "@rpg/combat";
import { Entity } from "../entity";

const blink: Action = {
    id: "blink",
    name: "Blink",
    waitTime: 5,
    range: "ranged",
    mainTargetImpact: {},
    targeting: { type: "all", filter: "enemy" },
    logTemplate: "{CASTER} blinks at you.",
};

export class Beholder extends Entity {
    portraitUrl = portait_url;
    health = 10;
    static actions = [blink];

    doTurn() {
        useAction(blink, this.id, currentCombat!.leftSide[0]);
    }
}
