import { combatLog } from "@rpg/combat";
import { Ignite } from "@rpg/effects/ignite";
import { Oiled } from "@rpg/effects/oiled";
import { Entity } from "@rpg/entity";
import { getEntityName } from "@rpg/entityName";
import { Trigger } from "@rpg/triggers";

export class IgniteTrigger extends Trigger {
    public static cause(target: Entity): boolean {
        return (
            target.effects.find((x) => x instanceof Oiled) !== undefined &&
            target.effects.find((x) => x instanceof Ignite) !== undefined
        );
    }

    public static effect(target: Entity) {
        let oiled = target.effects.find((x) => x instanceof Oiled);
        let ignite = target.effects.find((x) => x instanceof Ignite);
        if (oiled !== undefined && ignite !== undefined) {
            target.hurt(10, "melee");
            target.recover(oiled);
            target.recover(ignite);
            combatLog.push(`${getEntityName(target)} was burned for 10 damage!`);
        }
    }
}
