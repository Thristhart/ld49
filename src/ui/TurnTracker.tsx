import { currentCombat } from "@rpg/combat";
import { EntityMap } from "@rpg/entities";
import { getTurns } from "@rpg/turns";
import cx from "classnames";
import { Tooltip } from "./ToolTips";
import "./TurnTracker.css";

interface InitiativeItemProps {
    readonly entityId: string;
    readonly index: number;
}
const TurnItem = ({ entityId, index }: InitiativeItemProps) => {
    const entity = EntityMap.get(entityId);
    if (!entity) {
        return null;
    }
    return (
        <li
            className="turnItem"
            style={{
                transform: `translateX(${index * 3.5}em)`,
            }}>
            <div
                style={{
                    backgroundImage: `url(${entity.portraitUrl})`,
                }}
                className={cx(
                    "initiativePortrait",
                    index === 0 && "isCurrentTurn",
                    currentCombat?.rightSide.includes(entityId) && "isRight"
                )}
            />
            <span className="waitTime" data-tip data-for="waitTimeExplainer">
                {entity.waitTime}
            </span>
        </li>
    );
};

export const TurnTracker = () => {
    const turns = getTurns()?.map((ent) => ent.id);

    if (!turns) {
        return null;
    }

    const sortedTurns = [...turns].sort();

    return (
        <div id="initiativeContainer">
            <ul className="initiativeTracker">
                {sortedTurns.map((entityId) => (
                    <TurnItem index={turns.indexOf(entityId)} entityId={entityId} key={entityId} />
                ))}
            </ul>
            <Tooltip id="waitTimeExplainer">
                The amount of time until the next turn. The combatant with the lowest current wait time will go first.
            </Tooltip>
        </div>
    );
};
