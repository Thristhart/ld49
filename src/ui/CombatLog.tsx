import { ActionImpact } from "@rpg/actions";
import { combatLog, CombatLogEntry, CombatLogItem, TargetImpact } from "@rpg/combat";
import { EntityMap } from "@rpg/entities";
import { Entity } from "@rpg/entity";
import { getEntityName } from "@rpg/entityName";
import { shallowEqual } from "@util/shallowEqual";
import { useEffect, useRef } from "preact/hooks";
import React from "react";
import "./CombatLog.css";
import { ActionTooltip, DamageExplanationTooltip, EffectTooltip } from "./ToolTips";

const TEMPLATE_PORTION_REGEX = /{.*?}/g;
function parseTemplateString(template: string) {
    const output = [];
    let lastMatchEndIndex = 0;
    for (const match of template.matchAll(TEMPLATE_PORTION_REGEX)) {
        const prev = template.slice(lastMatchEndIndex, match.index);
        if (prev) {
            output.push(prev);
        }
        output.push(match[0]);
        lastMatchEndIndex = match.index! + match[0].length;
    }
    const end = template.slice(lastMatchEndIndex);
    if (end) {
        output.push(end);
    }
    return output;
}

function joinList(list: string[]) {
    if (list.length === 1) {
        return list[0];
    }
    if (list.length === 2) {
        return list.join(" and ");
    }
    return list.slice(0, -1).join(", ") + " and " + list[list.length - 1];
}

function buildTemplateFromImpact(impact: ActionImpact) {
    if (impact.logTemplate) {
        return impact.logTemplate;
    }
    const template: string[] = [];
    if (impact.damage) {
        template.push("dealing {DAMAGE} damage");
    }
    if (impact.healing) {
        template.push("healing for {HEALING}");
    }
    if (impact.effects) {
        template.push("applying {EFFECTS}");
    }
    return joinList(template);
}

const getAppropriateImpactTemplate = (targetImpacts: TargetImpact[]) => {
    let allImpactsSame = true;
    const firstImpact = targetImpacts[0].impact;
    targetImpacts.forEach(({ impact }) => {
        if (
            impact.damage !== firstImpact.damage ||
            impact.healing !== firstImpact.healing ||
            !shallowEqual(impact.effects, firstImpact.effects)
        ) {
            allImpactsSame = false;
        }
    });
    if (allImpactsSame) {
        return buildTemplateFromImpact(firstImpact);
    }
    return joinList(targetImpacts.map(({ impact }) => buildTemplateFromImpact(impact) + " to {TARGET}{ENDIMPACT}"));
};

interface ImpactProps {
    readonly targetImpacts: TargetImpact[];
    readonly templateString: string;
    readonly combatLogEntry: CombatLogEntry;
    readonly actor: Entity;
    readonly logIndex: number;
}
const Impact = ({ targetImpacts, templateString, combatLogEntry, actor, logIndex }: ImpactProps) => {
    const template = parseTemplateString(templateString);
    let impactIndex = 0;
    return (
        <>
            {template.map((templatePart, index) => {
                const { impact, targetId, targetType } = targetImpacts[impactIndex];

                const target = EntityMap.get(targetId);

                if (templatePart === "{DAMAGE}") {
                    return (
                        <React.Fragment key={index}>
                            <span
                                className="damageAmount"
                                data-tip
                                data-for={`action${combatLogEntry.action.id}${actor.id}${targetType}damagelog${logIndex}`}>
                                {impact.damage}
                            </span>
                            <DamageExplanationTooltip
                                action={combatLogEntry.action}
                                casterEntity={actor}
                                extraId={`log${logIndex}`}
                                targetType={targetType}
                                targetEntity={target}
                                historicalImpact={impact}
                            />
                        </React.Fragment>
                    );
                }
                if (templatePart === "{EFFECTS}") {
                    if (!impact.effects || impact.effects.length === 0) {
                        return null;
                    }
                    const effectTemplate = parseTemplateString(
                        joinList(impact.effects.map((effect) => `{${effect.name}}`))
                    );
                    return (
                        <React.Fragment key={index}>
                            {effectTemplate.map((effectTemplatePart, index) => {
                                const match = /{(.*?)}/g.exec(effectTemplatePart);
                                if (!match) {
                                    return <React.Fragment key={index}>{effectTemplatePart}</React.Fragment>;
                                }
                                const effectName = match[1];
                                const effect = impact.effects?.find((eff) => eff.name === effectName);
                                if (!effect) {
                                    return null;
                                }
                                return (
                                    <React.Fragment key={effectName}>
                                        <span
                                            className={`effectTitle ${effectName}`}
                                            data-tip
                                            data-for={`${effectName}Descriptionlog${logIndex}`}>
                                            {effectName}
                                        </span>
                                        <EffectTooltip effect={effect} extraId={`log${logIndex}`} />
                                    </React.Fragment>
                                );
                            })}
                        </React.Fragment>
                    );
                }
                if (templatePart === "{TARGET}") {
                    if (!target) {
                        return null;
                    }
                    return (
                        <span key={index} className="entityName">
                            {getEntityName(target)}
                        </span>
                    );
                }
                if (templatePart === "{ENDIMPACT}") {
                    impactIndex++;
                    return null;
                }
                return <React.Fragment key={index}>{templatePart}</React.Fragment>;
            })}
        </>
    );
};

interface LogEntryProps {
    readonly combatLogEntry: CombatLogItem;
    readonly logIndex: number;
}
const LogEntry = ({ combatLogEntry, logIndex }: LogEntryProps) => {
    if (typeof combatLogEntry === "string") {
        return <li className="logEntry">{combatLogEntry}</li>;
    }

    const actor = EntityMap.get(combatLogEntry.actorId);
    if (!actor) {
        return null;
    }

    const { targetImpacts } = combatLogEntry;
    const template = parseTemplateString(combatLogEntry.action.logTemplate);
    const mainTarget = EntityMap.get(combatLogEntry.targetImpacts[0].targetId);

    return (
        <>
            <li className="logEntry">
                {template.map((templateString, index) => {
                    if (templateString === "{CASTER}") {
                        return (
                            <span className="actor" key={index}>
                                {getEntityName(actor)}
                            </span>
                        );
                    }
                    if (templateString === "{NAME}") {
                        return (
                            <span
                                key={index}
                                className="actionName"
                                data-tip
                                data-for={`action${combatLogEntry.action.id}${combatLogEntry.actorId}`}>
                                {combatLogEntry.action.name}
                            </span>
                        );
                    }
                    if (templateString === "{MAINTARGET}") {
                        if (!mainTarget) {
                            return null;
                        }
                        return (
                            <span key={index} className="entityName">
                                {getEntityName(mainTarget)}
                            </span>
                        );
                    }
                    if (templateString === "{IMPACT}") {
                        const impactTemplate = getAppropriateImpactTemplate(targetImpacts);
                        return (
                            <Impact
                                templateString={impactTemplate}
                                targetImpacts={targetImpacts}
                                combatLogEntry={combatLogEntry}
                                actor={actor}
                                logIndex={logIndex}
                            />
                        );
                    }
                    return <React.Fragment key={index}>{templateString}</React.Fragment>;
                })}
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
    }, [combatLog.length]);
    return (
        <>
            <ul className="combatLog" ref={logRef}>
                {combatLog.map((log, index) => (
                    <LogEntry key={index} combatLogEntry={log} logIndex={index} />
                ))}
            </ul>
        </>
    );
};
