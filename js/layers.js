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
            effectDescription: "Coming Soon",
            done() { return player.r.points.gte(5) },
            unlocked() { return hasMilestone("r", 3) }
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
        coins: new Decimal(0),
    }},

    resource: "Cash",
    baseResource: "points",
    baseAmount() { return player.points },

    requires: new Decimal(10),
    type: "normal",
    exponent: 0.5,



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
      title: "Why?I need point!",
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
    title: "Point for point",
    description: "Point boost itself!",
    cost: new Decimal(1e8),
    effect() {return player.points.add(1).pow(0.02).min(1e100)},
    effectDisplay() {return "x" + format(this.effect())},
    unlocked() {return hasMilestone("r", 3) && hasUpgrade("c", 24)}
    },









  
  
  
  
  },
    gainMult() {
        let mult = new Decimal(1)
        if (hasMilestone("r", 2)) {mult = mult.mul(2)}
        if (hasMilestone("r", 3)) {mult = mult.mul(2)}
        if (hasUpgrade("c", 11)) mult = mult.times(upgradeEffect("c", 11))
        if (hasUpgrade("c", 13)) mult = mult.times(upgradeEffect("c", 13))
        if (hasUpgrade("c", 21)) mult = mult.times(upgradeEffect("c", 21))
        if (hasUpgrade("c", 23)) mult = mult.mul(upgradeEffect("c", 23))



        return mult
    },

    gainExp() {
        return new Decimal(1)
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

