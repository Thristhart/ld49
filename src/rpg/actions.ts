import { getHasCastSpell, setHasCastSpell, showDialog } from "@story";
import { isTargeted, Targeting } from "@ui/Targeting";
import { isTruthy } from "@util/isTruthy";
import { checkForDeath, combatLog, currentCombat, instability, setInstability, TargetImpact } from "./combat";
import { Effect } from "./effects";
import { EntityMap } from "./entities";
import { Entity } from "./entity";
import { Instability } from "./instability";

export interface ActionImpact {
    readonly damage?: number;
    readonly healing?: number;
    readonly effects?: typeof Effect[];
    readonly logTemplate?: string;
}

export interface Action {
    readonly id: string;
    readonly name: string;
    readonly targeting: Targeting;
    readonly waitTime: number;
    readonly range: "melee" | "ranged";
    readonly logTemplate: string;
    readonly mainTargetImpact: ActionImpact;
    readonly secondaryTargetImpact?: ActionImpact;
    readonly cooldown?: number;
    readonly instabilityMod?: number;

    readonly overrideUse?: (action: Action, casterId: string, targetId: string) => void;
}

const applyImpact = (action: Action, targetType: "mainTarget" | "secondaryTarget", caster: Entity, target: Entity) => {
    let impactOnTarget: TargetImpact = { targetId: target.id, impact: {}, targetType };
    const actionImpact = action[`${targetType}Impact`];

    if (actionImpact?.damage) {
        const damage = caster.calculateDamageThisDeals(actionImpact.damage, action.range);
        const amountHurt = target.hurt(damage, action.range);
        impactOnTarget = {
            ...impactOnTarget,
            impact: {
                ...impactOnTarget.impact,
                damage: amountHurt,
                casterPrecisionDamageMod: caster.getPrecisionDamagePercentage(),
                casterStrengthDamageMod: caster.getStrengthDamagePercentage(),
                targetStrengthResistanceMod: target.getStrengthDamageReductionPercentage(),
                targetSturdinessResistanceMod: target.getSturdinessDamageReductionPercentage(),
            },
        };
    }
    if (actionImpact?.healing) {
        target.heal(actionImpact.healing);
        impactOnTarget = {
            ...impactOnTarget,
            impact: {
                ...impactOnTarget.impact,
                healing: actionImpact.healing,
            },
        };
    }

    if (actionImpact?.effects && actionImpact.effects.length > 0) {
        actionImpact.effects.forEach((EffectClass) => {
            const effect = new EffectClass();
            effect.calculateActualMagnitude(target, caster.getModifiedStat("precision"));
            target.afflict(effect);
        });
        impactOnTarget = {
            ...impactOnTarget,
            impact: { ...impactOnTarget.impact, effects: [...actionImpact.effects] },
        };
    }

    return impactOnTarget;
};

export const useAction = (action: Action, casterId: string, targetId: string) => {
    const caster = EntityMap.get(casterId)!;

    if (currentCombat?.leftSide.includes(casterId)) {
        if (!getHasCastSpell()) {
            setHasCastSpell();
            showDialog();
        }
    }

    if (action.waitTime) {
        caster.waitTime += action.waitTime;
    }
    if (action.cooldown) {
        caster.actionCooldowns.set(action.id, action.cooldown);
    }

    if (action.overrideUse) {
        return action.overrideUse(action, casterId, targetId);
    }

    const secondaryTargetIds: string[] = [];
    const combatantIds = currentCombat?.leftSide.concat(currentCombat.rightSide);
    combatantIds?.forEach((entId) => {
        if (entId === targetId) {
            return;
        }
        if (isTargeted({ casterId, entId, mainTargetId: targetId, targeting: action.targeting })) {
            secondaryTargetIds.push(entId);
        }
    });
    const target = EntityMap.get(targetId)!;
    const secondaryTargets = secondaryTargetIds.map((id) => EntityMap.get(id)).filter(isTruthy);

    const mainTargetImpact = applyImpact(action, "mainTarget", caster, target);

    const targetImpacts = [mainTargetImpact];

    secondaryTargets.forEach((secondaryTarget) => {
        targetImpacts.push(applyImpact(action, "secondaryTarget", caster, secondaryTarget));
    });

    combatLog.push({ actorId: casterId, action, targetImpacts });

    if (action.instabilityMod) {
        setInstability(instability + action.instabilityMod * ((20 + caster.getModifiedStat("unpredictability")) / 20));
        if (action.instabilityMod > 0 && instability > 50) {
            let roll = Math.round(
                Math.random() * 20 + (instability - 50) / 8 + caster.getModifiedStat("unpredictability") / 5
            );
            Instability.doEffect(roll, caster);
        }
    }

    checkForDeath();
};
