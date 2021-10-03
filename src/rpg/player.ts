import { Entity } from "./entity";

export abstract class Player extends Entity {}

if (import.meta.hot) {
    import.meta.hot.accept();
    //TODO: Fancy things.
}
