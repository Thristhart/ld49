import { combatLog, instability } from "./combat";
import { Entity } from "./entity";
import { getEntityName } from "./entityName";
import { Player } from "./player";

export class InstabilityEffect {
    public static minValue: number = 0;
    public static maxValue: number = 0;
    public baseAmount: number = 0;

    constructor(public triggerer: Entity) {}

    do() {}

    amountAfterInstability(): number {
        let amount = this.baseAmount;
        if (this.triggerer instanceof Player) {
            amount = Math.round(amount * ((10 + this.triggerer.getModifiedStat("untiltability")) / 10));
        }
        return amount;
    }
}

function getInstabilityPhrase() {
    if (instability >= 100) {
        return "The edge between truth and fiction is blurred";
    }
    if (instability > 90) {
        return "The fabric of reality strains at its breaking point";
    }
    if (instability > 80) {
        return "The air thrums with the pulse of magic";
    }
    if (instability > 65) {
        return "Arcane energies swirl";
    }
    return "The world begins to distort from an overuse of magic";
}

function logInstability(description: string) {
    combatLog.push(`${getInstabilityPhrase()}... ${description}`);
}

export class Hurt extends InstabilityEffect {
    public baseAmount: number = 5;

    do() {
        let damageAmount = this.amountAfterInstability();
        let realDamageAmount = this.triggerer.hurt(Math.round(damageAmount), "melee");
        logInstability(`${getEntityName(this.triggerer)} took ${realDamageAmount} damage!`);
    }
}

const instabilityTable = {
    0: Hurt,
    1: Hurt,
    2: Hurt,
    3: Hurt,
    4: Hurt,
    5: Hurt,
    6: Hurt,
    7: Hurt,
    8: Hurt,
    9: Hurt,
    10: Hurt,
    11: Hurt,
    12: Hurt,
    13: Hurt,
    14: Hurt,
    15: Hurt,
    16: Hurt,
    17: Hurt,
    18: Hurt,
    19: Hurt,
    20: Hurt,
    21: Hurt,
    22: Hurt,
    23: Hurt,
    24: Hurt,
    25: Hurt,
    26: Hurt,
    27: Hurt,
    28: Hurt,
    29: Hurt,
    30: Hurt,
};

function isInTable(effectNumber: number): effectNumber is keyof typeof instabilityTable {
    return effectNumber > 0 && effectNumber < 30;
}

export abstract class Instability {
    public static effects: typeof InstabilityEffect[] = [Hurt];

    static doEffect(effectNumber: number, triggerer: Entity) {
        if (!isInTable(effectNumber)) {
            console.error("Stability number OOB.");
            return;
        }
        let effect = instabilityTable[effectNumber];
        if (effect !== undefined) {
            new effect(triggerer).do();
        }
    }
}
