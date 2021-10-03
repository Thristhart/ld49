import { Entity } from "./entity";
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
            amount = Math.round(amount * ((10 + this.triggerer.untiltability) / 10));
        }
        return amount;
    }
}

export class Hurt extends InstabilityEffect {
    public static minValue: number = 9;
    public static maxValue: number = 11;
    public baseAmount: number = 5;

    do() {
        let damageAmount = this.amountAfterInstability();
        this.triggerer.hurt(Math.round(damageAmount), "melee");
    }
}

export abstract class Instability {
    public static effects: typeof InstabilityEffect[] = [Hurt];

    static doEffect(effectNumber: number, triggerer: Entity) {
        let effect = this.effects.find((x) => {
            const effectClass = x.constructor as typeof InstabilityEffect;
            return effectClass.minValue <= effectNumber && effectClass.maxValue >= effectNumber;
        });
        if (effect !== undefined) {
            new effect(triggerer).do();
        }
    }
}
