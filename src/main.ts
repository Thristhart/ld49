import { EntityMap } from "@rpg/entities";
import { CatPlayer } from "@rpg/players/cat";
import { CrowPlayer } from "@rpg/players/crow";
import { continueStory } from "@story";
import { setupUI } from "@ui/ui";
import "./style.css";

if (import.meta.hot) {
    import.meta.hot.accept();
}

function createPlayerEntities() {
    const cat = new CatPlayer();
    EntityMap.set(cat.id, cat);
    const crow = new CrowPlayer();
    EntityMap.set(crow.id, crow);
}

createPlayerEntities();
setupUI();

continueStory();
