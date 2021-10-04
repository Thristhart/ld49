import { Effect } from "@rpg/effects";
import { IgniteTrigger } from "@rpg/triggers/IgniteTrigger";

export class Ignite extends Effect {
    public duration: number = 1;
    public static triggers = [IgniteTrigger];
}
