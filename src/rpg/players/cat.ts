import portrait_url from "@assets/cat.png";
import { Action } from "@rpg/actions";
import { Chilled } from "@rpg/effects";
import { Player } from "@rpg/player";

const iceKnife: Action = {
    id: "iceKnife",
    name: "Ice Knife",
    range: "ranged",
    damage: 4,
    waitTime: 3,
    effects: [Chilled],
    targeting: {
        type: "single",
        filter: "enemy",
    },
};

export class CatPlayer extends Player {
    public id: string = "cat";
    public portraitUrl = portrait_url;
    public actions = [iceKnife];
    public health = 30;
    public precision = 5;
}
