addLayer("r", {
    name: "Runes",
    symbol: "R", 
    position: 0, 
    
    startData() { return {
        unlocked: false, 
        points: new Decimal(0), // TMT'nin ana para birimi (Artık bizim Rune Shard'ımız)
        runeCooldown: new Decimal(0),
        commonRunes: new Decimal(0),
        uncommonRunes: new Decimal(0),
        rareRunes: new Decimal(0),
        epicRunes: new Decimal(0),
    }},
    
    color: "#3d3d3d", 

    nodeStyle() {
        return {
            background: "linear-gradient(135deg, #000000 0%, #ffffff 100%)",
            color: "#3d3d3d",
            "border-color": "#272727"
        }
    },
    
    requires: new Decimal(80000), // 80k Energy
    resource: "Rune Shards", // Katmanın ana para birimi adı olarak görünecek
    baseResource: "Energy", 
    baseAmount() { return player.e.points }, 
    
    type: "none", 
    row: "side",  

    clickables: {
    11: {
        title: "Basic Rune", // Senin güncel başlığın
        display() {
            // Başlık ile Cooldown arasında duracak maliyet yazısı
            let costText = "<span style='color: #131313;'>Cost: 1 Rune Shards</span><br>";
            let cooldownText = "";
            
            if (player.r.runeCooldown.gt(0)) {
                cooldownText = `<span style='color: #7e7e7e;'>Cooldown: ${player.r.runeCooldown.toFixed(1)}s</span>`;
            } else {
                cooldownText = "<span style='color: #d8d8d8;'>Click to get Rune!</span>"; // Senin güncel yazın
            } // Cooldown yazı:#ff5555 Güncel yazı:#55ff55;
            
            return costText + cooldownText;
        },
        style() {
            // Hem cooldown bitmiş olmalı hem de en az 2 Rune Shard (points) olmalı ki buton aktif görünsün
            let isReady = player.r.runeCooldown.lte(0) && player.r.points.gte(1);
            return {
                "background-color": isReady ? "#3d3d3d" : "#242424",
                "color": isReady ? "#ffffff" : "#888888",
                "border": "2px solid #555555",
                "border-radius": "10px",   // Senin güncel tasarımın
                "min-height": "110px",     // Senin güncel tasarımın
                "min-width": "200px",      // Senin güncel tasarımın
                "cursor": isReady ? "pointer" : "not-allowed",
            }
        },
        canClick() {
            // Sadece bekleme süresi bittiyse VE en az 2 Rune Shard'ı varsa tıklanabilir
            return player.r.runeCooldown.lte(0) && player.r.points.gte(1);
        },
        onClick() {
            // 1. Maliyeti düş ve 1 saniyelik Cooldown'ı başlat
            player.r.points = player.r.points.sub(1);
            player.r.runeCooldown = new Decimal(1);
            
            // 2. RNG ŞANS MOTORU (%60, %35, %4, %1)
            let roll = Math.random() * 100;
            
            if (roll < 1) { 
                // %1 ihtimal -> Epic (0 ile 1 arası)
                player.r.epicRunes = player.r.epicRunes.add(1);
            } else if (roll < 5) { 
                // %4 ihtimal -> Rare (1 ile 5 arası)
                player.r.rareRunes = player.r.rareRunes.add(1);
            } else if (roll < 40) { 
                // %35 ihtimal -> Uncommon (5 ile 40 arası)
                player.r.uncommonRunes = player.r.uncommonRunes.add(1);
            } else { 
                // %60 ihtimal -> Common (40 ile 100 arası)
                player.r.commonRunes = player.r.commonRunes.add(1);
            }
        },
    },
},




    layout: [
        "main-display",
        "blank",
        "clickables",
        "blank",
        // --- YAN YANA DURACAK GÖRSEL BUTONLARIN SATIRI ---
        ["display-text", function() {
    // --- BOOST FORMÜLLERİNLENMESİ (Yazıların en üstünde hesaplanıyor) ---
    let commonBoost = player.r.commonRunes.mul(0.004).add(1);
    let uncommonBoost = player.r.uncommonRunes.mul(0.005).add(1);
    let rarePointsBoost = player.r.rareRunes.mul(0.02).add(1);
    let rareEnergyBoost = player.r.rareRunes.mul(0.01).add(1);

    return `
        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 5px;">
            <div style="background-color: #494949; color: #000000; border: 1px solid #ffffff; padding: 8px 0px; border-radius: 8px; font-size: 13px; font-weight: bold; min-width: 110px; text-align: center; min-height: 115px;">
                <div style="padding: 0 10px;">Common Rune(%60)</div>
                <div style="color: #c2c2c2; font-size: 14px; margin-top: 3px;">Amount: ${formatWhole(player.r.commonRunes)}</div>
                <hr style="border: 0; border-top: 1px solid #ffffff; margin: 5px 0 0 0; width: 100%;">
                <div style="color: #cccccc; font-size: 11px; margin-top: 8px; padding: 0 5px; font-weight: normal;">
                    Points: x${format(commonBoost, 3)}
                </div>
            </div>
            
            <div style="background-color: #223f1b; color: #55ff55; border: 1px solid #ffffff; padding: 8px 0px; border-radius: 8px; font-size: 13px; font-weight: bold; min-width: 110px; text-align: center; min-height: 115px;">
                <div style="padding: 0 10px;">Uncommon Rune(%35)</div>
                <div style="color: #82fc82; font-size: 14px; margin-top: 3px;">Amount: ${formatWhole(player.r.uncommonRunes)}</div>
                <hr style="border: 0; border-top: 1px solid #ffffff; margin: 5px 0 0 0; width: 100%;">
                <div style="color: #cccccc; font-size: 11px; margin-top: 8px; padding: 0 5px; font-weight: normal;">
                    Energy: x${format(uncommonBoost, 3)}
                </div>
            </div>
            
            <div style="background-color: #1e1e57; color: #5555ff; border: 1px solid #ffffff; padding: 8px 0px; border-radius: 8px; font-size: 13px; font-weight: bold; min-width: 110px; text-align: center; min-height: 115px;">
                <div style="padding: 0 10px;">Rare Rune(%4)</div>
                <div style="color: #8181ff; font-size: 14px; margin-top: 3px;">Amount: ${formatWhole(player.r.rareRunes)}</div>
                <hr style="border: 0; border-top: 1px solid #ffffff; margin: 5px 0 0 0; width: 100%;">
                <div style="color: #cccccc; font-size: 11px; margin-top: 6px; padding: 0 5px; font-weight: normal; text-align: left; padding-left: 10px;">
                    Points: x${format(rarePointsBoost, 2)}<br>
                    Energy: x${format(rareEnergyBoost, 2)}
                </div>
            </div>
            
            <div style="background-color: #481968; color: #b13dff; border: 1px solid #ffffff; padding: 8px 0px; border-radius: 8px; font-size: 13px; font-weight: bold; min-width: 110px; text-align: center; min-height: 115px;">
                <div style="padding: 0 10px;">Epic Rune(%1)</div>
                <div style="color: #cc80ff; font-size: 14px; margin-top: 3px;">Amount: ${formatWhole(player.r.epicRunes)}</div>
                <hr style="border: 0; border-top: 1px solid #ffffff; margin: 5px 0 0 0; width: 100%;">
                <div style="color: #8aa4be; font-size: 11px; margin-top: 8px; padding: 0 5px; font-weight: normal; font-style: italic;">
                    No Boost Yet
                </div>
            </div>
        </div>
    `;
}],
        "upgrades"
    ],

    tabFormat: {
        "Main": {
            content: [
                "main-display", // Burada otomatik olarak "You have X Rune Shards" yazacak
                "blank",
                "clickables",
                "blank",
                // --- All Rune Names ---
                ["display-text", function() {
    // --- BOOST FORMÜLLERİNLENMESİ (Yazıların en üstünde hesaplanıyor) ---
    let commonBoost = player.r.commonRunes.mul(0.004).add(1);
    let uncommonBoost = player.r.uncommonRunes.mul(0.005).add(1);
    let rarePointsBoost = player.r.rareRunes.mul(0.02).add(1);
    let rareEnergyBoost = player.r.rareRunes.mul(0.01).add(1);

    return `
        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 5px;">
            <div style="background-color: #494949; color: #000000; border: 1px solid #ffffff; padding: 8px 0px; border-radius: 8px; font-size: 13px; font-weight: bold; min-width: 110px; text-align: center; min-height: 115px;">
                <div style="padding: 0 10px;">Common Rune(%60)</div>
                <div style="color: #c2c2c2; font-size: 14px; margin-top: 3px;">Amount: ${formatWhole(player.r.commonRunes)}</div>
                <hr style="border: 0; border-top: 1px solid #ffffff; margin: 5px 0 0 0; width: 100%;">
                <div style="color: #cccccc; font-size: 11px; margin-top: 8px; padding: 0 5px; font-weight: normal;">
                    Points: x${format(commonBoost, 3)}
                </div>
            </div>
            
            <div style="background-color: #223f1b; color: #55ff55; border: 1px solid #ffffff; padding: 8px 0px; border-radius: 8px; font-size: 13px; font-weight: bold; min-width: 110px; text-align: center; min-height: 115px;">
                <div style="padding: 0 10px;">Uncommon Rune(%35)</div>
                <div style="color: #82fc82; font-size: 14px; margin-top: 3px;">Amount: ${formatWhole(player.r.uncommonRunes)}</div>
                <hr style="border: 0; border-top: 1px solid #ffffff; margin: 5px 0 0 0; width: 100%;">
                <div style="color: #cccccc; font-size: 11px; margin-top: 8px; padding: 0 5px; font-weight: normal;">
                    Energy: x${format(uncommonBoost, 3)}
                </div>
            </div>
            
            <div style="background-color: #1e1e57; color: #5555ff; border: 1px solid #ffffff; padding: 8px 0px; border-radius: 8px; font-size: 13px; font-weight: bold; min-width: 130px; text-align: center; min-height: 115px;">
                <div style="padding: 0 10px;">Rare Rune(%4)</div>
                <div style="color: #8181ff; font-size: 14px; margin-top: 3px;">Amount: ${formatWhole(player.r.rareRunes)}</div>
                <hr style="border: 0; border-top: 1px solid #ffffff; margin: 5px 0 0 0; width: 100%;">
                <div style="color: #cccccc; font-size: 11px; margin-top: 6px; padding: 0 5px; font-weight: normal; text-align: center;">
                    Points: x${format(rarePointsBoost, 2)}<br>
                    Energy: x${format(rareEnergyBoost, 2)}
                </div>
            </div>
            
            <div style="background-color: #481968; color: #b13dff; border: 1px solid #ffffff; padding: 8px 0px; border-radius: 8px; font-size: 13px; font-weight: bold; min-width: 110px; text-align: center; min-height: 115px;">
                <div style="padding: 0 10px;">Epic Rune(%1)</div>
                <div style="color: #cc80ff; font-size: 14px; margin-top: 3px;">Amount: ${formatWhole(player.r.epicRunes)}</div>
                <hr style="border: 0; border-top: 1px solid #ffffff; margin: 5px 0 0 0; width: 100%;">
                <div style="color: #8aa4be; font-size: 11px; margin-top: 8px; padding: 0 5px; font-weight: normal; font-style: italic;">
                    There is nothing here?
                </div>
            </div>
        </div>
    `;
}],
                "upgrades",
            ]
        },
        "Stats": {
            content: [
                "main-display",
                "blank",
                ["display-text", function() {
                    return `
                        <div style="
                            border: 2px solid #ffffff !important; 
                            padding: 20px !important; 
                            border-radius: 6px !important; 
                            background-color: rgba(0, 0, 0, 0.5) !important; 
                            min-width: 320px !important; 
                            display: inline-block !important; 
                            text-align: left !important;
                        ">
                            <h3 style="margin-top: 0; text-align: center; color: #ffffff !important;">Rune Statistics</h3>
                            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.3); margin-bottom: 15px;">
                            
                            <span style="color: #bbbbbb; display: block; text-align: center;">Coming Soon!</span>
                        </div>
                    `;
                }],
            ]
        }
    },

    microtabs: {
        stuff:{
            "Main": {
                Upgrades: {
                    content: ["upgrades"]
                }
            },
            "Stats": {
                content: [""]
            }
        }
    },

    getPointGen() {
    if (!canGenPoints()) return new Decimal(0)
    let gain = new Decimal(1) // Temel kazanım hızı

    // --- ENERJİ UPGRADE 22 ÇARPANI ---
    // Eğer enerji katmanında ('e') 22 numaralı upgrade alınmışsa kazanımı 2 ile çarp
    if (hasUpgrade('e', 22)) { gain = gain.mul(2);}

    return gain;
    },



    layerShown() { 
        return player.t.points.gte(3); 
    },

    // --- ARTIK DOĞRUDAN ANA PARA BİRİMİNİ ARTIRAN MOTOR ---
    update(diff) {
        if (player.t.points.gte(3) && player.e.points.gte(80000)) {
            player.r.unlocked = true;
        }

        // Katman açıldıktan sonra doğrudan ana puanı (points) saniyede 0.05 artırır
        if (player.r.unlocked) {
            let gain = new Decimal(0.05).mul(new Decimal(diff));
            player.r.points = Decimal.add(player.r.points, gain);
        
            if (player.r.runeCooldown.gt(0)) {
            player.r.runeCooldown = player.r.runeCooldown.sub(diff).max(0); // 0'ın altına düşmesini engeller
            }
        }
    }
})
addLayer("t", {
    name: "Tier", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        
    }},
    color: "#d3d3d3",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Tier", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1,// Prestige currency exponent
    doReset(resettingLayer) {},

    getNextAt() {
        let level = player.t.points.toNumber(); // Mevcut Tier seviyen

        if (level === 0) return new Decimal(10);   // Tier 0 -> 1 
        if (level === 1) return new Decimal(90);   // Tier 1 -> 2 
        if (level === 2) return new Decimal(1e5);  // Tier 2 -> 3 
        if (level === 3) return new Decimal(Infinity); // Tier 3 -> 4 Cost: 1e9
        
        return new Decimal(1e9);
    },

    onPrestige(pointsGained) {
    // 1. Ana Puanları (Points) sıfırla
    player.points = new Decimal(0);

    // 2. Energy katmanının biriken puanlarını sıfırla
    player.e.points = new Decimal(0);

    // 4. Energy katmanındaki tüm upgrade satın alımlarını temizle
    // player.e.upgrades dizisindeki tüm ID'leri sıfırlıyoruz
    player.e.upgrades = [];
    
    // NOT: Eğer TMT'nin kendi otomatik sıfırlama sistemini de arkadan tetiklemek istersen
    // itg (row resets) kuralları geçerlidir ama bu el ile yazım en kesin ve hatasız çözümdür.
    },
    
    milestones: {
        0: {
            requirementDescription: "1 Tier",
            effectDescription: "x3 Point Gain!",
            done() {return player.t.points.gte(1)}
        },
        1: {
            requirementDescription: "2 Tier",
            effectDescription: "x3⭢x5 Points!<br>Unlock New Layer!(Need 100 Points!)",
            done() {return player.t.points.gte(2)},
            unlocked() {return hasMilestone("t", 0)},
        },
        2: {
            requirementDescription: "3 Tier",
            effectDescription: "x5⭢x25 Points!<br>x1⭢x2.5 Energy!<br>More energy upg!<br>Unlock Secret Layer!",
            done() {return player.t.points.gte(3)},
            unlocked() {return hasMilestone("t", 1)},
        },
        3: {
            requirementDescription: "4 Tier",
            effectDescription: "Soon?",
            done() {return player.t.points.gte(4)},
            unlocked() {return hasMilestone("t", 2)},
        },
    },


    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "t", description: "T: Reset for Tier Up", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
    }),
