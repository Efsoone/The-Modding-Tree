addLayer("p", {
    name: "Rebirth", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    
    }},
    color: "#039cd8ff",
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource: "rebirth points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    upgrades: {
    11: {
      title: "1",
      description: "x2 Rebirth Points",
      cost: new Decimal(1),
      effect() { return new Decimal(2) },
    },
    12: {
      title: "2",
      description: "x2 RP again",
      cost: new Decimal(5),
      effect() { return new Decimal(2) },
      unlocked() { return hasUpgrade("p", 11) },
    },
    13: {
      title: "3",
      description: "x3 Points",
      cost: new Decimal(13),
      effect() { return new Decimal(3) },
      unlocked() { return hasUpgrade("p", 12) },
    },
    14: {
      title: "4",
      description: "x3 RP",
      cost: new Decimal(50),
      effect() { return new Decimal(3) },
      unlocked() { return hasUpgrade("p", 13) },
    },
    15: {
      title: "5",
      description: "Points boost RP gain! Max:x10",
      cost: new Decimal(200),
      effect() { return player.points.add(1).pow(0.25).min(10) },
      effectDisplay() { return "x" + format(upgradeEffect("p", 15)) },
      unlocked() { return hasUpgrade("p", 14) },
    },
    21: {
      title: "6",
      description: "x2 Points",
      cost: new Decimal(1250),
      effect() { return new Decimal(2) },
      unlocked() { return hasUpgrade("p", 15) },


    }},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("p", 11)) mult = mult.times(upgradeEffect("p", 11))
        if (hasUpgrade("p", 12)) mult = mult.times(upgradeEffect("p", 12))
        if (hasUpgrade("p", 14)) mult = mult.times(upgradeEffect("p", 14))
        if (hasUpgrade("p", 15)) mult = mult.times(upgradeEffect("p", 15))
        



        return mult
    
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "r", description: "R: Reset for Rebirth points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
})
