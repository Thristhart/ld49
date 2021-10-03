import { Entity } from "./entity";
import { CatPlayer } from "./players/cat";
import { CrowPlayer } from "./players/crow";

export function getEntityName(entity: Entity): string {
    if (entity instanceof CatPlayer) {
        return "Cat";
    }
    if (entity instanceof CrowPlayer) {
        return "Crow";
    }

    return entity.constructor.name;
}
