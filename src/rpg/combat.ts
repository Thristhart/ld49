import { showDialog } from "@story";
import { renderUI } from "@ui/ui";
import { isTruthy } from "@util/isTruthy";
import { Action, ActionImpact } from "./actions";
import { Beholder } from "./enemies/beholder";
import { Rock } from "./enemies/rock";
import { EntityMap } from "./entities";
import { Entity } from "./entity";
import { getEntityName } from "./entityName";
import { CatPlayer } from "./players/cat";

interface CombatDescription {
    readonly leftSide: typeof Entity[];
    readonly rightSide: typeof Entity[];
    readonly playerLevel: number;
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
        rightSide: [Rock],
        playerLevel: 1,
    }),
    beholderAttack: makeCombat({
        leftSide: [CatPlayer],
        rightSide: [Beholder, Beholder, Beholder],
        playerLevel: 1,
    }),
} as const;

let currentCombatName: keyof typeof combats | undefined;
export let currentCombat: Combat | undefined;

export let instability: number = 0;

export const setInstability = (newInstability: number) => {
    if (newInstability > 102) {
        newInstability = 102;
    } else if (newInstability < 0) {
        newInstability = 0;
    }
    instability = newInstability;
};

function makeEntity<T extends typeof Entity>(EntityClass: T, playerLevel: number) {
    const ent = new (EntityClass as unknown as new (playerLevel: number) => Entity)(playerLevel);
    EntityMap.set(ent.id, ent);
    return ent.id;
}

export let combatState: "won" | "lost" | "active";

export function startCombat(combatName: keyof typeof combats) {
    currentCombatName = combatName;
    const combatDescription = combats[combatName]!;
    currentCombat = {
        leftSide: combatDescription.leftSide.map((ent) => makeEntity(ent, combatDescription.playerLevel)),
        rightSide: combatDescription.rightSide.map(makeEntity),
    };
    combatState = "active";
    instability = 0;
}

export function endCombat() {
    EntityMap.clear();
    currentCombat = undefined;
    currentCombatName = undefined;
    instability = 0;
    clearCombatLog();
    renderUI();
}

export function restartCombat() {
    const name = currentCombatName!;
    endCombat();
    startCombat(name);
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

export function checkForDeath() {
    getCombatants()
        ?.map((id) => EntityMap.get(id))
        .filter(isTruthy)
        .forEach((ent) => {
            if (ent.health <= 0) {
                combatLog.push(`${getEntityName(ent)} was defeated!`);
                const leftIndex = currentCombat?.leftSide.indexOf(ent.id);
                if (leftIndex !== undefined && leftIndex !== -1) {
                    currentCombat?.leftSide.splice(leftIndex, 1);
                }
                const rightIndex = currentCombat?.rightSide.indexOf(ent.id);
                if (rightIndex !== undefined && rightIndex !== -1) {
                    currentCombat?.rightSide.splice(rightIndex, 1);
                }
            }
        });

    if (currentCombat?.leftSide.length === 0) {
        combatState = "lost";
        renderUI();
    } else if (currentCombat?.rightSide.length === 0) {
        combatState = "won";
        renderUI();
    }
}

export interface HistoricalActionImpact extends ActionImpact {
    readonly casterStrengthDamageMod?: number;
    readonly casterPrecisionDamageMod?: number;
    readonly targetStrengthResistanceMod?: number;
    readonly targetSturdinessResistanceMod?: number;
    readonly unmodifiedDamage?: number;
    readonly modifiedByCasterDamage?: number;
    readonly modifiedByDefenseDamage?: number;
}

export interface TargetImpact {
    readonly targetId: string;
    readonly impact: HistoricalActionImpact;
    readonly targetType: "mainTarget" | "secondaryTarget";
}

export interface CombatLogEntry {
    readonly actorId: string;
    readonly action: Action;
    readonly targetImpacts: TargetImpact[];
}

export type CombatLogItem = CombatLogEntry | string;

export const combatLog: CombatLogItem[] = [];

export const clearCombatLog = () => {
    combatLog.splice(0);
};

if (import.meta.env.DEV) {
    //@ts-ignore
    window.DEBUG_SKIP_COMBAT = () => {
        endCombat();
        showDialog();
    };
}
