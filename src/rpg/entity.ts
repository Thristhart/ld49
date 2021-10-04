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
    public static actions: Action[] = [];
    public actionCooldowns = new Map<string, number>();

    public static realName: string = "";

    constructor(_level: number) {}

    getModifiedStat(stat: NumericEntityStat): number {
        let relevantEffects = this.effects.filter((x) => x.effectsStat(stat));
        let statValue = this[stat];
        relevantEffects.forEach((x) => (statValue += x.magnitude * x.count));
        return statValue;
    }

    afflict(effect: Effect) {
        let existing = this.effects.find((x) => typeof x === typeof effect);
        if (existing !== undefined) {
            existing.addCount(effect.count);
            existing.duration = effect.duration;
        } else {
            this.effects.push(effect);
        }
        (effect.constructor as typeof Effect).triggers.forEach((trigger) => {
            if (trigger.cause(this)) {
                trigger.effect(this);
            }
        });
    }

    recover(effect: Effect) {
        this.effects.splice(this.effects.indexOf(effect), 1);
    }

    getPrecisionDamagePercentage() {
        return (15 + this.getModifiedStat("precision")) / 15;
    }

    getStrengthDamagePercentage() {
        return (10 + this.getModifiedStat("strength")) / 10;
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

    getSturdinessDamageReductionPercentage() {
        return (20 - this.getModifiedStat("sturdiness")) / 20;
    }

    getStrengthDamageReductionPercentage() {
        return (30 - this.getModifiedStat("strength")) / 30;
    }

    calculateDamageToTake(amount: number, range: "melee" | "ranged") {
        amount = amount * this.getSturdinessDamageReductionPercentage();
        if (range === "melee") {
            amount = this.getStrengthDamageReductionPercentage();
        }
        amount = Math.floor(amount);
        return amount;
    }

    hurt(amount: number, range: "melee" | "ranged") {
        amount = this.calculateDamageToTake(amount, range);
        this.changeHealth(-amount);
        return amount;
    }

    heal(amount: number) {
        this.changeHealth(amount);
    }

    abstract doTurn(): void;
}
