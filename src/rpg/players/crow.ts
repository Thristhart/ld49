import portrait_url from "@assets/crow.png";
import { Player } from "@rpg/player";

export class CrowPlayer extends Player {
    public id: string = "crow";
    public portraitUrl = portrait_url;
    public health = 25;
}
