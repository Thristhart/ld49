import { Effect } from "@rpg/effects";
import { NumericEntityStat } from "@rpg/entity";

export class Wild extends Effect {
    public static realName = "Wild";
    public duration: number = 4;
    public baseMagnitude: number = 3;
    public relevantStats: NumericEntityStat[] = ["unpredictability"];
}
