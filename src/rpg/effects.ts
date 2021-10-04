import { Entity, NumericEntityStat } from "./entity";
import { Trigger } from "./triggers";

export class Effect extends Object {
    public duration: number = 0;
    public count: number = 1;
    public baseMagnitude: number = 0;
    public magnitude: number = 0;
    public static triggers: typeof Trigger[] = [];
    public relevantStats: NumericEntityStat[] = [];
    public static realName: string = "";

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

if (import.meta.hot) {
    import.meta.hot.accept();
}