addLayer("e", {
    name: "Energy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "rgb(255, 233, 34)",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "Energy", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0, // Prestige currency exponent
    branches: ["t"],
    
    

    upgrades:{
        11: {
        title: "First Upg!",
        description: "+1 Base Energy",
        cost: new Decimal(25),
        //effect() { return new Decimal(1) },
        },
        12: {
        title: "Useless points?",
        description: "x2.5 Points",
        cost: new Decimal(75),
        //effect() { return new Decimal(1) },
        unlocked() { return hasUpgrade("e", 11) }
        },
        13: {
        title: "Need more energy!",
        description: "x3 Energy",
        cost: new Decimal(150),
        //effect() { return new Decimal(3) },
        unlocked() { return hasUpgrade("e", 12) }
        },
        14: {
        title: "More boost more funny!",
        description: "Points boost energy gain!",
        cost: new Decimal(1000),
        effect() {
            return player.points.add(1).pow(0.1777).min(100)},
            effectDisplay() { return "x" + format(this.effect()) },
        unlocked() { return hasUpgrade("e", 13) }
        },
        15: {
        title: "Go new tier!",
        description: "Energy boost points gain!<br>Max:x50",
        cost: new Decimal(10000),
        effect() { 
            return player.e.points.add(1).pow(0.355).min(50);},
            effectDisplay() { return "x" + format(this.effect()) },
        unlocked() { return hasUpgrade("e", 14) }
        },
        21: {
        title: "More more!!!",
        description: "x5 Energy",
        cost: new Decimal(1e5),
        //effect() { return new Decimal(3) },
        unlocked() {return hasMilestone("t", 2) && hasUpgrade("e", 15);}
        },
        22: {
        title: "What, what is Rune?",
        description: "x2 Rune Shard Gain!<br>Special:x2.5 Energy!",
        cost: new Decimal(1e6),
        //effect() { return new Decimal(3) },
        unlocked() { return hasUpgrade("e", 21) }
        },
        23: {
        title: "More Useless!",
        description: "x5.55 Points Gain!",
        cost: new Decimal(1.75e7),
        //effect() { return new Decimal(3) },
        unlocked() { return hasUpgrade("e", 22) }
        },
        24: {
        title: "Wow!",
        description: "Energy upg bought boost energy and Points!",
        cost: new Decimal(3.5e7),
        effect() {
            let count = player.e.upgrades.length;
            return new Decimal(1).add(new Decimal(count).mul(0.35));
        },
        effectDisplay() { return `x${format(upgradeEffect('e', 24))}`;},
        unlocked() { return hasUpgrade("e", 23) }
        },
        25: {
        title: "Need more more points!",
        description: "Energy boost points but inf!",
        cost: new Decimal(1.5e8),
        effect() { 
            return player.e.points.add(1).pow(0.147).min(1.8e308);},
            effectDisplay() { return "x" + format(this.effect()) },
        unlocked() { return hasUpgrade("e", 24) }
        },




    },


    
    
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (player.r.unlocked) {
        // Uncommon Rune Boost: miktar * 0.005 + 1
        let uncommonBoost = player.r.uncommonRunes.mul(0.005).add(1);
        mult = mult.mul(uncommonBoost);

        // Rare Rune Energy Boost: miktar * 0.01 + 1
        let rareEnergyBoost = player.r.rareRunes.mul(0.01).add(1);
        mult = mult.mul(rareEnergyBoost);}

        return mult
    },
    
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    
    row: 1, // Row the layer is in on the tree (0 is the first row)
    
    layerShown() { return player.t.points.gte(2);},
    update(diff) {
        // 1. Kilit Açma Şartı: Oyuncu hayatında bir kez Tier 2 ve 100 Point'e ulaştıysa katman görünür kalır
        if (player.t.points.gte(2) && player.points.gte(100)) {
            player.e.unlocked = true;
        }

        // 2. ÜRETİM ŞARTI (HER AN KONTROL EDİLİR): 
        // Oyuncu Tier 2 veya üstündeyse VE anlık Point miktarı 100 veya üzerindeyse...
        if (player.t.points.gte(2) && player.points.gte(100)) {
            let energyGainPerSecond = new Decimal(1); // Saniyede 1 Energy
            if (hasUpgrade("e", 11)) {energyGainPerSecond = energyGainPerSecond.add(1);}

            
            let energyMultiplier = new Decimal(1); // Başlangıç çarpanı: 1
            if (hasUpgrade("e", 13)) { energyMultiplier = energyMultiplier.mul(3);}
            if (hasUpgrade("e", 14)) { let boostEffect = upgradeEffect("e", 14); energyMultiplier = energyMultiplier.mul(boostEffect);}
            if (player.t.points.gte(3)) {energyMultiplier = energyMultiplier.mul(2.5);}
            if (hasUpgrade("e", 21)) { energyMultiplier = energyMultiplier.mul(5);}
            if (hasUpgrade("e", 22)) { energyMultiplier = energyMultiplier.mul(2.5);} //Rune after delete!
            if (hasUpgrade('e', 24)) {mult = mult.mul(upgradeEffect('e', 24));}



            // Üretimi ekle
            let totalGain = energyGainPerSecond.mul(energyMultiplier);
            player.e.points = player.e.points.add(totalGain.mul(diff));
        } else {
            // Eğer üstteki şart sağlanmıyorsa (Örn: Point 100'ün altına düştüyse)
            // Hiçbir şey yapma, üretim otomatik olarak durur (0 kazanım).
        }
    },
})
