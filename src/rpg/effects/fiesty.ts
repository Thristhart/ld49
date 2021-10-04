import { Effect } from "@rpg/effects";
import { NumericEntityStat } from "@rpg/entity";

export class Fiesty extends Effect {
    public duration: number = 4;
    public baseMagnitude: number = 5;
    public relevantStats: NumericEntityStat[] = ["strength", "precision"];
}
