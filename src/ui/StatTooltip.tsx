import { EntityMap } from "@rpg/entities";
import { Entity } from "@rpg/entity";
import { getEntityName } from "@rpg/entityName";
import cx from "classnames";
import "./StatTooltip.css";
import { Stat, Tooltip } from "./ToolTips";

interface StatLineProps {
    readonly name: string;
    readonly stat: Stat;
    readonly ally: boolean;
    readonly entity: Entity;
}
const StatLine = ({ name, stat, ally, entity }: StatLineProps) => {
    let baseStat = entity[stat];
    let modifiedStat = entity.getModifiedStat(stat);
    let buffed = false;
    let debuffed = false;
    if (baseStat !== modifiedStat) {
        if (baseStat > modifiedStat) {
            debuffed = true;
        } else if (baseStat < modifiedStat) {
            buffed = true;
        }
    }

    return (
        <span className="stat" data-tip data-for={`${stat}Description${ally ? "ally" : "enemy"}`}>
            <span className="statName">{name}: </span>
            <span className={cx("statValue", buffed && "buffed", debuffed && "debuffed")}>{modifiedStat}</span>
        </span>
    );
};

interface StatTooltipProps {
    readonly entId: string;
    readonly ally: boolean;
}
export const StatTooltip = ({ entId, ally }: StatTooltipProps) => {
    const entity = EntityMap.get(entId);
    if (!entity) {
        return null;
    }

    return (
        <Tooltip className="statTooltip" id={`${entId}stats`} delayShow={700}>
            <span className="name">{getEntityName(entity)}</span>
            <span className="hp">{entity.health}</span>

            <div className="stats">
                <StatLine stat="speed" name="SPD" ally={ally} entity={entity} />
                <StatLine stat="strength" name="STR" ally={ally} entity={entity} />
                <StatLine stat="precision" name="PRE" ally={ally} entity={entity} />
                <StatLine stat="unpredictability" name="UNP" ally={ally} entity={entity} />
                <StatLine stat="sturdiness" name="SRD" ally={ally} entity={entity} />
                <StatLine stat="untiltability" name="UTB" ally={ally} entity={entity} />
            </div>
        </Tooltip>
    );
};
