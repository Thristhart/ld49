import { combatState, currentCombat, endCombat, restartCombat } from "@rpg/combat";
import { getStoryDecoratorsClassName, showDialog } from "@story";
import { Actions } from "./Actions";
import { CombatLog } from "./CombatLog";
import { CombatTeam } from "./CombatTeam";
import { InstabilityMeter } from "./InstabilityMeter";
import "./RPG.css";
import { TurnTracker } from "./TurnTracker";

const VictoryOverlay = () => {
    return (
        <div
            className="victoryOverlay"
            onClick={() => {
                endCombat();
                showDialog();
            }}>
            VICTORY
        </div>
    );
};

const DefeatOverlay = () => {
    return (
        <div
            className="defeatOverlay"
            onClick={() => {
                restartCombat();
            }}>
            DEFEAT
            <span className="retry">RETRY?</span>
        </div>
    );
};

export const RPG = () => {
    if (!currentCombat) {
        return null;
    }

    return (
        <div id="rpg" className={getStoryDecoratorsClassName()}>
            {combatState === "won" && <VictoryOverlay />}
            {combatState === "lost" && <DefeatOverlay />}
            <TurnTracker />
            <CombatTeam side="left" />
            <Actions />
            <CombatTeam side="right" />
            <InstabilityMeter />
            <CombatLog />
        </div>
    );
};
