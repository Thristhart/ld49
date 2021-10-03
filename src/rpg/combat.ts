import { renderUI } from "@ui/ui";
import { Action } from "./actions";
import { Effect } from "./effects";
import { Beholder } from "./enemies/beholder";
import { EntityMap } from "./entities";
import { Entity } from "./entity";
import { CatPlayer } from "./players/cat";
import { CrowPlayer } from "./players/crow";

interface CombatDescription {
    readonly leftSide: typeof Entity[];
    readonly rightSide: typeof Entity[];
}
interface Combat {
    readonly leftSide: string[];
    readonly rightSide: string[];
}

const makeCombat = (c: CombatDescription) => c;

export const combats = {
    none: undefined,
    tutorial: makeCombat({
        leftSide: [CatPlayer],
        rightSide: [Beholder, Beholder, CrowPlayer, Beholder, Beholder],
    }),
} as const;

export let currentCombat: Combat | undefined;

function makeEntity<T extends typeof Entity>(EntityClass: T) {
    const ent = new (EntityClass as unknown as new (...args: any) => any)();
    EntityMap.set(ent.id, ent);
    return ent.id;
}

export function startCombat(combatDescription: CombatDescription) {
    currentCombat = {
        leftSide: combatDescription.leftSide.map(makeEntity),
        rightSide: combatDescription.rightSide.map(makeEntity),
    };
}

export function endCombat() {
    currentCombat = undefined;
    renderUI();
}

export const getCombatants = () => currentCombat?.leftSide.concat(currentCombat.rightSide);

export function isAlly(a: string, b: string): boolean {
    if (!currentCombat) {
        return false;
    }

    return (
        (currentCombat.leftSide.includes(a) && currentCombat.leftSide.includes(b)) ||
        (currentCombat.rightSide.includes(a) && currentCombat.rightSide.includes(b))
    );
}

export function isEnemy(a: string, b: string): boolean {
    return !isAlly(a, b);
}

export interface CombatLogEntry {
    readonly actorId: string;
    readonly action: Action;
    readonly primaryTargetId: string;
    readonly secondaryTargetIds?: string[];
    readonly damageDealt?: number;
    readonly effectsAdded?: typeof Effect[];
}

export const combatLog: CombatLogEntry[] = [];

export const clearCombatLog = () => {
    combatLog.splice(0);
};
