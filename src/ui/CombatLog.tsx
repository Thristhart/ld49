import { combatLog, CombatLogEntry } from "@rpg/combat";
import { EntityMap } from "@rpg/entities";
import { getEntityName } from "@rpg/entityName";
import { isTruthy } from "@util/isTruthy";
import React, { Fragment, useEffect, useRef } from "react";
import "./CombatLog.css";
import { ActionTooltip, DamageExplanationTooltip, EffectTooltip } from "./ToolTips";

interface LogEntryProps {
    readonly combatLogEntry: CombatLogEntry;
    readonly index: number;
}
const LogEntry = ({ combatLogEntry, index }: LogEntryProps) => {
    const actor = EntityMap.get(combatLogEntry.actorId);
    if (!actor) {
        return null;
    }

    const targets = [combatLogEntry.primaryTargetId].concat(...(combatLogEntry.secondaryTargetIds || []));

    return (
        <>
            <li className="logEntry">
                <span className="actor">{getEntityName(actor)}</span>
                {" used "}
                <span
                    className="actionName"
                    data-tip
                    data-for={`action${combatLogEntry.action.id}${combatLogEntry.actorId}`}>
                    {combatLogEntry.action.name}
                </span>
                {" on "}
                <span>
                    {targets
                        .map((targetId) => EntityMap.get(targetId))
                        .filter(isTruthy)
                        .map(getEntityName)
                        .join(", ")}
                </span>
                {combatLogEntry.damageDealt && (
                    <>
                        {" dealing "}
                        <span
                            className="damageAmount"
                            data-tip
                            data-for={`action${combatLogEntry.action.id}${actor.id}damagelog${index}`}>
                            {combatLogEntry.damageDealt}
                        </span>
                        {" damage"}
                        <DamageExplanationTooltip
                            action={combatLogEntry.action}
                            casterEntity={actor}
                            extraId={`log${index}`}
                        />
                    </>
                )}
                {combatLogEntry.effectsAdded && (
                    <>
                        {combatLogEntry.damageDealt && <>{" and"}</>}
                        {" applying "}

                        {combatLogEntry.effectsAdded.map((effect) => (
                            <Fragment key={effect.name}>
                                <span
                                    className={`effectTitle ${effect.name}`}
                                    data-tip
                                    data-for={`${effect.name}Descriptionlog${index}`}>
                                    {effect.name}
                                </span>
                                <EffectTooltip effect={effect} extraId={`log${index}`} />
                            </Fragment>
                        ))}
                    </>
                )}
            </li>
            <ActionTooltip action={combatLogEntry.action} casterId={combatLogEntry.actorId} />
        </>
    );
};

export const CombatLog = () => {
    const logRef = useRef<HTMLUListElement>(null);
    useEffect(() => {
        requestAnimationFrame(() => {
            if (logRef.current) {
                logRef.current.scrollTop = logRef.current?.scrollHeight;
            }
        });
    }, [combatLog]);
    return (
        <>
            <ul className="combatLog" ref={logRef}>
                {combatLog.map((log, index) => (
                    <LogEntry key={index} combatLogEntry={log} index={index} />
                ))}
            </ul>
        </>
    );
};
