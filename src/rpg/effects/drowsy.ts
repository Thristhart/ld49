import { Effect } from "@rpg/effects";
import { NumericEntityStat } from "@rpg/entity";

export class Drowsy extends Effect {
    public static realName = "Drowsy";
    public duration: number = 4;
    public baseMagnitude: number = -15;
    public relevantStats: NumericEntityStat[] = ["strength", "precision"];
}
