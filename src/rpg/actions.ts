import { Targeting } from "@ui/Targeting";
import { combatLog } from "./combat";
import { Effect } from "./effects";
import { EntityMap } from "./entities";
import { nextTurn } from "./turns";

export interface Action {
    readonly id: string;
    readonly name: string;
    readonly targeting: Targeting;
    readonly waitTime: number;
    readonly range: "melee" | "ranged";

    readonly damage?: number;
    readonly healing?: number;
    readonly effects?: typeof Effect[];
    readonly instabilityMod?: number;
    readonly onUse?: (target: string) => void;
}

export const useAction = (action: Action, casterId: string, targetId: string) => {
    const caster = EntityMap.get(casterId)!;
    // TODO: non-single-target
    const target = EntityMap.get(targetId)!;

    if (action.waitTime) {
        caster.waitTime += action.waitTime;
    }

    let amountHurt: number | undefined;
    let effectsAdded: typeof Effect[] = [];

    if (action.damage) {
        const damage = caster.calculateDamageThisDeals(action.damage, action.range);
        amountHurt = target.hurt(damage, action.range);
    }

    if (action.effects && action.effects.length > 0) {
        action.effects.forEach(() => {});
        effectsAdded.push(...action.effects);
    }

    combatLog.push({ actorId: casterId, action, primaryTargetId: targetId, damageDealt: amountHurt, effectsAdded });

    nextTurn();
};
