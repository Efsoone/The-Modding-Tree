addLayer("rp", {
    name: "Runic Power",
    symbol: "RP",
    position: 0,
    row: 0,
    color: "#10b981",
    
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        activated: false
    }},

    resource: "Runic Power",
    baseResource: "Skills",
    baseAmount() { return player.points },
    requires: new Decimal(10),
    type: "normal",
    exponent: 0.5,

    
    layerShown() { 
    return player.points.gte(8) || player.rp.activated 
    },
    canReset() { 
    return !player.rp.activated && player.points.gte(10) 
    },
    onPrestige(gain) {
        let resetGain = layers.rp.getResetGain();

        player.rp.points = player.rp.points.add(resetGain);
        player.rp.total = player.rp.total.add(resetGain);

        // Prestij anında elde edilen ilk kazancı Best RP olarak kaydeder
        if (resetGain.gt(player.rp.best)) {
            player.rp.best = resetGain;
        }

        player.rp.activated = true;
    },


    // Prestij yapıldıktan sonra saniyede +1 RP pasif üretimi başlatır
    update(diff) {
        if (player.rp.activated) {
            let gain = layers.rp.passiveGen().times(diff);
            player.rp.points = player.rp.points.add(gain);
            player.rp.total = player.rp.total.add(gain);
        }
    },


    passiveGen() {
      if (!player.rp.activated) return new Decimal(0);
      let gain = player.rp.best;
      if (gain.eq(0)) gain = new Decimal(0);
    if (hasUpgrade("rp", 11)) {
      let mult = layers.rp.upgrades[11].effect();
      gain = gain.times(mult);}
    if (hasUpgrade("rp", 14)) {
      let mult = layers.rp.upgrades[14].effect();
      gain = gain.times(mult);}
    if (layers.r && layers.r.getCommonRPBoost) {
      gain = gain.times(layers.r.getCommonRPBoost());}
    if (hasAchievement('a', 23)) { gain = gain.times(2.5);}
    if (hasUpgrade("rp", 22)) {
      let mult = layers.rp.upgrades[22].effect();
      gain = gain.times(mult);}
    if (hasMilestone("rp", 1)) { gain = gain.times(3);}
    if (hasUpgrade("rp", 23)) {
      let mult = layers.rp.upgrades[23].effect();
      gain = gain.times(mult);}
    if (layers.r && layers.r.getSecretRPBoost) {
      gain = gain.times(layers.r.getSecretRPBoost());}
      
    return gain;
},

    upgrades: {
        11: {
            title: "First Upgrade!",
            description: "Runic Power gain by Rune Shard!",
            cost: new Decimal(50),
            unlocked() { return true },
            effect() {
            return player.r.points.add(1).pow(0.1);
            },
            effectDisplay() { return format(this.effect()) + "x" }
        },
        12: {
            title: "Boost for boost!",
            description: "Rune Shard gain by Runic Power!",
            cost: new Decimal(750),
            unlocked() {return hasUpgrade('rp', 11)},
            effect() {
            return player.rp.points.add(1).pow(0.0518).min(5);
            },
            effectDisplay() { return format(this.effect()) + "x" }
        },
        13: {
            title: "You are very faster!",
            description: "x1.25 Rune Speed!",
            cost: new Decimal(2500),
            unlocked() {return hasUpgrade('rp', 12)},
        },
        14: {
            title: "More Power!",
            description: "Runic Power gain by Runic Power!",
            cost: new Decimal(1e4),
            unlocked() {return hasUpgrade('rp', 13)},
            effect() {
            return player.rp.points.add(1).pow(0.1876).min(100);
            },
            effectDisplay() { return format(this.effect()) + "x" }
        },
        21: {
            title: "Faster Runes!",
            description: "More Rune Bulk by Runic Power!",
            cost: new Decimal(3e5),
            unlocked() {return hasMilestone('rp', 0)},
            effect() {
            return player.rp.points.add(1).pow(0.0257).min(2.5);
            },
            effectDisplay() { return format(this.effect()) + "x" }
        },
        22: {
            title: "NoBulk finally useful!",
            description: "Runic Power gain by TRB NoBulk!",
            cost: new Decimal(1e6),
            unlocked() {return hasUpgrade('rp', 21)},
            effect() {
            return player.r.totalRollsNoBulk.add(1).pow(0.222);
            },
            effectDisplay() { return format(this.effect()) + "x" }
        },
        23: {
            title: "Why slower?",
            description: "Runic Power gain by Skills!",
            cost: new Decimal(2.5e7),
            unlocked() {return hasMilestone('rp', 1)},
            effect() {
            return player.points.add(1).pow(0.75).min(1000);
            },
            effectDisplay() { return format(this.effect()) + "x" }
        },
        24: {
            title: "Grind More Runes!",
            description: "More Rune Luck by Total Runic Power!",
            cost: new Decimal(3e8),
            unlocked() {return hasUpgrade('rp', 23)},
            effect() {
            return player.rp.total.add(1).pow(0.0184).min(3);
            },
            effectDisplay() { return format(this.effect()) + "x" }
        },
    },
    milestones: {
        0: {
            requirementDescription: "100,000 Total Runic Power!",
            done() { return player.rp.total.gte(1e5) },
            effectDescription: "Unlock new Common Rune boost!"
        },
        1: {
            requirementDescription: "10,000,000 Total Runic Power!",
            done() { return player.rp.total.gte(1e7) },
            effectDescription: "More Upgrades, x3 RP, x1.5 Rune Luck!",
            unlocked() { return hasMilestone('rp', 0) },
        },
        2: {
            requirementDescription: "5,000,000,000 Total Runic Power!",
            done() { return player.rp.total.gte(5e9) },
            effectDescription: "Unlock New Rune in Basic Rune Tab!",
            unlocked() { return hasMilestone('rp', 1) },
        },
        3: {
            requirementDescription: "End for v0.1!",
            done() { return player.rp.total.gte(1e50) },
            effectDescription: "Unlock at v0.2!",
            unlocked() { return hasMilestone('rp', 3) },
        },
    },

    microtabs: {
    stuff: {
        "Main": {
          content: [
            "blank",
            ["display-text", () => `Your best Runic Power is <h3 style='color: #10b981; display: inline;'>${formatWhole(player.rp.best)}</h3>`],
            "blank",
            "upgrades"
            ]},
        "Milestones": {
          content: [
            "blank",
            ["display-text", () => `Your total Runic Power is <h3 style='color: #10b981; display: inline;'>${formatWhole(player.rp.total)}</h3>`],
            "blank",
            "milestones"
            ]}
        }
    },

    tabFormat: [
    ["display-text", () => `You have <h2 style='color: #10b981; text-shadow: 0 0 10px #10b981; display: inline;'>${format(player.rp.points)}</h2> Runic Power`],
    ["display-text", () => {
        let gainPerSec = layers.rp.passiveGen();
        return `<span style='color: #e9e9e9; font-weight: bold; font-size: 14px;'>(+${format(gainPerSec)} Runic Power/sec)</span>`;
    }],
    "blank",
    () => (layers.rp.passiveGen().lte(0) ? "prestige-button" : "blank"),
    "blank",
    ["microtabs", "stuff", { "border": "none"}]
    ] 



});
