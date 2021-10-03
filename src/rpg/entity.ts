import { v4 as uuidv4 } from "uuid";
import { Action } from "./actions";
import { Effect } from "./effects";

type FilterNonNumeric<K extends keyof Entity> = Entity[K] extends number ? K : never;
export type NumericEntityStat = keyof { [K in keyof Entity as FilterNonNumeric<K>]: number };

export abstract class Entity {
    public id: string = uuidv4();
    public health: number = 0;
    public waitTime: number = 0;
    public speed: number = 0;
    public strength: number = 0;
    public precision: number = 0;
    public unpredictability: number = 0;
    public sturdiness: number = 0;
    public untiltability: number = 0;

    public effects: Effect[] = [];
    public abstract portraitUrl: string;
    public actions: Action[] = [];

    getModifiedStat(stat: NumericEntityStat): number {
        let relevantEffects = this.effects.filter((x) => x.effectsStat(stat));
        let statValue = this[stat];
        relevantEffects.forEach((x) => (statValue += x.magnitude));
        return statValue;
    }

    afflict(effect: Effect) {
        let existing = this.effects.find((x) => typeof x === typeof effect);
        if (existing !== undefined) {
            existing.addCount(effect.count);
        } else {
            this.effects.push(effect);
        }
    }

    recover(effect: Effect) {
        this.effects.splice(this.effects.indexOf(effect), 1);
    }

    getPrecisionDamagePercentage() {
        return (15 + this.precision) / 15;
    }

    getStrengthDamagePercentage() {
        return (10 + this.strength) / 10;
    }

    calculateDamageThisDeals(amount: number, range: "melee" | "ranged"): number {
        if (range === "melee") {
            amount *= this.getStrengthDamagePercentage();
        } else if (range === "ranged") {
            amount *= this.getPrecisionDamagePercentage();
        }
        return Math.floor(amount);
    }

    changeHealth(amount: number) {
        this.health += amount;
    }

    hurt(amount: number, range: "melee" | "ranged") {
        amount *= Math.floor((20 - this.sturdiness) / 20);
        if (range === "melee") {
            amount *= Math.floor((30 - this.strength) / 30);
        }
        this.changeHealth(-amount);
        return amount;
    }

    heal(amount: number) {
        this.changeHealth(amount);
    }
}
