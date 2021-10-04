import { Action } from "@rpg/actions";
import { HistoricalActionImpact } from "@rpg/combat";
import { Chilled, Effect, Exposed, Freeze } from "@rpg/effects";
import { EntityMap } from "@rpg/entities";
import { Entity } from "@rpg/entity";
import { getEntityName } from "@rpg/entityName";
import cx from "classnames";
import React from "react";
import ReactTooltip, { TooltipProps } from "react-tooltip";
import { Targeting } from "./Targeting";
import "./ToolTips.css";

export const Tooltip = (props: TooltipProps) => {
    return (
        <ReactTooltip
            effect="solid"
            clickable={true}
            delayHide={500}
            delayShow={200}
            border={true}
            {...props}
            className={cx(props.className, "tooltip")}
        />
    );
};

interface DamageBonusProps {
    readonly action: Action;
    readonly casterEntity: Entity;
    readonly targetType: "mainTarget" | "secondaryTarget";
}
const DamageBonus = ({ action, casterEntity, targetType }: DamageBonusProps) => {
    const targetImpact = action[`${targetType}Impact`];
    if (!targetImpact?.damage) {
        return null;
    }
    const modifiedDamage = casterEntity.calculateDamageThisDeals(targetImpact.damage, action.range);
    if (modifiedDamage === targetImpact.damage) {
        return null;
    }
    let bonus;
    let statName;
    if (action.range === "melee") {
        bonus = Math.round(casterEntity.getStrengthDamagePercentage() * 100 - 100);
        statName = "Strength";
    } else {
        bonus = Math.round(casterEntity.getPrecisionDamagePercentage() * 100 - 100);
        statName = "Precision";
    }
    return (
        <>
            {bonus > 0 ? " + " : " - "}
            <span className="bonus">
                {Math.abs(bonus)}% from {getEntityName(casterEntity)} {statName}
            </span>
        </>
    );
};

interface DamageReductionProps {
    readonly action: Action;
    readonly targetEntity: Entity;
    readonly targetType: "mainTarget" | "secondaryTarget";
    readonly historicalImpact: HistoricalActionImpact | undefined;
}
const DamageReduction = ({ action, targetEntity, historicalImpact, targetType }: DamageReductionProps) => {
    const targetImpact = action[`${targetType}Impact`];
    if (!targetImpact?.damage) {
        return null;
    }
    const modifiedDamage = targetEntity.calculateDamageToTake(targetImpact.damage, action.range);
    if (modifiedDamage === targetImpact.damage) {
        return null;
    }

    const sturdyBonus = Math.round(
        (historicalImpact?.targetSturdinessResistanceMod ?? targetEntity.getSturdinessDamageReductionPercentage()) *
            100 -
            100
    );
    let strengthBonus = 0;
    if (action.range === "melee") {
        strengthBonus = Math.round(
            historicalImpact?.targetStrengthResistanceMod ??
                targetEntity.getStrengthDamageReductionPercentage() * 100 - 100
        );
    }
    return (
        <>
            {!!sturdyBonus && (
                <>
                    {sturdyBonus > 0 ? " + " : " - "}
                    <span className="bonus">
                        {Math.abs(sturdyBonus)}% from {getEntityName(targetEntity)} Sturdiness
                    </span>
                </>
            )}
            {!!strengthBonus && (
                <>
                    {strengthBonus > 0 ? " + " : " - "}
                    <span className="bonus">
                        {Math.abs(strengthBonus)}% from {getEntityName(targetEntity)} Strength
                    </span>
                </>
            )}
        </>
    );
};

interface DamageExplanationTooltipProps {
    readonly action: Action;
    readonly casterEntity: Entity;
    readonly targetType: "mainTarget" | "secondaryTarget";
    readonly targetEntity?: Entity;
    readonly historicalImpact?: HistoricalActionImpact;
    readonly extraId?: string;
}
export const DamageExplanationTooltip = ({
    action,
    casterEntity,
    targetType,
    targetEntity,
    historicalImpact,
    extraId = "",
}: DamageExplanationTooltipProps) => {
    const targetImpact = action[`${targetType}Impact`];
    if (!targetImpact) {
        return null;
    }
    return (
        <Tooltip id={`action${action.id}${casterEntity.id}${targetType}damage${extraId}`}>
            {targetImpact.damage}
            {" base damage"}
            <DamageBonus action={action} casterEntity={casterEntity} targetType={targetType} />
            {targetEntity && (
                <DamageReduction
                    action={action}
                    targetEntity={targetEntity}
                    targetType={targetType}
                    historicalImpact={historicalImpact}
                />
            )}
        </Tooltip>
    );
};

interface DamageAmountProps {
    readonly action: Action;
    readonly casterEntity: Entity;
    readonly targetType: "mainTarget" | "secondaryTarget";
    readonly extraId?: string;
}
function DamageAmount({ action, casterEntity, targetType, extraId = "" }: DamageAmountProps) {
    const targetImpact = action[`${targetType}Impact`];
    if (!targetImpact?.damage) {
        return null;
    }
    return (
        <>
            <span className="damageDesc">
                deals{" "}
                <span
                    className="amount"
                    data-tip
                    data-for={`action${action.id}${casterEntity.id}${targetType}damage${extraId}`}>
                    {casterEntity.calculateDamageThisDeals(targetImpact.damage, action.range)}
                </span>{" "}
                damage
            </span>

            <DamageExplanationTooltip action={action} casterEntity={casterEntity} targetType={"mainTarget"} />
        </>
    );
}

