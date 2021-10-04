import { Effect } from "@rpg/effects";
import { NumericEntityStat } from "@rpg/entity";
import { FreezeTrigger } from "@rpg/triggers/FreezeTrigger";

export class Chilled extends Effect {
    public static realName = "Chilled";
    public duration: number = 3;
    public baseMagnitude: number = -2;
    public relevantStats: NumericEntityStat[] = ["speed"];
    public static triggers = [FreezeTrigger];
}
