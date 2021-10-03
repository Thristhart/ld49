import { useAction } from "@rpg/actions";
import { currentCombat } from "@rpg/combat";
import { EntityMap } from "@rpg/entities";
import { getEntityName } from "@rpg/entityName";
import { getCurrentTurn } from "@rpg/turns";
import cx from "classnames";
import React, { useState } from "react";
import "./CombatTeam.css";
import { getCurrentTargeting, isTargeted, stopTargeting } from "./Targeting";

interface EntityCombatBoxProps {
    readonly id: string;
    readonly hoveringId: string | undefined;
    readonly setHoveringId: React.Dispatch<React.SetStateAction<string | undefined>>;
}
const EntityCombatBox = ({ id, hoveringId, setHoveringId }: EntityCombatBoxProps) => {
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
        <div
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
                if (currentTargeting) {
                    useAction(currentTargeting.action, currentTargeting.casterId, id);
                    stopTargeting();
                }
            }}>
            <span className="combatName">{getEntityName(entity)}</span>
            <span className="hp">{entity.health}</span>
        </div>
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
                <EntityCombatBox id={id} key={id} hoveringId={hoveringId} setHoveringId={setHoveringId} />
            ))}
        </ul>
    );
};
