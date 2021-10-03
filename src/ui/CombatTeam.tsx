import { useAction } from "@rpg/actions";
import { currentCombat } from "@rpg/combat";
import { EntityMap } from "@rpg/entities";
import { Entity } from "@rpg/entity";
import { CatPlayer } from "@rpg/players/cat";
import { CrowPlayer } from "@rpg/players/crow";
import { getCurrentTurn } from "@rpg/turns";
import cx from "classnames";
import React, { useState } from "react";
import "./CombatTeam.css";
import { getCurrentTargeting, isTargeted, stopTargeting } from "./Targeting";

function getEntityName(entity: Entity): string {
    if (entity instanceof CatPlayer) {
        return "cat";
    }
    if (entity instanceof CrowPlayer) {
        return "crow";
    }

    return entity.constructor.name;
}

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
