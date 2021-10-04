import portait_url from "@assets/beholder.png";
import { Action, useAction } from "@rpg/actions";
import { currentCombat } from "@rpg/combat";
import { Exposed } from "@rpg/effects";
import { Entity } from "../entity";

const leer: Action = {
    id: "leer",
    name: "Leer",
    waitTime: 4,
    range: "ranged",
    mainTargetImpact: {
        damage: 2,
        effects: [Exposed],
    },
    targeting: { type: "all", filter: "enemy" },
    logTemplate: "{CASTER} leers at you, {IMPACT}.",
};

export class Beholder extends Entity {
    portraitUrl = portait_url;
    health = 10;
    static actions = [leer];

    doTurn() {
        useAction(leer, this.id, currentCombat!.leftSide[0]);
    }
}
