import { renderUI } from "@ui/ui";
import { combatLog, combatState, currentCombat, getCombatants, instability, setInstability } from "./combat";
import { Freeze } from "./effects/freeze";
import { EntityMap } from "./entities";
import { getEntityName } from "./entityName";

export const getTurns = () =>
    getCombatants()
        ?.map((id) => EntityMap.get(id)!)
        .sort((a, b) => {
            if (b.waitTime < a.waitTime) {
                return 1;
            }
            if (b.waitTime > a.waitTime) {
                return -1;
            }
            // tied on waittime, use speed as tiebreaker
            return b.speed - a.speed;
        });

export const getCurrentTurn = () => {
    const earliest = getTurns()?.[0];
    if (earliest?.waitTime === 0) {
        return earliest;
    }
    return undefined;
};

export const isPlayerTurn = () => true;

const tickWaitTime = () => {
    const turns = getTurns();
    if (turns?.[0].waitTime !== 0) {
        decayInstability();
        getTurns()?.forEach((ent) => {
            if (ent.waitTime > 0) {
                ent.waitTime--;
            }
        });
        setTimeout(nextTurn, 300);
    } else {
        const nextTurnEntity = turns?.[0];
        nextTurnEntity.actionCooldowns.forEach((cooldown, actionId) => {
            const tickedCooldown = cooldown--;
            if (tickedCooldown <= 0) {
                nextTurnEntity.actionCooldowns.delete(actionId);
            } else {
                nextTurnEntity.actionCooldowns.set(actionId, cooldown);
            }
        });
        nextTurnEntity.effects.forEach((effect) => {
            const tickedDuration = effect.duration--;
            if (tickedDuration <= 0) {
                let effectIndex = nextTurnEntity.effects.indexOf(effect);
                nextTurnEntity.effects.splice(effectIndex);
            }
        });
        let isFrozen: boolean = !!nextTurnEntity.effects.find((x) => x instanceof Freeze);
        if (!isFrozen) {
            if (currentCombat?.rightSide.includes(nextTurnEntity.id)) {
                setTimeout(() => {
                    nextTurnEntity.doTurn();
                    renderUI();
                    setTimeout(nextTurn, 700);
                }, 300 + Math.random() * 500);
            }
        } else {
            combatLog.push(`${getEntityName(nextTurnEntity)} is frozen. It thaws slightly.`);
        }
    }
};

const decayInstability = () => {
    setInstability(instability - 2);
};

export const nextTurn = () => {
    if (combatState !== "active") {
        return;
    }

    tickWaitTime();

    renderUI();
};