function getTargetingDescription(targeting: Targeting): string {
    switch (targeting.type) {
        case "all": {
            if (targeting.filter === "enemy") {
                return "all enemies";
            }
            if (targeting.filter === "ally") {
                return "all allies";
            }
            return "everyone";
        }
        case "single": {
            if (targeting.filter === "enemy") {
                return "one enemy";
            }
            if (targeting.filter === "ally") {
                return "one ally";
            }
            return "anyone";
        }
    }
}

interface TargetingDescriptionProps {
    readonly targeting: Targeting;
}
function TargetingDescription({ targeting }: TargetingDescriptionProps) {
    return <span className="targetingDescription">Targets {getTargetingDescription(targeting)}</span>;
}

interface ActionTooltipProps {
    readonly action: Action;
    readonly casterId: string;
}

// Add combat log that shows up where dialog would be if it's not dialoging

export const ActionTooltip = ({ action, casterId }: ActionTooltipProps) => {
    const casterEntity = EntityMap.get(casterId)!;
    return (
        <Tooltip id={`action${action.id}${casterId}`} className="actionTooltip">
            <span className="rangeType">{action.range}</span>
            <TargetingDescription targeting={action.targeting} />
            <span className="waitTimeCost">
                <span className="waitTimeNoun" data-tip data-for="waitTimeCostExplainer">
                    wait time:
                </span>{" "}
                {action.waitTime}
            </span>
            {action.cooldown && <span className="cooldown">cooldown: {action.cooldown} turns</span>}
            {action.mainTargetImpact.damage && (
                <DamageAmount action={action} casterEntity={casterEntity} targetType={"mainTarget"} />
            )}
            {action.secondaryTargetImpact?.damage &&
                action.secondaryTargetImpact.damage !== action.mainTargetImpact.damage && (
                    <>
                        <DamageAmount action={action} casterEntity={casterEntity} targetType={"secondaryTarget"} />
                    </>
                )}
            {action.mainTargetImpact.effects && (
                <span>
                    applies{" "}
                    {action.mainTargetImpact.effects.map((effect) => (
                        <React.Fragment key={effect.name}>
                            <span
                                className={`effectTitle ${effect.name}`}
                                data-tip
                                data-for={`${effect.name}Description`}>
                                {effect.name}
                            </span>
                            <EffectTooltip effect={effect} />
                        </React.Fragment>
                    ))}
                </span>
            )}
            <Tooltip id="waitTimeCostExplainer">The time you will have to wait until your next turn.</Tooltip>
        </Tooltip>
    );
};

interface EffectTooltipProps {
    readonly effect: typeof Effect;
    readonly extraId?: string;
}
export const EffectTooltip = ({ effect, extraId = "" }: EffectTooltipProps) => {
    const id = `${effect.name}Description${extraId}`;
    if (effect === Chilled) {
        return (
            <Tooltip id={id} className="effectTooltip">
                <span className="effectTitle Chilled">{Chilled.name}</span>
                <p>
                    Lowers Speed. At three stacks, applies{" "}
                    <span className="effectTitle Freeze" data-tip data-for={`FreezeDescription${extraId}`}>
                        Freeze
                    </span>
                </p>
                <EffectTooltip effect={Freeze} extraId={extraId} />
            </Tooltip>
        );
    }
    if (effect === Freeze) {
        return (
            <Tooltip id={id} className="effectTooltip">
                <span className="effectTitle Freeze">{Freeze.name}</span>
                <p>They're frozen</p>
            </Tooltip>
        );
    }
    if (effect === Exposed) {
        return (
            <Tooltip id={id} className="effectTooltip">
                <span className="effectTitle Exposed">{Exposed.name}</span>
                <p>Reduces Sturdiness.</p>
            </Tooltip>
        );
    }

    return null;
};

const descriptions = {
    speed: {
        ally: "You hit more often, get hit less often and generally do more with your time.",
        enemy: "How fast they go.",
    },
    strength: {
        ally: "Hit things, Hit them Harder, Hit them more and get Hit better.",
        enemy: "How hard they hit and how hard they can get hit.",
    },
    precision: {
        ally: "Put your damage where you want it, put your damage where it hurts and where it will cause the most inconvenience.",
        enemy: "How hard to dodge their attacks are.",
    },
    unpredictability: {
        ally: "Strange things happen around you, you don't really see them coming, but neither do your enemies. It seems to work out.",
        enemy: "How hard it is to guess where they'll be or what they'll do.",
    },
    sturdiness: {
        ally: "You can take the hits, you can take whatever else they throw at you, and anything else that comes up along the way.",
        enemy: "How hard they are to take down.",
    },
    untiltability: { ally: "You're used to things going wrong.", enemy: "How used they are to things going wrong." },
} as const;

export type Stat = keyof typeof descriptions;
interface StatExplanationTooltipProps {
    readonly stat: Stat;
    readonly ally: boolean;
    readonly extraId?: string;
}
export const StatExplanationTooltip = ({ stat, ally, extraId = "" }: StatExplanationTooltipProps) => {
    return (
        <Tooltip id={`${stat}Description${ally ? "ally" : "enemy"}${extraId}`} className="statDescriptionTooltip">
            <span className="statTitle ${stat}">{stat}</span>
            <p>{ally ? descriptions[stat].ally : descriptions[stat].enemy}</p>
        </Tooltip>
    );
};
