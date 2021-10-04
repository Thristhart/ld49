import portait_url from "@assets/rock.png";
import { Action, useAction } from "@rpg/actions";
import { currentCombat } from "@rpg/combat";
import { Entity } from "../entity";

const rest: Action = {
    id: "rest",
    name: "Rest",
    waitTime: 5,
    range: "melee",
    mainTargetImpact: {},
    targeting: { type: "single", filter: "enemy" },
    logTemplate: "The rock quietly rests.",
};

export class Rock extends Entity {
    public static realName = "Rock";
    portraitUrl = portait_url;
    health = 10;
    static actions = [rest];

    doTurn() {
        useAction(rest, this.id, currentCombat!.leftSide[0]);
    }
}
