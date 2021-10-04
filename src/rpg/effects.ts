import { Entity, NumericEntityStat } from "./entity";
import { Trigger } from "./triggers";
import { FreezeTrigger } from "./triggers/FreezeTrigger";

export class Effect extends Object {
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

    calculateActualMagnitude(target: Entity, sourcePrecision: number): number {
        let sturdinessEffect = (30 - target.getModifiedStat("sturdiness")) / 30;
        let precisionEffect = (15 + sourcePrecision) / 15;
        let actualMagitude = Math.floor(this.baseMagnitude * sturdinessEffect * precisionEffect);
        this.magnitude = actualMagitude;
        return actualMagitude;
    }
}

export class Chilled extends Effect {
    public duration: number = 3;
    public baseMagnitude: number = -2;
    public relevantStats: NumericEntityStat[] = ["speed"];
    public static triggers: Trigger[] = [new FreezeTrigger()];
}

export class Wild extends Effect {
    public duration: number = 4;
    public baseMagnitude: number = 3;
    public relevantStats: NumericEntityStat[] = ["unpredictability"];
}

export class Haste extends Effect {
    public duration: number = 2;
    public baseMagnitude: number = 2;
    public relevantStats: NumericEntityStat[] = ["speed"];
}

export class Exposed extends Effect {
    public duration: number = 2;
    public baseMagnitude: number = -3;
    public relevantStats: NumericEntityStat[] = ["sturdiness"];
}

export class Drowsy extends Effect {
    public duration: number = 4;
    public baseMagnitude: number = -15;
    public relevantStats: NumericEntityStat[] = ["strength", "precision"];
}

export class Freeze extends Effect {
    public duration: number = 3;
}

export class Fatigued extends Effect {
    public baseMagnitude: number = -1;
    public relevantStats: NumericEntityStat[] = ["speed", "strength", "sturdiness"];
}

if (import.meta.hot) {
    import.meta.hot.accept();
}
