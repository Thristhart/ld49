import { currentCombat } from "@rpg/combat";
import React from "react";
import { Actions } from "./Actions";
import { CombatTeam } from "./CombatTeam";
import "./RPG.css";
import { TurnTracker } from "./TurnTracker";

export const RPG = () => {
    if (!currentCombat) {
        return null;
    }

    return (
        <div id="rpg">
            <TurnTracker />
            <CombatTeam side="left" />
            <Actions />
            <CombatTeam side="right" />
        </div>
    );
};
