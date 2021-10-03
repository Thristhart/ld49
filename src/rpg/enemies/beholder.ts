import portait_url from "@assets/beholder.png";
import { Action } from "@rpg/actions";
import { Entity } from "../entity";

const blink: Action = {
    id: "blink",
    name: "Blink",
    waitTime: 5,
    range: "ranged",
    targeting: { type: "all", filter: "enemy" },
};

export class Beholder extends Entity {
    portraitUrl = portait_url;
    health = 10;
    actions = [blink];
}
