import { combatLog, instability } from "./combat";
import { Chilled } from "./effects/chilled";
import { Fiesty } from "./effects/fiesty";
import { Haste } from "./effects/haste";
import { Wild } from "./effects/wild";
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

export class FreeTurn extends InstabilityEffect {
    public baseAmount: number = 2;

    do() {
        this.triggerer.waitTime = 0;
        logInstability(`${getEntityName(this.triggerer)} gets to immediately go again!`);
    }
}

export class SpurMagic extends InstabilityEffect {
    public baseAmount: number = 2;

    do() {
        const effect = new Wild();
        effect.calculateActualMagnitude(this.triggerer, 0);
        this.triggerer.afflict(effect);
        logInstability(`${getEntityName(this.triggerer)} has gained the effect Wild!`);
    }
}

export class AfflictHaste extends InstabilityEffect {
    public baseAmount: number = 2;

    do() {
        const effect = new Haste();
        effect.calculateActualMagnitude(this.triggerer, 0);
        this.triggerer.afflict(effect);
        logInstability(`${getEntityName(this.triggerer)} has gained the effect Haste!`);
    }
}

export class AfflictFiesty extends InstabilityEffect {
    public baseAmount: number = 2;

    do() {
        const effect = new Fiesty();
        effect.calculateActualMagnitude(this.triggerer, 0);
        this.triggerer.afflict(effect);
        logInstability(`${getEntityName(this.triggerer)} has gained the effect Fiesty!`);
    }
}

export class AfflictChilled extends InstabilityEffect {
    public baseAmount: number = 2;

    do() {
        const effect = new Chilled();
        effect.calculateActualMagnitude(this.triggerer, 0);
        this.triggerer.afflict(effect);
        logInstability(`${getEntityName(this.triggerer)} has gained the effect Chilled!`);
    }
}

const instabilityTable = {
    0: SpurMagic,
    1: SpurMagic,
    2: SpurMagic,
    3: SpurMagic,
    4: SpurMagic,
    5: SpurMagic,
    6: SpurMagic,
    7: SpurMagic,
    8: SpurMagic,
    9: Hurt,
    10: Hurt,
    11: Hurt,
    12: Hurt,
    13: Hurt,
    14: Hurt,
    15: AfflictChilled,
    16: AfflictChilled,
    17: AfflictChilled,
    18: AfflictFiesty,
    19: AfflictFiesty,
    20: AfflictFiesty,
    21: AfflictFiesty,
    22: AfflictHaste,
    23: AfflictHaste,
    24: AfflictHaste,
    25: AfflictHaste,
    26: FreeTurn,
    27: FreeTurn,
    28: FreeTurn,
    29: FreeTurn,
    30: FreeTurn,
    31: FreeTurn,
    32: FreeTurn,
    33: FreeTurn,
    34: FreeTurn,
    35: FreeTurn,
    36: FreeTurn,
    37: FreeTurn,
    38: FreeTurn,
    39: FreeTurn,
    40: FreeTurn,
    41: FreeTurn,
    42: FreeTurn,
    43: FreeTurn,
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
