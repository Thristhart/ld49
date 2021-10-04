import { continueStory } from "@story";
import { setupUI } from "@ui/ui";
import "./style.css";

if (import.meta.hot) {
    import.meta.hot.accept();
}

setupUI();

continueStory();
