addLayer("r", {
    name: "Rebirth", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        
    }},
    color: "#005c79",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Rebirth points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent

    

    doReset(resettingLayer) {
    if (layers[resettingLayer].row > this.row) {

        let keep = []

        // Prestige Upgrade 13 varsa Rebirth upgrade'lerini koru
        if (hasUpgrade("p", 13)) {
            keep.push("upgrades")
        }
        
        layerDataReset("r", keep)

        if (!player.r.upgrades.includes(25)) {
            player.r.upgrades.push(25)}
    }},

    tabFormat: {
    "Upgrades": {
        content: [
            "main-display",
            "prestige-button",
            ["display-text", () => `You have ${format(player.points)} points` ],
            "blank",
            "upgrades",
        ]
    },
    //"Milestones": {
        //content: [
            //"milestones"
        //]
    //}
    },
    
    microtabs: {
    stuff:{
        "Upgrades": {
        Upgrades: {
            content: ["upgrades"]
        }},
        "Milestones": {
            content: ["milestones"]
        
    }}},

    upgrades: {
    11: {
    title: "Rebirth Upgrade 11!",
    description: "x5 Points!",
    cost: new Decimal(2),
    effect() { return new Decimal(5) },
    },
    12: {
    title: "Rebirth Upgrade 12!",
    description: "x3 Rebirth Points!",
    cost: new Decimal(20),
    effect() { return new Decimal(3) },
    unlocked() { return hasUpgrade("r", 11) }
    },
    13: {
    title: "Rebirth Upgrade 13!",
    description: "Rebirth boost Points!",
    cost: new Decimal(100),
    effect() {
        let r = player.r.points
        let linear = new Decimal(0.015)
        let base = new Decimal(1).add(r.mul(linear))
        if (base.gt(1e100)) base = new Decimal(1e100)
        return base
    },
    effectDisplay() { return "x" + format(upgradeEffect("r", 13)) },
    unlocked() { return hasUpgrade("r", 12) }
    },
    14: {
    title: "Rebirth Upgrade 14!",
    description: "x4 Rebirth Points!",
    cost: new Decimal(300),
    effect() { return new Decimal(4) },
    unlocked() { return hasUpgrade("r", 13) }
    },
    15: {
    title: "Rebirth Upgrade 15!",
    description: "Points boost Rebirth!",
    cost: new Decimal(3000),
    effect() { return player.points.add(1).pow(0.1).min(100) },
    effectDisplay() { return "x" + format(upgradeEffect("r", 15)) },
    unlocked() { return hasUpgrade("r", 14) }
    },
    21: {
    title: "Rebirth Upgrade 21!",
    description: "x3 Points!",
    cost: new Decimal(12500),
    effect() { return new Decimal(3) },
    unlocked() { return hasUpgrade("r", 15) }
    },
    22: {
    title: "Rebirth Upgrade 22!",
    description: "x^1.15 Rebirth Points!",
    cost: new Decimal(100000),
    effect() { return new Decimal(1.25) },
    unlocked() { return hasUpgrade("r", 21) }
    },
    23: {
    title: "Rebirth Upgrade 23!",
    description: "x^1.05 Points!",
    cost: new Decimal(5e7),
    effect() { return new Decimal(1.05) },
    unlocked() { return hasUpgrade("r", 22) }
    },
    24: {
    title: "Rebirth Upgrade 24!",
    description: "Rebirth boost itself!",
    cost: new Decimal(1e9),
    effect() {return player.r.points.add(1).pow(0.085).min(1e100)},
    effectDisplay() {return "x" + format(this.effect())},
    unlocked() { return hasUpgrade("r", 23) }
    },
    25: {
    title: "Rebirth Upgrade 25!",
    description: "Unlock new Layer!<br>and<br>x2 Rebirth!(Permament!)",
    cost: new Decimal(1e14),
    effect() { return new Decimal(2) },
    unlocked() { return hasUpgrade("r", 24) },
    },



},



    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        mult = mult.times(new Decimal(1).add(player.p.points.times(0.05)))
        if (hasMilestone("p", 0)) {mult = mult.mul(4)}
        if (hasUpgrade("r", 12)) mult = mult.times(upgradeEffect("r", 12))
        if (hasUpgrade("r", 14)) mult = mult.times(upgradeEffect("r", 14))
        if (hasUpgrade("r", 15)) mult = mult.times(upgradeEffect("r", 15))
        if (hasUpgrade("r", 24)) mult = mult.times(upgradeEffect("r", 24))
        if (hasUpgrade("r", 25)) mult = mult.times(upgradeEffect("r", 25))
        if (hasUpgrade("p", 11)) mult = mult.times(upgradeEffect("p", 11))
        if (hasUpgrade("p", 14)) mult = mult.times(upgradeEffect("p", 14))



        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        if (hasUpgrade("r", 22)) exp = exp.mul(upgradeEffect("r", 22))


        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "r", description: "R: Reset for Rebirth Points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
}),
addLayer("p", {
    name: "Prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        
    }},
    color: "#008854",
    branches: ["r"],
    requires: new Decimal(1e15), // Can be a function that takes requirement increases into account
    resource: "Prestige points", // Name of prestige currency
    baseResource: "Rebirth points", // Name of resource prestige is based on
    baseAmount() {return player.r.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.06, // Prestige currency exponent


    tabFormat: {
    "Upgrades": {
        content: [
            "main-display",
            "prestige-button",
            ["display-text", () => `You have ${format(player.r.points)} Rebirth points`],
            "blank",
            "upgrades",
        ]
    },
    "Milestones": {
           content: [
            "main-display",
            "prestige-button",
            ["display-text", () => `You have ${format(player.r.points)} Rebirth points`],
            "blank",
            "milestones",
        ]
    }
    },

    microtabs: {
    stuff:{
        "Upgrades": {
        Upgrades: {
            content: ["upgrades"]
        }},
        "Milestones": {
            content: ["milestones"]
        
    }}},

    milestones: {
        0: {
            requirementDescription: "1 Prestige",
            effectDescription: "x4 Rebirth points! ",
            done() { return player.p.points.gte(1) }
        },
        1: {
            requirementDescription: "2 Prestige",
            effectDescription() {
            return `Prestige boost Rebirth Gain! Current: x${format(this.effect())}` },
            effect() {return new Decimal(1).add(player.p.points.times(0.01))},
            done() { return player.p.points.gte(2) }
        },
        2: {
            requirementDescription: "5 Prestige",
            effectDescription: "x5 Points!",
            done() { return player.p.points.gte(5) }
        },
        3: {
            requirementDescription: "20 Prestige",
            effectDescription: "x2.5 Prestige Points!",
            done() { return player.p.points.gte(20) }
        },
        4: {
            requirementDescription: "100 Prestige",
            effectDescription: "Unlock Prestige Upgrades!",
            done() { return player.p.points.gte(100) }
        }


    },

    upgrades: {
    11: {
    title: "Prestige Upgrade 11!",
    description: "x3 All Stats!",
    cost: new Decimal(100),
    effect() { return new Decimal(3) },
    unlocked() {return hasMilestone("p", 4)}
    },
    12: {
    title: "Prestige Upgrade 12!",
    description: "Points boost little Prestige!",
    cost: new Decimal(200),
    effect() { return player.points.add(1).pow(0.008).min(100) },
    effectDisplay() { return "x" + format(upgradeEffect("p", 12)) },
    unlocked() {return player.p.points.gte(200) || hasUpgrade("p", 12)}
    //unlocked() {return hasMilestone("p", 4)}
    },
    13: {
    title: "Prestige Upgrade 13!",
    description: "Keep Rebirth Upgrades!",
    cost: new Decimal(1000),
    unlocked() {return player.p.points.gte(1000) || hasUpgrade("p", 13)}
    },
    14: {
    title: "Prestige Upgrade 14!",
    description: "xe5 Rebirth Points!",
    cost: new Decimal(2500),
    effect() { return new Decimal(1e5) },
    unlocked() {return player.p.points.gte(2500) || hasUpgrade("p", 14)}
    }, 
    15: {
    title: "Prestige Upgrade 15!",
    description: "Unlock Challenges!<br>Soon?",
    cost: new Decimal(Infinity),
    effect() { return new Decimal(1e5) },
    unlocked() {return player.p.points.gte(1e6) || hasUpgrade("p", 15)}
    },






    },


    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasMilestone("p", 3)) {mult = mult.mul(2.5)}
        if (hasUpgrade("p", 11)) mult = mult.times(upgradeEffect("p", 11))
        if (hasUpgrade("p", 12)) mult = mult.times(upgradeEffect("p", 12))




        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)

        return exp
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for Prestige Points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("r", 25)}
})