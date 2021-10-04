import portrait_url from "@assets/fox.png";
import { Action } from "@rpg/actions";
import { combatLog, TargetImpact } from "@rpg/combat";
import { Drowsy } from "@rpg/effects/drowsy";
import { Oiled } from "@rpg/effects/oiled";
import { EntityMap } from "@rpg/entities";
import { Player } from "@rpg/player";

const plunge: Action = {
    id: "plunge",
    name: "Plunge",
    range: "melee",
    overrideUse(action, casterId, targetId) {
        const caster = EntityMap.get(casterId)!;
        const target = EntityMap.get(targetId)!;

        const baseDamage = (caster.getModifiedStat("speed") - target.getModifiedStat("speed")) / 3;

        const damage = caster.calculateDamageThisDeals(baseDamage, action.range);
        const amountHurt = target.hurt(damage, action.range);

        const impactOnTarget: TargetImpact = {
            targetId: target.id,
            targetType: "mainTarget",
            impact: {
                damage: amountHurt,
                casterPrecisionDamageMod: caster.getPrecisionDamagePercentage(),
                casterStrengthDamageMod: caster.getStrengthDamagePercentage(),
                targetStrengthResistanceMod: target.getStrengthDamageReductionPercentage(),
                targetSturdinessResistanceMod: target.getSturdinessDamageReductionPercentage(),
            },
        };

        combatLog.push({ actorId: casterId, action, targetImpacts: [impactOnTarget] });
    },
    mainTargetImpact: {
        damage: 0,
    },
    logTemplate: "{CASTER} uses {NAME} on {MAINTARGET}, {IMPACT}.",
    waitTime: 3,
    targeting: {
        type: "single",
        filter: "enemy",
    },
};

const lubricate: Action = {
    id: "lubricate",
    name: "Oil",
    range: "melee",
    mainTargetImpact: {
        effects: [Oiled],
    },
    instabilityMod: 5,
    logTemplate: "{CASTER} {NAME}'s {MAINTARGET}, {IMPACT}.",
    waitTime: 2,
    targeting: {
        type: "single",
        filter: "enemy",
    },
};

const chloroform: Action = {
    id: "chloroform",
    name: "Chloroform",
    range: "melee",
    mainTargetImpact: {
        effects: [Drowsy],
    },
    instabilityMod: 5,
    logTemplate: "{CASTER} {NAME}'s {MAINTARGET}, they're going to be reeling for a bit, {IMPACT}.",
    waitTime: 5,
    cooldown: 3,
    targeting: {
        type: "single",
        filter: "enemy",
    },
};

export class FoxPlayer extends Player {
    public static realName = "FoxPlayer";
    public id: string = "fox";
    public portraitUrl = portrait_url;
    public health = 25;
    public speed = 5;
    public static actions = [plunge, lubricate, chloroform];
}
