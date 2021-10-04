import { combatLog } from "@rpg/combat";
import { Chilled } from "@rpg/effects/chilled";
import { Freeze } from "@rpg/effects/freeze";
import { Entity } from "@rpg/entity";
import { getEntityName } from "@rpg/entityName";
import { Trigger } from "@rpg/triggers";

export class FreezeTrigger extends Trigger {
    public static cause(target: Entity): boolean {
        return target.effects.find((x) => x instanceof Chilled && x.count >= 3) !== undefined;
    }

    public static effect(target: Entity) {
        let chilled = target.effects.find((x) => x instanceof Chilled);
        if (chilled !== undefined) {
            const effect = new Freeze();
            effect.calculateActualMagnitude(target, 0);
            target.afflict(effect);
            target.recover(chilled);
            combatLog.push(`${getEntityName(target)} became frozen!`);
        }
    }
}
