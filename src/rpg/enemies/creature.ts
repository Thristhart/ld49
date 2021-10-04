import portait_url from "@assets/creature.png";
import { Action, useAction } from "@rpg/actions";
import { currentCombat } from "@rpg/combat";
import { Chilled } from "@rpg/effects/chilled";
import { Entity } from "../entity";

const bite: Action = {
    id: "bite",
    name: "Bite",
    waitTime: 3,
    range: "melee",
    mainTargetImpact: {
        damage: 8,
    },
    targeting: { type: "single", filter: "enemy" },
    logTemplate: "{CASTER} takes a {NAME} out of {MAINTARGET}, {IMPACT}.",
};

const frostyBreath: Action = {
    id: "frostyBreath",
    name: "Frosty Breath",
    waitTime: 5,
    range: "ranged",
    mainTargetImpact: {
        effects: [Chilled],
    },
    targeting: { type: "all", filter: "enemy" },
    logTemplate: "{CASTER}'s {NAME} chills their opponents, {IMPACT}.",
};

export class Creature extends Entity {
    public static realName = "Creature";
    portraitUrl = portait_url;
    health = 60;
    static actions = [bite, frostyBreath];
    lastAction = bite;

    chooseAnEnemy(enemies: string[]): string {
        let roll = Math.floor(Math.random() * enemies.length);
        return enemies[roll];
    }

    chooseAnAction(actions: Action[]): Action {
        if (this.lastAction === frostyBreath) {
            return bite;
        }
        let roll = Math.floor(Math.random() * actions.length);
        return actions[roll];
    }

    doTurn() {
        let nextAction = this.chooseAnAction(Creature.actions);
        let target = currentCombat!.leftSide[0];
        if (nextAction === bite) {
            target = this.chooseAnEnemy(currentCombat!.leftSide);
        }
        useAction(nextAction, this.id, target);
    }
}
