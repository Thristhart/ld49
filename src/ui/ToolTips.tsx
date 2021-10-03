import { Action } from "@rpg/actions";
import { Chilled, Effect, Freeze } from "@rpg/effects";
import { EntityMap } from "@rpg/entities";
import { Entity } from "@rpg/entity";
import cx from "classnames";
import React, { Fragment } from "react";
import ReactTooltip, { TooltipProps } from "react-tooltip";
import "./ToolTips.css";

const Tooltip = (props: TooltipProps) => {
    return (
        <ReactTooltip
            effect="solid"
            clickable={true}
            delayHide={500}
            border={true}
            {...props}
            className={cx(props.className, "tooltip")}
        />
    );
};

interface DamageBonusProps {
    readonly action: Action;
    readonly casterEntity: Entity;
}
const DamageBonus = ({ action, casterEntity }: DamageBonusProps) => {
    if (!action.damage) {
        return null;
    }
    const modifiedDamage = casterEntity.calculateDamageThisDeals(action.damage, action.range);
    if (modifiedDamage === action.damage) {
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
            {" + "}
            <span className="bonus">
                {bonus}% from {statName}
            </span>
        </>
    );
};

interface DamageExplanationTooltipProps {
    readonly action: Action;
    readonly casterEntity: Entity;
    readonly extraId?: string;
}
export const DamageExplanationTooltip = ({ action, casterEntity, extraId = "" }: DamageExplanationTooltipProps) => {
    return (
        <Tooltip id={`action${action.id}${casterEntity.id}damage${extraId}`}>
            {action.damage}
            <DamageBonus action={action} casterEntity={casterEntity} />
        </Tooltip>
    );
};

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
            {action.damage && (
                <>
                    <span className="damageDesc">
                        deals{" "}
                        <span className="amount" data-tip data-for={`action${action.id}${casterId}damage`}>
                            {casterEntity.calculateDamageThisDeals(action.damage, action.range)}
                        </span>{" "}
                        damage
                    </span>

                    <DamageExplanationTooltip action={action} casterEntity={casterEntity} />
                </>
            )}
            {action.effects && (
                <span>
                    applies{" "}
                    {action.effects.map((effect) => (
                        <Fragment key={effect.name}>
                            <span
                                className={`effectTitle ${effect.name}`}
                                data-tip
                                data-for={`${effect.name}Description`}>
                                {effect.name}
                            </span>
                            <EffectTooltip effect={effect} />
                        </Fragment>
                    ))}
                </span>
            )}
        </Tooltip>
    );
};

interface EffectTooltipProps {
    readonly effect: typeof Effect;
    readonly extraId?: string;
}
export const EffectTooltip = ({ effect, extraId = "" }: EffectTooltipProps) => {
    if (effect === Chilled) {
        return (
            <Tooltip id={`ChilledDescription${extraId}`} className="effectTooltip">
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
            <Tooltip id={`FreezeDescription${extraId}`} className="effectTooltip">
                <span className="effectTitle Freeze">{Freeze.name}</span>
                <p>They're frozen</p>
            </Tooltip>
        );
    }

    return null;
};
