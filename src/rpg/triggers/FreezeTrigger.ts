import { Chilled, Freeze } from "@rpg/effects";
import { Entity } from "@rpg/entity";
import { Trigger } from "@rpg/triggers";

export class FreezeTrigger extends Trigger {
    public cause(target: Entity): boolean {
        return target.effects.find((x) => x instanceof Chilled && x.count >= 3) !== undefined;
    }

    public effect(target: Entity) {
        let chilled = target.effects.find((x) => x instanceof Chilled);
        if (chilled !== undefined) {
            const effect = new Freeze();
            effect.calculateActualMagnitude(target, 0);
            target.afflict(effect);
            target.recover(chilled);
        }
    }
}
