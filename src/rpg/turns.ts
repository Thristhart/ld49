import { renderUI } from "@ui/ui";
import { getCombatants } from "./combat";
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
        getTurns()?.forEach((ent) => {
            if (ent.waitTime > 0) {
                ent.waitTime--;
            }
        });
        setTimeout(tickWaitTime, 300);
    }
};

export const nextTurn = () => {
    tickWaitTime();

    renderUI();
};
