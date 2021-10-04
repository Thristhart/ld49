import { Effect } from "./effects";
import { NumericEntityStat } from "./entity";

export class Encouraged extends Effect {
    public static realName = "Encouraged";
    public baseMagnitude: number = 3;
    public relevantStats: NumericEntityStat[] = ["speed", "strength"];
}
