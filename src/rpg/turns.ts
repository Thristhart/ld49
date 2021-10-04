import { renderUI } from "@ui/ui";
import { combatState, currentCombat, getCombatants, instability, setInstability } from "./combat";
import { EntityMap } from "./entities";

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
        if (currentCombat?.rightSide.includes(nextTurnEntity.id)) {
            setTimeout(() => {
                nextTurnEntity.doTurn();
                renderUI();
                setTimeout(nextTurn, 700);
            }, 300 + Math.random() * 500);
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
