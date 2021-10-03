import { Chilled, Freeze } from "./effects";
import { Entity } from "./entity";

export abstract class Trigger {
    public abstract cause(target: Entity): boolean;
    public abstract effect(target: Entity): void;
}

export class FreezeTrigger extends Trigger {
    public cause(target: Entity): boolean {
        return target.effects.find((x) => x instanceof Chilled && x.count >= 3) !== undefined;
    }

    public effect(target: Entity) {
        let chilled = target.effects.find((x) => x instanceof Chilled);
        if (chilled !== undefined) {
            let duration = chilled.count;
            target.afflict(new Freeze(duration, target, 0));
            target.recover(chilled);
        }
    }
}

if (import.meta.hot) {
    import.meta.hot.accept();
}
