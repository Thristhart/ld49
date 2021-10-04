import portait_url from "@assets/dog.png";
import { Action, useAction } from "@rpg/actions";
import { currentCombat } from "@rpg/combat";
import { Encouraged } from "@rpg/encouraged";
import { Entity } from "../entity";

const slash: Action = {
    id: "slash",
    name: "Slash",
    waitTime: 2,
    range: "melee",
    mainTargetImpact: {
        damage: 6,
    },
    targeting: { type: "single", filter: "enemy" },
    logTemplate: "{CASTER} uses her big sword to {NAME} {MAINTARGET}, {IMPACT}.",
};

const beAGoodGirl: Action = {
    id: "beAGoodGirl",
    name: "Be A Good Girl",
    waitTime: 6,
    range: "ranged",
    mainTargetImpact: {
        effects: [Encouraged],
    },
    targeting: { type: "single", filter: "ally" },
    logTemplate: "{CASTER}'s uses {NAME} and is encouraged by her teammates, {IMPACT}.",
};

export class Dog extends Entity {
    public static realName = "Dog";
    portraitUrl = portait_url;
    health = 60;
    static actions = [slash, beAGoodGirl];
    lastAction = slash;

    chooseAnEnemy(enemies: string[]): string {
        let roll = Math.floor(Math.random() * enemies.length);
        return enemies[roll];
    }

    chooseAnAction(actions: Action[]): Action {
        if (this.lastAction === beAGoodGirl) {
            return slash;
        }
        let roll = Math.floor(Math.random() * actions.length);
        return actions[roll];
    }

    doTurn() {
        let nextAction = this.chooseAnAction(Dog.actions);
        let target = this.id;
        if (nextAction === slash) {
            target = this.chooseAnEnemy(currentCombat!.leftSide);
        }
        useAction(nextAction, this.id, target);
    }
}
