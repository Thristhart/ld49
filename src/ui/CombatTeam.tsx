import { useAction } from "@rpg/actions";
import { currentCombat } from "@rpg/combat";
import { EntityMap } from "@rpg/entities";
import { getEntityName } from "@rpg/entityName";
import { getCurrentTurn, nextTurn } from "@rpg/turns";
import cx from "classnames";
import { useState } from "preact/hooks";
import "./CombatTeam.css";
import { StatTooltip } from "./StatTooltip";
import { getCurrentTargeting, isTargeted, stopTargeting } from "./Targeting";
import { StatExplanationTooltip } from "./ToolTips";

interface EntityCombatBoxProps {
    readonly id: string;
    readonly hoveringId: string | undefined;
    readonly setHoveringId: React.Dispatch<React.SetStateAction<string | undefined>>;
    readonly side: "left" | "right";
}
const EntityCombatBox = ({ id, hoveringId, setHoveringId, side }: EntityCombatBoxProps) => {
    const entity = EntityMap.get(id);
    if (!entity) {
        return null;
    }
    const currentTurn = getCurrentTurn();
    const currentTargeting = getCurrentTargeting();
    const isTargeting = !!currentTargeting;
    const amITargeted =
        isTargeting &&
        hoveringId !== undefined &&
        isTargeted({
            targeting: currentTargeting.action.targeting,
            casterId: currentTargeting.casterId,
            entId: id,
            mainTargetId: hoveringId,
        });
    const isMainTarget = amITargeted && hoveringId === id;

    return (
        <>
            <li
                className={cx(
                    "combatBox",
                    entity.constructor.name,
                    currentTurn?.id === id && "myTurn",
                    isMainTarget && "mainTarget",
                    amITargeted && !isMainTarget && "secondaryTarget"
                )}
                onMouseEnter={() => setHoveringId(id)}
                onMouseLeave={() => {
                    if (hoveringId === id) {
                        setHoveringId(undefined);
                    }
                }}
                onClick={() => {
                    if (currentTargeting && isMainTarget) {
                        useAction(currentTargeting.action, currentTargeting.casterId, id);
                        stopTargeting();
                        nextTurn();
                    }
                }}
                data-tip
                data-for={`${id}stats`}>
                <span className="combatName">{getEntityName(entity)}</span>
                <span className="hp">{entity.health}</span>
            </li>
            <StatTooltip entId={id} ally={side === "left"} />
            <StatExplanationTooltip stat={"speed"} ally={side === "left"} />
            <StatExplanationTooltip stat={"strength"} ally={side === "left"} />
            <StatExplanationTooltip stat={"precision"} ally={side === "left"} />
            <StatExplanationTooltip stat={"unpredictability"} ally={side === "left"} />
            <StatExplanationTooltip stat={"sturdiness"} ally={side === "left"} />
            <StatExplanationTooltip stat={"untiltability"} ally={side === "left"} />
        </>
    );
};

interface CombatTeamProps {
    readonly side: "left" | "right";
}
export const CombatTeam = ({ side }: CombatTeamProps) => {
    const team = currentCombat![`${side}Side`];
    const [hoveringId, setHoveringId] = useState<string | undefined>(undefined);
    return (
        <ul className={cx("combatTeam", side)}>
            {team.map((id) => (
                <EntityCombatBox id={id} key={id} hoveringId={hoveringId} setHoveringId={setHoveringId} side={side} />
            ))}
        </ul>
    );
};
