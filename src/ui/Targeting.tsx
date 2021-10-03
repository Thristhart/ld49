import { Action } from "@rpg/actions";
import { isAlly, isEnemy } from "@rpg/combat";
import { renderUI } from "./ui";

export type TargetingType = "single" | "all";

export type TargetingFilter = "enemy" | "ally";

export interface Targeting {
    readonly type: TargetingType;
    readonly filter?: TargetingFilter;
}

interface IsTargetedInfo {
    readonly casterId: string;
    readonly entId: string;
    readonly mainTargetId: string;
    readonly targeting: Targeting;
}

export function isTargeted(targetInfo: IsTargetedInfo): boolean {
    switch (targetInfo.targeting.type) {
        case "single": {
            return isSingleTarget(targetInfo);
        }
        case "all":
            return isAllTarget(targetInfo);
    }
}

function matchesFilter({ casterId, entId, targeting }: IsTargetedInfo): boolean {
    if (targeting.filter) {
        if (targeting.filter === "ally") {
            if (isEnemy(casterId, entId)) {
                return false;
            }
        }
        if (targeting.filter === "enemy") {
            if (isAlly(casterId, entId)) {
                return false;
            }
        }
    }
    return true;
}

function isSingleTarget(targetInfo: IsTargetedInfo): boolean {
    const { entId, mainTargetId } = targetInfo;
    // entId is the entity we're considering, and mainTargetId is the entity we're "hovering"
    // so for single target, if there's a mismatch we're not looking at ya
    if (entId !== mainTargetId) {
        return false;
    }
    if (!matchesFilter(targetInfo)) {
        return false;
    }

    return true;
}

function isAllTarget(targetInfo: IsTargetedInfo): boolean {
    if (!matchesFilter(targetInfo)) {
        return false;
    }
    return true;
}

interface CurrentTargeting {
    readonly action: Action;
    readonly casterId: string;
}
let targetingAction: CurrentTargeting | undefined = undefined;
export const getCurrentTargeting = () => targetingAction;
export const startTargeting = (action: Action, casterId: string) => {
    targetingAction = { action, casterId };
    renderUI();
};
export const stopTargeting = () => {
    targetingAction = undefined;
    renderUI();
};
window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        stopTargeting();
    }
});
