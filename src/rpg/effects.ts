import { Entity, NumericEntityStat } from "./entity";
import { FreezeTrigger, Trigger } from "./triggers";

export class Effect {
    public duration: number = 0;
    public count: number = 1;
    public baseMagnitude: number = 0;
    public magnitude: number = 0;
    public static triggers: Trigger[] = [];
    public relevantStats: NumericEntityStat[] = [];

    addCount(amount: number = 1) {
        this.count += amount;
    }

    effectsStat(stat: NumericEntityStat): boolean {
        return this.relevantStats.includes(stat);
    }

    constructor(duration: number = 1, target: Entity, sourcePrecision: number) {
        this.magnitude = this.calculateActualMagnitude(target, sourcePrecision);
        this.duration = duration;
    }

    calculateActualMagnitude(target: Entity, sourcePrecision: number): number {
        let sturdinessEffect = (30 - target.getModifiedStat("sturdiness")) / 30;
        let precisionEffect = (15 + sourcePrecision) / 15;
        let actualMagitude = Math.floor(this.baseMagnitude * sturdinessEffect * precisionEffect);
        if (actualMagitude > 1) {
            actualMagitude = 1;
        }
        return actualMagitude;
    }
}

export class Chilled extends Effect {
    public baseMagnitude: number = -2;
    public relevantStats: NumericEntityStat[] = ["speed"];
    public static triggers: Trigger[] = [new FreezeTrigger()];
}

export class Wild extends Effect {
    public baseMagnitude: number = 3;
    public relevantStats: NumericEntityStat[] = ["unpredictability"];
}

export class Freeze extends Effect {}

if (import.meta.hot) {
    import.meta.hot.accept();
}

export class Fatigued extends Effect {
    public baseMagnitude: number = -1;
    public relevantStats: NumericEntityStat[] = ["speed", "strength", "sturdiness"];
    public static triggers: Trigger[] = [new FreezeTrigger()];
}
