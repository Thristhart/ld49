import { Effect } from "@rpg/effects";
import { NumericEntityStat } from "@rpg/entity";

export class Fatigued extends Effect {
    public baseMagnitude: number = -3;
    public relevantStats: NumericEntityStat[] = ["speed", "strength", "sturdiness"];
}
