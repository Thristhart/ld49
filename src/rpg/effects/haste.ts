import { Effect } from "@rpg/effects";
import { NumericEntityStat } from "@rpg/entity";

export class Haste extends Effect {
    public static realName = "Haste";
    public duration: number = 2;
    public baseMagnitude: number = 2;
    public relevantStats: NumericEntityStat[] = ["speed"];
}
