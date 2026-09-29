addLayer("r", {
    name: "Runes",
    symbol: "R",
    position: 1,
    type: "none",
    row: "side",

    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        totalRollsBulk: new Decimal(0),
        totalRollsNoBulk: new Decimal(0),
        isHoldingRoll: false,
        lastRoll: 0,
        rollTimer: 0,
        runes: { 
          common: new Decimal(0), 
          uncommon: new Decimal(0), 
          rare: new Decimal(0), 
          epic: new Decimal(0),
          legendary: new Decimal(0),
          mythic: new Decimal(0),
          divine: new Decimal(0),
          secret: new Decimal(0),
        },
    }},

    color: "#14b8a6",
    requires: new Decimal(10),
    resource: "Rune Shard",
    baseResource: "skills",
    baseAmount() { return player.points },
    layerShown() { return true },

    // --- BOOST HESAPLAYICILARI ---
    getCommonBoost() {
        let amount = new Decimal(player.r.runes.common || 0);
        return amount.lte(0) ? new Decimal(0) : Decimal.min(new Decimal(10), amount.times(0.1));
    },
    getCommonRPBoost() {
    if (!hasMilestone("rp", 0)) return new Decimal(1);
    let amount = new Decimal(player.r.runes.common || 0);
    if (amount.lte(0)) return new Decimal(1);
    let rpFactor = player.r.runes.common.div(25000).times(0.01);
    let rpBoost = new Decimal(1).add(rpFactor);
    return Decimal.min(new Decimal(3), rpBoost);
    },
    getUncommonBoost() {
        let amount = new Decimal(player.r.runes.uncommon || 0);
        return amount.lte(0) ? new Decimal(1) : Decimal.min(new Decimal(3), new Decimal(1).add(amount.times(0.05)));
    },
    getRareShardBoost() {
        let amount = new Decimal(player.r.runes.rare || 0);
        return amount.lte(0) ? new Decimal(1) : Decimal.min(new Decimal(7), new Decimal(1.01).add(amount.times(0.02)));
    },
    getRareBulkBoost() {
        let count = new Decimal(player.r.runes.rare || 0).toNumber();
        if (count >= 150) return 5;
        if (count >= 50) return 4;
        if (count >= 15) return 3;
        if (count >= 5) return 2;
        if (count >= 1) return 1;
        return 0;
    },
    getEpicShardBoost() {
        let amount = new Decimal(player.r.runes.epic || 0);
        return amount.lte(0) ? new Decimal(1) : Decimal.min(new Decimal(5.0), new Decimal(1.02).add(amount.sub(1).mul(0.02)));
    },
    getEpicLuckBoost() {
        let amount = new Decimal(player.r.runes.epic || 0);
        return amount.lte(0) ? new Decimal(1) : Decimal.min(new Decimal(2.5), new Decimal(1.10).add(amount.sub(1).mul(0.10)));
    },
    getEpicBulkBoost() {
    let amount = new Decimal(player.r.runes.epic || 0);
    return amount.lte(0) ? new Decimal(1) : Decimal.min(new Decimal(2.0), new Decimal(1.05).add(amount.sub(1).mul(0.05)));
    },
    getLegendaryShardBoost() {
    let amount = new Decimal(player.r.runes.legendary || 0);
    return amount.lte(0) ? new Decimal(1) : Decimal.min(new Decimal(7.5), new Decimal(1.10).add(amount.sub(1).mul(0.10)));
    },
    getLegendaryBulkBoost() {
    let amount = new Decimal(player.r.runes.legendary || 0);
    return amount.lte(0) ? new Decimal(1) : Decimal.min(new Decimal(5.0), new Decimal(1.08).add(amount.sub(1).mul(0.08)));
    },
    getLegendarySpeedBoost() {
    let amount = new Decimal(player.r.runes.legendary || 0);
    return amount.lte(0) ? new Decimal(1) : Decimal.min(new Decimal(1.6), new Decimal(1.06).add(amount.sub(1).mul(0.06)));
    },
    getMythicSkillsBoost() {
    let amount = new Decimal(player.r.runes.mythic || 0);
    return amount.lte(0) ? new Decimal(1) : Decimal.min(new Decimal(2.0),new Decimal(1.02).add(amount.sub(1).mul(0.02)));
    },
    getMythicLuckBoost() {
    let amount = new Decimal(player.r.runes.mythic || 0);
    return amount.lte(0) ? new Decimal(1) : Decimal.min(new Decimal(4.0), new Decimal(1.07).add(amount.sub(1).mul(0.07)));
    },
    getMythicBulkBoost() {
    let amount = new Decimal(player.r.runes.mythic || 0);
    return amount.lte(0) ? new Decimal(1) : Decimal.min(new Decimal(4.0), new Decimal(1.05).add(amount.sub(1).mul(0.05)));
    },
    getMythicSpeedBoost() {
    let amount = new Decimal(player.r.runes.mythic || 0);
    return amount.lte(0) ? new Decimal(1) : Decimal.min(new Decimal(1.5), new Decimal(1.03).add(amount.sub(1).mul(0.03)));
    },
    getDivineShardBoost(){
    let amount = new Decimal(player.r.runes.divine || 0);
    return amount.lte(0) ? new Decimal(1) : Decimal.min(new Decimal(10.0), new Decimal(1.03).add(amount.sub(1).mul(0.03)));
    },
    getDivineSkillsBoost(){
    let amount = new Decimal(player.r.runes.divine || 0);
    return amount.lte(0) ? new Decimal(1) : Decimal.min(new Decimal(2.0), new Decimal(1.002).add(amount.sub(1).mul(0.002)));
    },
    getDivineLuckBoost(){
    let amount = new Decimal(player.r.runes.divine || 0);
    return amount.lte(0) ? new Decimal(1) : Decimal.min(new Decimal(3.0), new Decimal(1.05).add(amount.sub(1).mul(0.05)));
    },
    getDivineBulkBoost(){
    let amount = new Decimal(player.r.runes.divine || 0);
    return amount.lte(0) ? new Decimal(1) : Decimal.min(new Decimal(4.0), new Decimal(1.02).add(amount.sub(1).mul(0.02)));
    },
    getSecretShardBoost(){
    let amount = new Decimal(player.r.runes.secret || 0);
    return amount.lte(0) ? new Decimal(1) : Decimal.min(new Decimal(7.5), new Decimal(1.015).add(amount.sub(1).mul(0.015)));
    },
    getSecretRPBoost(){
    let amount = new Decimal(player.r.runes.secret || 0);
    return amount.lte(0) ? new Decimal(1) : Decimal.min(new Decimal(5.0), new Decimal(1.01).add(amount.sub(1).mul(0.01)));
    },
    getSecretSkillsBoost(){
    let amount = new Decimal(player.r.runes.secret || 0);
    return amount.lte(0) ? new Decimal(1) : Decimal.min(new Decimal(2.5), new Decimal(1.005).add(amount.sub(1).mul(0.005)));
    },
    getSecretLuckBoost(){
    let amount = new Decimal(player.r.runes.secret || 0);
    return amount.lte(0) ? new Decimal(1) : Decimal.min(new Decimal(4.0), new Decimal(1.1).add(amount.sub(1).mul(0.1)));
    },
    getSecretBulkBoost(){
    let amount = new Decimal(player.r.runes.secret || 0);
    return amount.lte(0) ? new Decimal(1) : Decimal.min(new Decimal(3.0), new Decimal(1.025).add(amount.sub(1).mul(0.025)));
    },


  
    // --- SANİYELİK KAZANÇ VE STATS ---
    getShardGain() {
        let gain = new Decimal(1).add(this.getCommonBoost())
            .times(this.getUncommonBoost())
            .times(this.getRareShardBoost())
            .times(this.getEpicShardBoost())
            .times(this.getLegendaryShardBoost())
            .times(this.getDivineShardBoost())
            .times(this.getSecretShardBoost());
    
        if (hasUpgrade("rp", 12)) {
        gain = gain.times(layers.rp.upgrades[12].effect());
        }

      return gain;
    },
    update(diff) {
        player.r.points = player.r.points.add(layers.r.getShardGain().times(diff));
        let s = layers.r.getStats();
        player.r.rollTimer = Math.min(s.speed, (player.r.rollTimer || 0) + diff);
    },
    getStats() {
        let luck = new Decimal(1.5);
        if (this.getEpicLuckBoost) luck = luck.times(this.getEpicLuckBoost());
        if (hasAchievement('a', 14)) { luck = luck.times(1.75);}
        if (this.getMythicLuckBoost) luck = luck.times(this.getMythicLuckBoost());
        if (this.getDivineLuckBoost) luck = luck.times(this.getDivineLuckBoost());
        if (hasAchievement('a', 24)) { luck = luck.times(2);}
        if (this.getSecretLuckBoost) luck = luck.times(this.getSecretLuckBoost());
        if (hasAchievement('a', 25)) { luck = luck.times(1.5);}
      
        if (hasUpgrade("rp", 24)) {
        let boost = layers.rp.upgrades[24].effect ? layers.rp.upgrades[24].effect() : new Decimal(1);
        luck = luck.times(boost);}
        if (hasMilestone("rp", 1)) { luck = luck.times(1.5);}
        let bulk = new Decimal(1);
        if (this.getRareBulkBoost) bulk = bulk.add(this.getRareBulkBoost());
        if (this.getEpicBulkBoost) bulk = bulk.times(this.getEpicBulkBoost());
        if (hasAchievement('a', 13)) { bulk = bulk.times(1.5);}
        if (this.getLegendaryBulkBoost) bulk = bulk.times(this.getLegendaryBulkBoost());
        if (this.getMythicBulkBoost) bulk = bulk.times(this.getMythicBulkBoost());
        if (hasAchievement('a', 15)) { bulk = bulk.times(2.5);}
        if (this.getDivineBulkBoost) bulk = bulk.times(this.getDivineBulkBoost());
        if (hasAchievement('a', 24)) { bulk = bulk.times(2);}
        if (this.getSecretBulkBoost) bulk = bulk.times(this.getSecretBulkBoost());

        if (hasUpgrade("rp", 21)) {
        let boost = layers.rp.upgrades[21].effect ? layers.rp.upgrades[21].effect() : new Decimal(1);
        bulk = bulk.times(boost);}
        let speed = new Decimal(0.8);
        if (this.getLegendarySpeedBoost) {
        speed = speed.div(this.getLegendarySpeedBoost());}
        if (this.getMythicSpeedBoost) {
        speed = speed.div(this.getMythicSpeedBoost());}


        if (hasUpgrade("rp", 13)) {
        let boost = layers.rp.upgrades[13].effect ? layers.rp.upgrades[13].effect() : new Decimal(1.25);
        speed = speed.div(boost);
        }
        speed = Decimal.max(0.1, speed);
        let rps = new Decimal(1).div(speed).times(bulk);

        return { luck, bulk, speed, rps, clone: "Locked" };
    },
    getEffectiveBulk() {
        let rawBulk = layers.r.getStats().bulk.toNumber();
        let baseBulk = Math.floor(rawBulk);
        if ((rawBulk - baseBulk) > 0 && Math.random() < (rawBulk - baseBulk)) baseBulk += 1;
        return baseBulk;
    },

    // --- ROLL MEKANİĞİ ---
    rollRune(isManual = false) {
        if (!isManual) return;
        let baseCost = new Decimal(10);
        let currentShards = new Decimal(player.r.points);
        if (currentShards.lt(baseCost)) return;

        let targetBulk = new Decimal(layers.r.getEffectiveBulk());
        if (targetBulk.lte(0)) return;

        let actualRolls = Decimal.min(targetBulk, currentShards.div(baseCost).floor());
        if (actualRolls.lte(0)) return;

        player.r.points = player.r.points.sub(actualRolls.mul(baseCost));
        player.r.totalRollsBulk = player.r.totalRollsBulk.add(actualRolls);
        player.r.totalRollsNoBulk = player.r.totalRollsNoBulk.add(1);

        let currentLuck = layers.r.getStats().luck.toNumber();
        let epicChance = Math.min(0.10, 0.005 * currentLuck);
        let legendaryChance = Math.min(0.10, (1 / 2500) * currentLuck);
        let mythicChance = Math.min(0.10, (1 / 50000) * currentLuck);
        let divineChance = Math.min(0.10, (1 / 5e6) * currentLuck);
        let secretChance = Math.min(0.10, (1 / 1.25e9) * currentLuck);
      
        if (actualRolls.lte(1e6)) {
            let count = actualRolls.toNumber();
            let [secretCount, divineCount, mythicCount, legendaryCount, epicCount, rareCount, uncommonCount, commonCount] = [0, 0, 0, 0, 0, 0, 0, 0];

        for (let i = 0; i < count; i++) {
        let rand = Math.random();
        if (rand < secretChance) secretCount++;
        else if (rand < secretChance + divineChance) divineCount++;
        else if (rand < secretChance +divineChance + mythicChance) mythicCount++;
        else if (rand < secretChance +divineChance + mythicChance + legendaryChance) legendaryCount++;
        else if (rand < secretChance +divineChance + mythicChance + legendaryChance + epicChance) epicCount++;
        else if (rand < secretChance +divineChance + mythicChance + legendaryChance + epicChance + 0.05) rareCount++;
        else if (rand < secretChance +divineChance + mythicChance + legendaryChance + epicChance + 0.20) uncommonCount++;
        else commonCount++;
        }


    player.r.runes.secret = (player.r.runes.secret || new Decimal(0)).add(secretCount);
    player.r.runes.divine = (player.r.runes.divine || new Decimal(0)).add(divineCount);       
    player.r.runes.mythic = (player.r.runes.mythic || new Decimal(0)).add(mythicCount);
    player.r.runes.legendary = (player.r.runes.legendary || new Decimal(0)).add(legendaryCount);
    player.r.runes.epic = (player.r.runes.epic || new Decimal(0)).add(epicCount);
    player.r.runes.rare = (player.r.runes.rare || new Decimal(0)).add(rareCount);
    player.r.runes.uncommon = (player.r.runes.uncommon || new Decimal(0)).add(uncommonCount);
    player.r.runes.common = (player.r.runes.common || new Decimal(0)).add(commonCount);
} else {
    let estSecret = actualRolls.times(secretChance).floor();
    let estDivine = actualRolls.times(divineChance).floor();
    let estMythic = actualRolls.times(mythicChance).floor();
    let estLegendary = actualRolls.times(legendaryChance).floor();
    let estEpic = actualRolls.times(epicChance).floor();
    let estRare = actualRolls.times(0.05).floor();
    let estUncommon = actualRolls.times(0.15).floor();
    let estCommon = actualRolls.sub(estSecret).sub(estDivine).sub(estMythic).sub(estLegendary).sub(estEpic).sub(estRare).sub(estUncommon);

    player.r.runes.secret = (player.r.runes.secret || new Decimal(0)).add(estSecret);
    player.r.runes.divine = (player.r.runes.divine || new Decimal(0)).add(estDivine);
    player.r.runes.mythic = (player.r.runes.mythic || new Decimal(0)).add(estMythic);
    player.r.runes.legendary = (player.r.runes.legendary || new Decimal(0)).add(estLegendary);
    player.r.runes.epic = (player.r.runes.epic || new Decimal(0)).add(estEpic);
    player.r.runes.rare = (player.r.runes.rare || new Decimal(0)).add(estRare);
    player.r.runes.uncommon = (player.r.runes.uncommon || new Decimal(0)).add(estUncommon);
    player.r.runes.common = (player.r.runes.common || new Decimal(0)).add(estCommon);
        }
    },

  // --- BUTONLAR ---
    buyables: {
        11: {
            title: "",
            cost() {
                let s = layers.r.getStats();
                let actualRolls = Decimal.min(s.bulk, player.r.points.div(10).floor());
                return (actualRolls.gt(0) ? actualRolls : new Decimal(1)).mul(10);
            },
            display() {
                let s = layers.r.getStats();
                let actualRolls = Decimal.min(s.bulk, player.r.points.div(10).floor());
                let rollsToDisplay = actualRolls.gt(0) ? actualRolls : new Decimal(0);
                let canAfford = player.r.points.gte(10);
                let costColor = canAfford ? "#4caf50" : "#f44336";
                let progress = Math.min(100, ((player.r.rollTimer || 0) / s.speed) * 100);

                return `
                <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;width:100%;height:100%;position:relative;overflow:hidden;padding:0;margin:0;user-select:none;">
                    <div style="font-size:14px;font-weight:bold;color:#e0e0e0;">Roll Rune (+${formatWhole(rollsToDisplay)})</div>
                    <div style="font-size:10px;color:${costColor};font-weight:bold;margin-top:3px;">Cost: ${format(this.cost())} Shards</div>
                    <div style="font-size:9px;color:#888;margin-top:4px;">Speed: ${s.speed.toFixed(1)}s | Bulk: +${formatWhole(s.bulk)}</div>
                    <div style="position:absolute;bottom:0;left:0;height:3px;width:${progress}%;background-color:#14b8a6;"></div>
                </div>`;
            },
            canAfford() { return player.r.points.gte(10) && (player.r.rollTimer >= layers.r.getStats().speed); },
            buy() {
                if (this.canAfford()) {
                    layers.r.rollRune(true);
                    player.r.rollTimer = 0;
                }
            },
            style() {
                let canAfford = this.canAfford();
                return {
                    "background-color": "#121212",
                    "border": canAfford ? "2px solid #3a3a3a" : "2px solid #222222",
                    "box-shadow": canAfford ? "0 0 8px rgba(20, 184, 166, 0.15)" : "none",
                    "color": canAfford ? "#ffffff" : "#555555",
                    "border-radius": "8px",
                    "width": "190px",
                    "height": "125px !important",
                    "min-height": "125px !important",
                    "margin-bottom": "20px",
                    "font-family": "monospace",
                    "cursor": canAfford ? "pointer" : "not-allowed"
                };
            }
        }
    },

  // --- ARAYÜZ SEKMELERİ ---
    microtabs: {
        stuff: {
            "Basic Rune": {
                content: [
                    "blank",
                    ["display-text", () => `You have <h2 style='color: #14b8a6; text-shadow: 0 0 10px #14b8a6; display: inline;'>${format(player.r.points)}</h2> Rune Shard`],
                    ["display-text", () => `<span style='color: #ffffff; font-size: 12px;'>(+${format(layers.r.getShardGain())} Rune Shard/sec)</span>`],
                    "blank",
                    ["buyable", 11],
                    ["blank", "30px"],
                    ["display-text", function() {
                        // Common HTML
      let cAmt = new Decimal(player.r.runes.common || 0);
      let cBoost = layers.r.getCommonBoost();
      let cBoostHTML = cAmt.gt(0) 
    ? `<span style="color:#14b8a6;font-size:11px;font-weight:bold;">+${cBoost.toFixed(1)} Rune Shards${cBoost.gte(10) ? ' (MAX)' : ''}</span>`
    : `<span style="color:#666;font-size:11px;font-style:italic;">Discover to unlock!</span>`;

    let cRPBoostHTML = "";
    if (hasMilestone("rp", 0) && cAmt.gt(0)) {
    let rpBoost = layers.r.getCommonRPBoost();
    cRPBoostHTML = `<div style="margin-top:-38px;padding:0;line-height:1.2;"><span style="color:#10b981;font-size:11px;font-weight:bold;">x${rpBoost.toFixed(2)} RP${rpBoost.gte(3) ? ' (MAX)' : ''}</span></div>`;
    }
                        // Uncommon HTML
      let ucAmt = new Decimal(player.r.runes.uncommon || 0);
      let ucBoost = layers.r.getUncommonBoost();
      let ucBoostHTML = ucAmt.gt(0)
    ? `<span style="color:#14b8a6;font-size:11px;font-weight:bold;">x${ucBoost.toFixed(2)} Rune Shards${ucBoost.gte(3) ? ' (MAX)' : ''}</span>`
    : `<span style="color:#666;font-size:11px;font-style:italic;">Discover to unlock!</span>`;

                          // Rare HTML
      let rAmt = new Decimal(player.r.runes.rare || 0);
      let rSBoost = layers.r.getRareShardBoost();
      let rBBoost = layers.r.getRareBulkBoost();
      let rBoostHTML = rAmt.gt(0)
    ? `<div style="font-size:10px;line-height:1.3;">
    <div><span style="color:#14b8a6;font-weight:bold;">x${rSBoost.toFixed(2)} Rune Shards${rSBoost.gte(7) ? ' (MAX)' : ''}</span></div>
    <div style="margin-top:3px;"><span style="color:#1c73f1;font-weight:bold;">+${formatWhole(rBBoost)} Rune Bulk${rBBoost >= 5 ? ' (MAX)' : ''}</span></div>
                               </div>`
    : `<span style="color:#666;font-size:11px;font-style:italic;">Discover to unlock!</span>`;

                          // Epic HTML
      let eAmt = new Decimal(player.r.runes.epic || 0);
      let eSBoost = layers.r.getEpicShardBoost();
      let eLBoost = layers.r.getEpicLuckBoost();
      let eBBoost = layers.r.getEpicBulkBoost();
      let epicRatioText = "1 / " + Math.round(1 / Math.min(0.10, 0.005 * layers.r.getStats().luck.toNumber()));
      let eBoostHTML = eAmt.gt(0)
    ? `<div style="font-size:11px;line-height:1.4;">
    <div><span style="color:#14b8a6;font-weight:bold;">x${eSBoost.toFixed(2)} Rune Shards${eSBoost.gte(5) ? ' (MAX)' : ''}</span></div>
    <div style="margin-top:3px;"><span style="color:#4caf50;font-weight:bold;">x${eLBoost.toFixed(2)}
    Rune Luck${eLBoost.gte(2.5) ? ' (MAX)' : ''}</span></div>
    <div style="margin-top:3px;"><span style="color:#1c73f1;font-weight:bold;">x${eBBoost.toFixed(2)} Rune Bulk${eBBoost.gte(2.0) ? ' (MAX)' : ''}</span></div>
                               </div>`
    : `<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;color:#666;font-size:11px;font-style:italic;text-align:center;">Discover to unlock!</div>`;

                      //LEGENDARY HTML
      let lAmt = new Decimal(player.r.runes.legendary || 0);
      let lSBoost = layers.r.getLegendaryShardBoost();
      let lBBoost = layers.r.getLegendaryBulkBoost();
      let lSpBoost = layers.r.getLegendarySpeedBoost();
      let rawLegChance = Math.min(0.10, (1 / 2500) * layers.r.getStats().luck.toNumber());
      let legRatioText = rawLegChance >= 0.10 ? "1 / 10 " : "1 / " + formatWhole(Math.round(1 / rawLegChance));
      let lBoostHTML = lAmt.gt(0)
    ? `<div style="font-size:11px;line-height:1.4;">
            <div><span style="color:#14b8a6;font-weight:bold;">x${lSBoost.toFixed(2)} Rune Shards${lSBoost.gte(7.5) ? ' (MAX)' : ''}</span></div>
            <div style="margin-top:3px;"><span style="color:#1c73f1;font-weight:bold;">x${lBBoost.toFixed(2)} Rune Bulk${lBBoost.gte(5.0) ? ' (MAX)' : ''}</span></div>
            <div style="margin-top:3px;"><span style="color:#c94fff;font-weight:bold;">x${lSpBoost.toFixed(2)} Rune Speed${lSpBoost.gte(1.6) ? ' (MAX)' : ''}</span></div>
           </div>`
    : `<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;color:#666;font-size:11px;font-style:italic;text-align:center;">Discover to unlock!</div>`;

                      //MYTHIC HTML
      let mAmt = new Decimal(player.r.runes.mythic || 0);
      let mSkBoost = layers.r.getMythicSkillsBoost();
      let mLBoost = layers.r.getMythicLuckBoost();
      let mBBoost = layers.r.getMythicBulkBoost();
      let mSpBoost = layers.r.getMythicSpeedBoost();
      let rawMythicChance = Math.min(0.10, (1 / 50000) * layers.r.getStats().luck.toNumber());
      let mythicRatioText = rawMythicChance >= 0.10 ? "1 / 10 " : "1 / " + formatWhole(Math.round(1 / rawMythicChance));
      let mBoostHTML = mAmt.gt(0)
    ? `<div style="font-size:11px;line-height:1.4;">
            <div><span style="color:#ffffff;font-weight:bold;">x${mSkBoost.toFixed(2)} Skills${mSkBoost.gte(2.0) ? ' (MAX)' : ''}</span></div>
            <div style="margin-top:3px;"><span style="color:#4caf50;font-weight:bold;">x${mLBoost.toFixed(2)} Rune Luck${mLBoost.gte(4.0) ? ' (MAX)' : ''}</span></div>
            <div style="margin-top:3px;"><span style="color:#1c73f1;font-weight:bold;">x${mBBoost.toFixed(2)} Rune Bulk${mBBoost.gte(4.0) ? ' (MAX)' : ''}</span></div>
            <div style="margin-top:3px;"><span style="color:#c94fff;font-weight:bold;">x${mSpBoost.toFixed(2)} Rune Speed${mSpBoost.gte(1.5) ? ' (MAX)' : ''}</span></div>
       </div>`
    : `<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;color:#666;font-size:11px;font-style:italic;text-align:center;">Discover to unlock!</div>`;

                      //DIVINE HTML
let dAmt = new Decimal(player.r.runes.divine || 0);
let dShBoost = layers.r.getDivineShardBoost();
let dSkBoost = layers.r.getDivineSkillsBoost();
let dLBoost = layers.r.getDivineLuckBoost();
let dBBoost = layers.r.getDivineBulkBoost();

let rawDivineChance = Math.min(0.10, (1 / 5e6) * layers.r.getStats().luck.toNumber());
let divineRatioText = rawDivineChance >= 0.10 ? "1 / 10 " : "1 / " + formatWhole(Math.round(1 / rawDivineChance));

let dBoostHTML = dAmt.gt(0)
  ? `<div style="font-size:11px;line-height:1.4;">
        <div><span style="color:#14b8a6;font-weight:bold;">x${dShBoost.toFixed(2)} Rune Shards${dShBoost.gte(10.0) ? ' (MAX)' : ''}</span></div>
        <div style="margin-top:3px;"><span style="color:#ffffff;font-weight:bold;">x${dSkBoost.toFixed(2)} Skills${dSkBoost.gte(2.0) ? ' (MAX)' : ''}</span></div>
        <div style="margin-top:3px;"><span style="color:#4caf50;font-weight:bold;">x${dLBoost.toFixed(2)} Rune Luck${dLBoost.gte(3.0) ? ' (MAX)' : ''}</span></div>
        <div style="margin-top:3px;"><span style="color:#1c73f1;font-weight:bold;">x${dBBoost.toFixed(2)} Rune Bulk${dBBoost.gte(4.0) ? ' (MAX)' : ''}</span></div>
     </div>`
  : `<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;color:#666;font-size:11px;font-style:italic;text-align:center;">Discover to unlock!</div>`;

                      //SECRET HTML
let hasSecret = hasMilestone("rp", 2);
let sAmt = new Decimal(player.r.runes.secret || 0);
let sShBoost = layers.r.getSecretShardBoost();
let sRPBoost = layers.r.getSecretRPBoost();
let sSkBoost = layers.r.getSecretSkillsBoost();
let sLBoost = layers.r.getSecretLuckBoost();
let sBBoost = layers.r.getSecretBulkBoost();

let rawSecretChance = Math.min(0.10, (1 / 1.25e9) * layers.r.getStats().luck.toNumber());
let secretRatioText = rawSecretChance >= 0.10 ? "1 / 10" : "1 / " + formatWhole(Math.round(1 / rawSecretChance));

let sBoostHTML = sAmt.gt(0)
    ? `<div style="font-size:10px;line-height:1.3;">
        <div><span style="color:#14b8a6;font-weight:bold;">x${sShBoost.toFixed(2)} Rune Shards${sShBoost.gte(7.5) ? ' (MAX)' : ''}</span></div>
        <div style="margin-top:2px;"><span style="color:#10b981;font-weight:bold;">x${sRPBoost.toFixed(2)} RP${sRPBoost.gte(5.0) ? ' (MAX)' : ''}</span></div>
        <div style="margin-top:2px;"><span style="color:#ffffff;font-weight:bold;">x${sSkBoost.toFixed(2)} Skills${sSkBoost.gte(2.5) ? ' (MAX)' : ''}</span></div>
        <div style="margin-top:2px;"><span style="color:#4caf50;font-weight:bold;">x${sLBoost.toFixed(2)} Rune Luck${sLBoost.gte(4.0) ? ' (MAX)' : ''}</span></div>
        <div style="margin-top:2px;"><span style="color:#1c73f1;font-weight:bold;">x${sBBoost.toFixed(2)} Rune Bulk${sBBoost.gte(3.0) ? ' (MAX)' : ''}</span></div>
       </div>`
    : `<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;color:#666;font-size:11px;font-style:italic;text-align:center;">Discover to unlock!</div>`;

  
    return `
<div style="border:2px solid #14b8a6;box-shadow:0 0 12px rgba(20,184,166,0.3);background:#0d0d0d;border-radius:10px;width:95%;max-width:600px;margin:0 auto;padding:15px 10px;display:grid;grid-template-columns:repeat(4, 1fr);gap:12px;overflow-x:auto;justify-content:center;align-items:center;">
                                                                
                        <!-- COMMON -->
<div style="border:1.5px solid #9a9a9a;box-shadow:0 0 8px rgba(154,154,154,0.2);background:#0d0d0d;border-radius:12px;width:140px;min-height:190px;box-sizing:border-box;padding:12px 0 0 0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;font-family:monospace;flex-shrink:0;">
<div style="text-align:center;width:100%;border-bottom:2px solid #9a9a9a;padding-bottom:8px;">
<div style="color:#9a9a9a;font-weight:bold;font-size:14px;margin-bottom:2px;">Common Rune</div>
<div style="color:#9a9a9a;font-size:11px;">1 / 1.25</div>
                                </div>
<div style="width:100%;text-align:center;border-bottom:2px solid #9a9a9a;padding:4px 0;color:#9a9a9a;font-size:12px;">
Amount: <span style="font-weight:bold;color:#9a9a9a;">${formatWhole(cAmt)}</span>
               </div>
<div style="width:100%;flex-grow:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4px 0;">
        ${cBoostHTML}
        ${cRPBoostHTML}
    </div>
</div>
                       <!-- UNCOMMON -->
<div style="border:1.5px solid #00861a;box-shadow:0 0 8px rgba(0,134,26,0.2);background:#0d0d0d;border-radius:12px;width:140px;min-height:190px;box-sizing:border-box;padding:12px 0 0 0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;font-family:monospace;flex-shrink:0;">
<div style="text-align:center;width:100%;border-bottom:2px solid #00861a;padding-bottom:8px;">
<div style="color:#00861a;font-weight:bold;font-size:14px;margin-bottom:2px;">Uncommon Rune</div>
<div style="color:#00861a;font-size:11px;">1 / 6.67</div>
                                </div>
<div style="width:100%;text-align:center;border-bottom:2px solid #00861a;padding:4px 0;color:#00861a;font-size:12px;">
Amount: <span style="font-weight:bold;color:#00861a;">${formatWhole(ucAmt)}</span>
                                </div>
<div style="width:100%;flex-grow:1;display:flex;align-items:center;justify-content:center;padding:1px;">${ucBoostHTML}</div>
                            </div>

                          <!-- RARE -->
<div style="border:1.5px solid #00d2ff;box-shadow:0 0 8px rgba(0,210,255,0.25);background:#0d0d0d;border-radius:12px;width:140px;min-height:190px;box-sizing:border-box;padding:12px 0 0 0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;font-family:monospace;flex-shrink:0;">
<div style="text-align:center;width:100%;border-bottom:2px solid #00d2ff;padding-bottom:8px;">
<div style="color:#00d2ff;font-weight:bold;font-size:14px;margin-bottom:2px;">Rare Rune</div>
<div style="color:#00d2ff;font-size:11px;">1 / 20</div>
                                </div>
<div style="width:100%;text-align:center;border-bottom:2px solid #00d2ff;padding:4px 0;color:#00d2ff;font-size:12px;">
Amount: <span style="font-weight:bold;color:#00d2ff;">${formatWhole(rAmt)}</span>
                                </div>
<div style="width:100%;flex-grow:1;display:flex;align-items:center;justify-content:center;padding:1px;">${rBoostHTML}</div>
                            </div>
                         <!-- EPIC -->
<div style="border:1.5px solid #e056fd;box-shadow:0 0 8px #5b005f;background:#0d0d0d;border-radius:12px;width:140px;min-height:190px;box-sizing:border-box;padding:12px 0 0 0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;">
<div style="text-align:center;width:100%;border-bottom:2px solid #e056fd;padding-bottom:8px;">
<div style="color:#e056fd;font-weight:bold;font-size:14px;margin-bottom:2px;">Epic Rune</div>
<div style="color:#e056fd;font-size:11px;font-family:monospace;">${epicRatioText}</div>
                </div>
<div style="width:100%;text-align:center;border-bottom:2px solid #e056fd;padding:4px 0;color:#e056fd;font-size:12px;">
Amount: <span style="font-weight:bold;color:#e056fd;">${formatWhole(eAmt)}</span>
              </div>
<div style="width:100%;flex-grow:1;display:flex;align-items:center;justify-content:center;">${eBoostHTML}</div>
                            </div>
                    <!-- ROW 2 -->
<div style="grid-column: 1 / -1; width: 100%; display: flex; justify-content: center; margin-top: 4px;">
<div style="display: flex; gap: 12px; justify-content: center; align-items: center; width: auto; max-width: 100%;">
                    <!-- LEGENDARY -->
<div style="border:1.5px solid #d4af37;box-shadow:0 0 8px rgba(212,175,55,0.3);background:#0d0d0d;border-radius:12px;width:140px;min-height:190px;box-sizing:border-box;padding:12px 0 0 0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;font-family:monospace;flex-shrink:0;">
<div style="text-align:center;width:100%;border-bottom:2px solid #d4af37;padding-bottom:8px;">
<div style="color:#d4af37;font-weight:bold;font-size:14px;margin-bottom:2px;">Legendary Rune</div>
<div style="color:#d4af37;font-size:11px;">${legRatioText}</div>
      </div>
<div style="width:100%;text-align:center;border-bottom:2px solid #d4af37;padding:4px 0;color:#d4af37;font-size:12px;">
Amount: <span style="font-weight:bold;color:#d4af37;">${formatWhole(lAmt)}</span>
          </div>
<div style="width:100%;flex-grow:1;display:flex;align-items:center;justify-content:center;padding:1px;">${lBoostHTML}</div>
              </div>
                      <!-- MYTHIC -->
<div style="border:1.5px solid #990000;box-shadow:0 0 8px rgba(153,0,0,0.4);background:#0d0d0d;border-radius:12px;width:140px;min-height:190px;height:100%;box-sizing:border-box;padding:12px 0 0 0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;font-family:monospace;flex-shrink:0;">
<div style="text-align:center;width:100%;border-bottom:2px solid #990000;padding-bottom:8px;">
<div style="color:#ff3333;font-weight:bold;font-size:14px;margin-bottom:2px;">Mythic Rune</div>
<div style="color:#ff3333;font-size:11px;">${mythicRatioText}</div>
          </div>
<div style="width:100%;text-align:center;border-bottom:2px solid #990000;padding:4px 0;color:#ff3333;font-size:12px;">
Amount: <span style="font-weight:bold;color:#ff3333;">${formatWhole(mAmt)}</span>
            </div>
<div style="width:100%;flex-grow:1;display:flex;align-items:center;justify-content:center;padding:1px;min-height:90px;">${mBoostHTML}</div>
                </div>
                          <!-- DIVINE -->
<div style="border:1.5px solid #78ffdf;box-shadow:0 0 8px rgba(120,255,223,0.4);background:#0d0d0d;border-radius:12px;width:140px;min-height:190px;height:100%;box-sizing:border-box;padding:12px 0 0 0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;font-family:monospace;flex-shrink:0;">
  <div style="text-align:center;width:100%;border-bottom:2px solid #78ffdf;padding-bottom:8px;">
    <div style="color:#78ffdf;font-weight:bold;font-size:14px;margin-bottom:2px;">Divine Rune</div>
    <div style="color:#78ffdf;font-size:11px;">${divineRatioText}</div>
  </div>
  <div style="width:100%;text-align:center;border-bottom:2px solid #78ffdf;padding:4px 0;color:#78ffdf;font-size:12px;">
    Amount: <span style="font-weight:bold;color:#78ffdf;">${formatWhole(dAmt)}</span>
                </div>
  <div style="width:100%;flex-grow:1;display:flex;align-items:center;justify-content:center;padding:1px;min-height:90px;">${dBoostHTML}</div>
                </div>
                            <!-- SECRET -->
    ${hasSecret ? `
<div style="border:1.5px solid #d1d5db;box-shadow:0 0 10px rgba(209,213,219,0.35);background:#0d0d0d;border-radius:12px;width:140px;min-height:190px;height:100%;box-sizing:border-box;padding:12px 0 0 0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;font-family:monospace;flex-shrink:0;">
    <div style="text-align:center;width:100%;border-bottom:2px solid #d1d5db;padding-bottom:8px;">
        <div style="color:#e5e7eb;font-weight:bold;font-size:14px;margin-bottom:2px;">Secret Rune</div>
        <div style="color:#9ca3af;font-size:11px;">${secretRatioText}</div>
    </div>
    <div style="width:100%;text-align:center;border-bottom:2px solid #d1d5db;padding:4px 0;color:#e5e7eb;font-size:12px;">
        Amount: <span style="font-weight:bold;color:#ffffff;">${formatWhole(sAmt)}</span>
    </div>
    <div style="width:100%;flex-grow:1;display:flex;align-items:center;justify-content:center;padding:1px;min-height:90px;">
        ${sBoostHTML}
    </div>
</div>
` : ''}





                        </div>`;
                    }]
                ]
            },
            "Advanced Rune": {
                content: [
                    "blank",
                    ["display-text", () => `You have <h2 style='color: #14b8a6; text-shadow: 0 0 10px #14b8a6; display: inline;'>${format(player.r.points)}</h2> Rune Shard`],
                    ["display-text", () => `<span style='color: #ffffff; font-size: 12px;'>(+${format(layers.r.getShardGain())} Rune Shard/sec)</span>`],
                    "blank",
                    ["display-text", "--- Coming Soon! ---"]
                ]
            },
            "Stats": {
                content: [
                    "blank",
                    ["display-text", function() {
                        let s = layers.r.getStats();
                        return `
      <div style="border:2px solid #14b8a6;box-shadow:0 0 10px rgba(36,102,48,0.4);background:#0d0d0d;border-radius:8px;width:420px;margin:0 auto;padding:15px 0;color:#fff;font-family:monospace;">
      <h3 style="color:#14b8a6;margin:0 auto;padding-bottom:10px;display:block;width:100%;text-align:center !important;">RUNE STATS</h3>
      <div style="border-bottom:2px solid #14b8a6;width:100%;margin-bottom:15px;"></div>
      <div style="font-size:13px;line-height:2;text-align:left;padding:0 25px;">
      <div>• <b>Total Rune Opening:</b> <span style="color:#14b8a6;">${formatWhole(player.r.totalRollsBulk)}</span></div>
      <div>• <b>Total Rune Opening (No Bulk):</b> <span style="color:#888;">${formatWhole(player.r.totalRollsNoBulk)}</span></div>
      <div style="border-bottom:1px dashed #333;margin:8px 0;"></div>
      <div>• <b>Rune Luck:</b> <span style="color:#4caf50;">x${format(s.luck)}</span></div>
      <div>• <b>Rune Bulk:</b> <span style="color:#1c73f1;">+${formatWhole(s.bulk)}</span></div>
      <div>• <b>Rune Speed:</b> <span style="color:#c94fff;">${s.speed.toFixed(2)}s/roll</span></div>
      <div>• <b>Rune Clone:</b> <span style="color:#ff9800;">${s.clone}</span></div>
      <div style="border-bottom:1px dashed #333;margin:8px 0;"></div>
      <div>• <b>RPS (Runes/sec):</b> <span style="color:#14b8a6;font-weight:bold;font-size:14px;">${format(s.rps)}/s</span></div>
                            </div>
                        </div>`;
                    }]
                ]
            }
        }
    },
    tabFormat: [ ["microtabs", "stuff", { "border": "none" }] ]
});
