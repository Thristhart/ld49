import { Entity } from "./entity";

export abstract class Trigger {
    public abstract cause(target: Entity): boolean;
    public abstract effect(target: Entity): void;
}

if (import.meta.hot) {
    import.meta.hot.accept();
}
