import { Dog } from "./enemies/dog";
import { Entity } from "./entity";
import { CatPlayer } from "./players/cat";
import { CrowPlayer } from "./players/crow";
import { FoxPlayer } from "./players/fox";

export function getEntityName(entity: Entity): string {
    if (entity instanceof CatPlayer) {
        return "Cassie";
    }
    if (entity instanceof CrowPlayer) {
        return "Wilfred";
    }
    if (entity instanceof FoxPlayer) {
        return "Pierre";
    }
    if (entity instanceof Dog) {
        return "Maxine";
    }

    return entity.constructor.name;
}
