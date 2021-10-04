import { Effect } from "../effects";
import { NumericEntityStat } from "../entity";

export class Exposed extends Effect {
    public static realName = "Exposed";
    public duration: number = 2;
    public baseMagnitude: number = -3;
    public relevantStats: NumericEntityStat[] = ["sturdiness"];
}
