import { Targeting } from "@ui/Targeting";
import { Effect } from "./effects";
import { EntityMap } from "./entities";
import { nextTurn } from "./turns";

export interface Action {
    readonly id: string;
    readonly name: string;
    readonly targeting: Targeting;
    readonly damage?: number;
    readonly healing?: number;
    readonly effects?: typeof Effect[];
    readonly waitTime?: number;
    readonly instabilityMod?: number;
    readonly range: "melee" | "ranged";
    readonly onUse?: (target: string) => void;
}

export const useAction = (action: Action, casterId: string, targetId: string) => {
    const caster = EntityMap.get(casterId)!;
    // TODO: non-single-target
    const target = EntityMap.get(targetId)!;

    if (action.waitTime) {
        caster.waitTime += action.waitTime;
    }

    if (action.damage) {
        const damage = caster.calculateDamageThisDeals(action.damage, action.range);
        target.hurt(damage);
    }

    if (action.effects && action.effects.length > 0) {
        action.effects.forEach(() => {});
    }

    console.log(action, caster);

    nextTurn();
};
