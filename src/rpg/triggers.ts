import { Effect } from "./effects";
import { Entity } from "./entity";

export class Trigger {
    public static cause(_target: Entity): boolean {
        return false;
    }
    public static effect(_target: Entity): void {}
    public static addsEffects: typeof Effect[] = [];
}

if (import.meta.hot) {
    import.meta.hot.accept();
}
