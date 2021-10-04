import { Action } from "@rpg/actions";
import { EntityMap } from "@rpg/entities";
import { Player } from "@rpg/player";
import { getCurrentTurn } from "@rpg/turns";
import "./Actions.css";
import { getCurrentTargeting, startTargeting } from "./Targeting";
import { ActionTooltip, Tooltip } from "./ToolTips";

interface ActionButtonProps {
    readonly action: Action;
    readonly casterId: string;
}
const ActionButton = ({ action, casterId }: ActionButtonProps) => {
    const caster = EntityMap.get(casterId);
    if (!caster) {
        return null;
    }
    const currentCooldown = caster.actionCooldowns.get(action.id);

    return (
        <li>
            <button
                data-tip
                data-for={`action${action.id}${casterId}`}
                data-place="right"
                className="actionButton"
                disabled={!!getCurrentTargeting() || !!currentCooldown}
                onClick={() => startTargeting(action, casterId)}>
                {action.name}
                {!!currentCooldown && action.cooldown && (
                    <>
                        <div
                            className="cooldownIndicator"
                            style={{
                                "--cooldown-percentage": `${currentCooldown / action.cooldown}turn`,
                            }}
                            data-tip
                            data-for={`action${action.id}${casterId}cooldown`}
                        />
                        <Tooltip id={`action${action.id}${casterId}cooldown`}>
                            On cooldown, available in {currentCooldown} {currentCooldown === 1 ? "turn" : "turns"}
                        </Tooltip>
                    </>
                )}
                <ActionTooltip action={action} casterId={casterId} />
            </button>
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
