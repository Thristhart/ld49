import { Action } from "@rpg/actions";
import { Player } from "@rpg/player";
import { getCurrentTurn } from "@rpg/turns";
import React from "react";
import "./Actions.css";
import { getCurrentTargeting, startTargeting } from "./Targeting";
import { ActionTooltip } from "./ToolTips";

interface ActionButtonProps {
    readonly action: Action;
    readonly casterId: string;
}
const ActionButton = ({ action, casterId }: ActionButtonProps) => {
    return (
        <li>
            <button
                className="actionButton"
                data-tip
                data-for={`action${action.id}`}
                data-place="right"
                disabled={!!getCurrentTargeting()}
                onClick={() => startTargeting(action, casterId)}>
                {action.name}
            </button>
            <ActionTooltip action={action} casterId={casterId} />
        </li>
    );
};

export const Actions = () => {
    const currentTurnEntity = getCurrentTurn();
    if (!currentTurnEntity) {
        return null;
    }

    const isPlayer = currentTurnEntity instanceof Player;
    if (!isPlayer) {
        return null;
    }

    const currentTargeting = getCurrentTargeting();
    if (currentTargeting) {
        return (
            <span className="targetingMessage">
                Choose a target for {currentTargeting.action.name}. Press ESC to cancel.
            </span>
        );
    }

    return (
        <>
            <ul className="actions">
                {currentTurnEntity.actions.map((action) => (
                    <ActionButton key={action.name} action={action} casterId={currentTurnEntity.id} />
                ))}
            </ul>
        </>
    );
};
