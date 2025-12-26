addLayer("r", {
    name: "Reborn",
    symbol: "R",
    position: 0,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#368800ff",

    rebornReqs: [
        new Decimal(5),
        new Decimal(10),
        new Decimal(500),
        new Decimal(5e4),
        new Decimal(5e8),
        new Decimal(1.25e11),
        new Decimal(5e1200),

    ],

    requires() {
        let r = player.r.points.toNumber()
        if (r >= this.rebornReqs.length) return new Decimal(Infinity)
        return this.rebornReqs[r]
    },

    resource: "Reborn",
    baseResource: "points",
    baseAmount() { return player.points },

    type: "static",
    row: 0,

    milestones: {
        0: {
            requirementDescription: "1th Reborn",
            effectDescription: "+1 Points gain",
            done() { return player.r.points.gte(1) }
        },
        1: {
            requirementDescription: "2th Reborn",
            effectDescription: "x1.5 Points gain, Unlock Cash Layer",
            done() { return player.r.points.gte(2) },
            unlocked() { return hasMilestone("r", 0) }
        },
        2: {
            requirementDescription: "3th Reborn",
            effectDescription: "x2 Cash gain,Two new Cash Upg!",
            done() { return player.r.points.gte(3) },
            unlocked() { return hasMilestone("r", 1) }
        },
        3: {
            requirementDescription: "4th Reborn",
            effectDescription: "x1.5→x3 Points gain,x2→x4 Cash gain,Three new Cash Upg!",
            done() { return player.r.points.gte(4) },
            unlocked() { return hasMilestone("r", 2) }
        },
        4: {
            requirementDescription: "5th Reborn",
            effectDescription: "Unlock Coins Layer!",
            done() { return player.r.points.gte(5) },
            unlocked() { return hasMilestone("r", 3) }
        },
        5: {
            requirementDescription: "6th Reborn",
            effectDescription: "%100 Cash/s, x3 Coins and Row 2 Coins Upg!",
            done() { return player.r.points.gte(6) },
            unlocked() { return hasMilestone("r", 4) }
        },
        6: {
            requirementDescription: "7th Reborn",
            effectDescription: "Coming Soon",
            done() { return player.r.points.gte(7) },
            unlocked() { return hasMilestone("r", 5) }
        },








      },

    doReset(resettingLayer) {
        if (resettingLayer !== this.layer) {
            player.points = new Decimal(0)
            
        }
    },

    layerShown() { return true }
}),
addLayer("c", {
    name: "Cash",
    symbol: "$",
    position: 1,
    row: 1,
    color: "#3cff00ff",
    
    branches: ["r"],
    
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        upgrades: [],
    }},

    resource: "Cash",
    baseResource: "points",
    baseAmount() { return player.points },

    requires: new Decimal(10),
    type: "normal",
    exponent: 0.5,

    



    milestones: {
        0: {
            requirementDescription: "1e11 Cash",
            effectDescription: "x^1.15 Cash Gain",
            done() { return player.c.points.gte(1e11)},
            unlocked() { return hasUpgrade("co", 14) }
        },
        1: {
            requirementDescription: "1e12 Cash",
            effectDescription: "x4 Coins Gain and x3 Cash Gain!",
            done() { return player.c.points.gte(1e12)},
            unlocked() { return hasMilestone("c", 0) }
        },
        


    },


    upgrades: {
    11: {
      title: "Oh,First big boost!",
      description: "x3 Cash",
      cost: new Decimal(1),
      effect() { return new Decimal(3) },
    },
    12: {
      title: "Auxiliary Point",
      description: "x2 Point",
      cost: new Decimal(15),//15
      effect() { return new Decimal(2) },
      unlocked() { return hasUpgrade("c", 11) }
    },
    13: {
      title: "Go fast farming!",
      description: "Point boost Cash gain!Max:x100",
      cost: new Decimal(40),//40
      effect() { return player.points.add(1).pow(0.55).min(100) },
      effectDisplay() { return "x" + format(upgradeEffect("c", 13)) },
      unlocked() { return hasUpgrade("c", 12) } 
    },
    14: {
      title: "Yea!Keep it up.",
      description: "x3 Point",
      cost: new Decimal(333),
      effect() { return new Decimal(3) },
      unlocked() { return hasUpgrade("c", 13) }
    },
    15: {
    title: "Omg,<br>Unbelievable!",
    description: "Cash boost Point!But slower.",
    cost: new Decimal(2500),
    effect() {
        let c = player.c.points
        let linear = new Decimal(0.0001)
        let base = new Decimal(1).add(c.mul(linear))
        if (base.gt(1e5)) base = new Decimal(1e5)
        return base
    },
    effectDisplay() { return "x" + format(upgradeEffect("c", 15)) },
    unlocked() { return hasUpgrade("c", 14) }
    },
    21: {
    title: "Deja vu?",
    description: "x3 Cash",
    cost: new Decimal(7500),
    effect() {return new Decimal(3)},
    unlocked() {return hasMilestone("r", 2) && hasUpgrade("c", 15)}
    },
    22: {
    title: "Slow down please. ;(",
    description: "Cash Upg boost Point!",
    cost: new Decimal(50000),
    effect() {
        let count = Object.keys(player.c.upgrades).length
        let per = new Decimal(0.1)
        return new Decimal(1).add(per.mul(count))
    },
    effectDisplay() {return "x" + format(this.effect())},
    unlocked() {return hasMilestone("r", 2) && hasUpgrade("c", 21)}
    },
    23: {
    title: "Cash for Cash",
    description: "Cash boost itself!",
    cost: new Decimal(2.5e6),
    effect() {return player.c.points.add(1).pow(0.07).min(1e100)},
    effectDisplay() {return "x" + format(this.effect())},
    unlocked() {return hasMilestone("r", 3) && hasUpgrade("c", 22)}
    },
    24: {
    title: "More more and more!",
    description: "x3 Point",
    cost: new Decimal(2.5e7),
    effect() { return new Decimal(3)},
    unlocked() {return hasMilestone("r", 3) && hasUpgrade("c", 23)}
    },
    25: {
    title: "Point for Point",
    description: "Point boost itself!",
    cost: new Decimal(1e8),
    effect() {return player.points.add(1).pow(0.02).min(1e100)},
    effectDisplay() {return "x" + format(this.effect())},
    unlocked() {return hasMilestone("r", 3) && hasUpgrade("c", 24)}
    },
    16: {
    title: "Chose(A)",
    description: "x4 Cash and Points",
    cost: new Decimal(2e14),
    canAfford() { return !hasUpgrade("c", 26)},
    effect() {return new Decimal(4)},
    unlocked() {return hasMilestone("r", 5) && hasUpgrade("co", 22)}
    },
    26: {
    title: "Chose(B)",
    description: "x4 Coins",
    cost: new Decimal(2e14),
    canAfford() { return !hasUpgrade("c", 16)},
    effect() {return new Decimal(4)},
    unlocked() {return hasMilestone("r", 5) && hasUpgrade("co", 22)}
    },







  
  
  
  
  },
    gainMult() {
        let mult = new Decimal(1)
        if (hasMilestone("r", 2)) {mult = mult.mul(2)}
        if (hasMilestone("r", 3)) {mult = mult.mul(2)}
        if (hasMilestone("c", 1)) {mult = mult.mul(3)}
        if (hasUpgrade("c", 11)) mult = mult.times(upgradeEffect("c", 11))
        if (hasUpgrade("c", 13)) mult = mult.times(upgradeEffect("c", 13))
        if (hasUpgrade("c", 21)) mult = mult.times(upgradeEffect("c", 21))
        if (hasUpgrade("c", 23)) mult = mult.mul(upgradeEffect("c", 23))
        if (hasUpgrade("c", 16)) mult = mult.times(upgradeEffect("c", 16))
        if (hasMilestone("c", 0)) mult = mult.pow(1.15)
        if (hasUpgrade("co", 11)) mult = mult.mul(upgradeEffect("co", 11))
        if (hasUpgrade("co", 14)) mult = mult.mul(upgradeEffect("co", 14))
        if (hasUpgrade("co", 24)) mult = mult.mul(upgradeEffect("co", 24))



        return mult
    },

    gainExp() {
        return new Decimal(1)
    },

    passiveGeneration() {
    if (hasMilestone("r", 5)) return 1
    return 0
    },

    hotkeys: [
        {
            key: "c",
            description: "C: Reset for Cash",
            onPress() {
                if (canReset("c")) doReset("c")
            }
        }
    ],

    layerShown() {
        return hasMilestone("r", 1)
    }
})
addLayer("co", {
    name: "Coins",
    symbol: "C",
    position: 1,
    row: 1,
    color: "#ffee00ff",
    
    branches: ["r"],
    
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},

    resource: "Coins",
    baseResource: "Cash",
    baseAmount() { return player.c.points },

    requires: new Decimal(8e8),
    type: "normal",
    exponent: 0.25,

    

    upgrades:{
    11: {
    title: "You reach?",
    description: "x3 Cash",
    cost: new Decimal(10),
    effect() { return new Decimal(3) },
    },
    12: {
    title: "Soo boring! :/",
    description: "x2 Coins",
    cost: new Decimal(15),
    effect() { return new Decimal(2) },
    unlocked() { return hasUpgrade("co", 11) }
    },
    13: {
    title: "How to buying?",
    description: "Point boost Coins!",
    cost: new Decimal(75),
    effect() { return player.points.add(1).pow(0.2).min(250) },
    effectDisplay() { return "x" + format(upgradeEffect("co", 13)) },
    unlocked() { return hasUpgrade("co", 12) }
    },
    14: {
    title: "Easy cash ;)",
    description: "Coins boost cash!",
    cost: new Decimal(1000),
    effect() {
        let c = player.co.points
        let linear = new Decimal(0.001)
        let base = new Decimal(1).add(c.mul(linear))
        if (base.gt(100)) base = new Decimal(100)
        return base
    },
    effectDisplay() { return "x" + format(upgradeEffect("co", 14)) },
    unlocked() { return hasUpgrade("co", 13) }
    },
    15: {
    title: "Start coins farm!",
    description: "Coins boost point! Slower",
    cost: new Decimal(10000),
    effect() {
        let c = player.co.points
        let linear = new Decimal(0.00075)
        let base = new Decimal(1).add(c.mul(linear))
        if (base.gt(100)) base = new Decimal(100)
        return base
    },
    effectDisplay() { return "x" + format(upgradeEffect("co", 15)) },
    unlocked() {return hasMilestone("c", 1)}
    },
    21: {
    title: "High Boost!",
    description: "x^1.25 Coins",
    cost: new Decimal(1e6),
    effect() { return new Decimal(1.25) },
    unlocked() {return hasMilestone("r", 5) && hasUpgrade("co", 15)}
    },
    22: {
    title: "Find Secrets<br> Upg!",
    description: "Unlock two cash Upg!",
    cost: new Decimal(7.5e6),
    unlocked() {return hasMilestone("r", 5) && hasUpgrade("co", 21)}
    },
    23: {
    title: "Coins for Coins",
    description: "Coins boost itself",
    cost: new Decimal(3e7),
    effect() {return player.co.points.add(1).pow(0.1).min(1e100)},
    effectDisplay() {return "x" + format(this.effect())},
    unlocked() {return hasMilestone("r", 5) && hasUpgrade("co", 22)}
    },
    24: {
    title: "CC",
    description: "x2.5 Coins and Cash",
    cost: new Decimal(1.5e8),
    effect() { return new Decimal(2.5) },
    unlocked() { return hasUpgrade("co", 23) }
    },
    25: {
    title: "",
    description: "Coins boost Point!<br>Very slower",
    cost: new Decimal(1e9),
    effect() {
        let c = player.co.points
        let linear = new Decimal(0.00000000125)
        let base = new Decimal(1).add(c.mul(linear))
        if (base.gt(1e4)) base = new Decimal(1e4)
        return base
    },
    effectDisplay() { return "x" + format(upgradeEffect("co", 25)) },
    unlocked() { return hasUpgrade("co", 24) }
    },







    },

    gainMult() {
        let mult = new Decimal(1)
        if (hasMilestone("c", 1)) {mult = mult.mul(4)}
        if (hasMilestone("r", 5)) {mult = mult.mul(3)}
        if (hasUpgrade("c", 26)) mult = mult.times(upgradeEffect("c", 26))
        if (hasUpgrade("co", 12)) mult = mult.mul(upgradeEffect("co", 12))
        if (hasUpgrade("co", 13)) mult = mult.mul(upgradeEffect("co", 13))
        if (hasUpgrade("co", 23)) mult = mult.mul(upgradeEffect("co", 23))
        if (hasUpgrade("co", 24)) mult = mult.mul(upgradeEffect("co", 24))





        return mult
    },

    gainExp() {
        let exp = new Decimal(1)
        if (hasUpgrade("co", 21)) exp = exp.mul(upgradeEffect("co", 21))

        return exp  
    },

    hotkeys: [
    {
        key: "o",
        description: "O: Reset for Coins",
        onPress() {
            if (canReset("co")) doReset("co")
            }
        }
    ],

    doReset(resettingLayer) {
    if (resettingLayer === this.layer) {
        player.c.points = new Decimal(0)
    }},

    layerShown() {
        return hasMilestone("r", 4)
    }
})