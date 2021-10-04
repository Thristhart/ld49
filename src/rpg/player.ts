import { Entity } from "./entity";

export abstract class Player extends Entity {
    constructor(level: number) {
        super(level);
        console.log(this.constructor, (this.constructor as typeof Entity).actions);
        this.actions = (this.constructor as typeof Entity).actions.slice(0, level);
    }
    doTurn() {}
}

if (import.meta.hot) {
    import.meta.hot.accept();
    //TODO: Fancy things.
}
