import { Effect } from "./effects";
import { NumericEntityStat } from "./entity";

export class Encouraged extends Effect {
    public baseMagnitude: number = 7;
    public relevantStats: NumericEntityStat[] = ["speed", "strength", "sturdiness"];
}
