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
        legendaryRunes: new Decimal(0),
        mythicRunes: new Decimal(0),
        

    }},
    
    color: "#3d3d3d", 

    nodeStyle() {
        return {
            background: "linear-gradient(135deg, #000000 0%, #ffffff 100%)",
            color: "#3d3d3d",
            "border-color": "#272727"
        }
    },
    
    requires: new Decimal(50000), // 50k Energy
    resource: "Rune Shards", // Katmanın ana para birimi adı olarak görünecek
    baseResource: "Energy", 
    baseAmount() { return player.e.points }, 
    
    type: "none", 
    row: "side",

    doReset(resettingLayer) {
        // Eğer rün katmanını sıfırlamaya çalışan katman kendisi değilse, sıfırlamayı engelle!
        // Bu sayede Quantum ('q') veya başka bir katman reset attığında rün katmanına dokunamayacak.
        return; 
    },

    // İşi garantiye almak için: Üst katmanlar reset attığında rün puanlarını (points) korur
    keepOnReset: true,

    clickables: {
    11: {
        title: "Basic Rune", 
        display() {
            let bulk = (player.r && player.r.rareRunes && player.r.rareRunes.gte(50)) ? 2 : 1;
            
            // Başlık ile Cooldown arasında duracak maliyet yazısı
            let costText = `<span style='color: #131313;'>Cost: ${formatWhole(bulk * 1)} Rune Shards</span><br>`;
            let cooldownText = "";
            
            if (player.r.runeCooldown.gt(0)) {
                cooldownText = `<span style='color: #7e7e7e;'>Cooldown: ${player.r.runeCooldown.toFixed(1)}s</span>`;
            } else {
                cooldownText = "<span style='color: #d8d8d8;'>Click to get Rune!</span>"; 
            } 
            
            return costText + cooldownText;
        },
        style() {
            let bulk = (player.r && player.r.rareRunes && player.r.rareRunes.gte(50)) ? 2 : 1;
            let currentCost = bulk * 1;

            let isReady = player.r.runeCooldown.lte(0) && player.r.points.gte(currentCost);
            return {
                "background-color": isReady ? "#3d3d3d" : "#242424",
                "color": isReady ? "#ffffff" : "#888888",
                "border": "2px solid #555555",
                "border-radius": "10px",   
                "min-height": "110px",     
                "min-width": "200px",      
                "cursor": isReady ? "pointer" : "not-allowed",
            }
        },
        canClick() {
            let bulk = (player.r && player.r.rareRunes && player.r.rareRunes.gte(50)) ? 2 : 1;
            let currentCost = bulk * 1;

            return player.r.runeCooldown.lte(0) && player.r.points.gte(currentCost);
        },
        onClick() {
            let bulk = (player.r && player.r.rareRunes && player.r.rareRunes.gte(50)) ? 2 : 1;
            let currentCost = bulk * 1;

            // 1. Dinamik maliyeti düş ve 1 saniyelik Cooldown'ı başlat
            player.r.points = player.r.points.sub(currentCost);
            player.r.runeCooldown = new Decimal(1);
            
            // 2. GERÇEK BULK ROLL MOTORU
            // Eğer bulk 2 ise bu döngü arkada 2 kez dönecek ve 2 bağımsız zar atacak!
            for (let i = 0; i < bulk; i++) {
                let roll = Math.random() * 100;
                
                if (roll < 0.05) { 
                    // %0.05 ihtimal -> Legendary Rune (0 ile 0.05 arası)
                    if (!player.r.legendaryRunes) player.r.legendaryRunes = new Decimal(0);
                    player.r.legendaryRunes = player.r.legendaryRunes.add(1);
                } else if (roll < 1.05) { 
                    // %1 ihtimal -> Epic Rune (0.05 ile 1.05 arası -> Fark: 1)
                    player.r.epicRunes = player.r.epicRunes.add(1);
                } else if (roll < 5.05) { 
                    // %4 ihtimal -> Rare Rune (1.05 ile 5.05 arası -> Fark: 4)
                    player.r.rareRunes = player.r.rareRunes.add(1);
                } else if (roll < 40.05) { 
                    // %35 ihtimal -> Uncommon Rune (5.05 ile 40.05 arası -> Fark: 35)
                    player.r.uncommonRunes = player.r.uncommonRunes.add(1);
                } else { 
                    // %59.95 ihtimal -> Common Rune (40.05 ile 100 arası -> Fark: 59.95)
                    player.r.commonRunes = player.r.commonRunes.add(1);
                }
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
    let commonBoost = player.r.commonRunes.mul(0.004).add(1).min(Infinity);
    let uncommonBoost = player.r.uncommonRunes.mul(0.005).add(1);
    let qSecretBoost = new Decimal(1).add(player.r.uncommonRunes.mul(0.002));
    let rarePointsBoost = player.r.rareRunes.mul(0.02).add(1);
    let rareEnergyBoost = player.r.rareRunes.mul(0.015).add(1);
    let epicPointsBoost  = player.r.epicRunes.mul(0.05).add(1);
    let epicQuantumBoost = player.r.epicRunes.mul(0.08).add(1);
    let epicPlasmaBoost  = player.r.epicRunes.mul(0.10).add(1);


    let bulkLine = "";
    if (player.r.rareRunes && player.r.rareRunes.gte(50)) {
        // Artık div(50).floor() yerine, 50 ve üzeri olduğu için direkt sabit 1 basıyoruz
        bulkLine = `<br>Rune Bulk: +1`;
    }

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

                ${hasUpgrade('q', 14) ? `
                <div style="color: #cccccc; font-size: 11px; margin-top: 0px; padding: 0 5px; font-weight: normal;">
                Quantum: x${format(qSecretBoost, 3)}
            </div>
                ` : ''}
            </div>
            
            <div style="background-color: #1e1e57; color: #5555ff; border: 1px solid #ffffff; padding: 8px 0px; border-radius: 8px; font-size: 13px; font-weight: bold; min-width: 130px; text-align: center; min-height: 115px;">
                <div style="padding: 0 10px;">Rare Rune(%4)</div>
                <div style="color: #8181ff; font-size: 14px; margin-top: 3px;">Amount: ${formatWhole(player.r.rareRunes)}</div>
                <hr style="border: 0; border-top: 1px solid #ffffff; margin: 5px 0 0 0; width: 100%;">
                <div style="color: #cccccc; font-size: 11px; margin-top: 6px; padding: 0 5px; font-weight: normal; text-align: center;">
                    Points: x${format(rarePointsBoost, 2)}<br>
                    Energy: x${format(rareEnergyBoost, 2)}${bulkLine}
                </div>
            </div>
            
            <div style="background-color: #481968; color: #b13dff; border: 1px solid #ffffff; padding: 8px 0px; border-radius: 8px; font-size: 13px; font-weight: bold; min-width: 110px; text-align: center; min-height: 115px;">
                <div style="padding: 0 10px;">Epic Rune(%1)</div>
                <div style="color: #cc80ff; font-size: 14px; margin-top: 3px;">Amount: ${formatWhole(player.r.epicRunes)}</div>
                <hr style="border: 0; border-top: 1px solid #ffffff; margin: 5px 0 0 0; width: 100%;">
                <div style="color: #cccccc; font-size: 11px; margin-top: 8px; padding: 0 5px; font-weight: normal; text-align: center;">

                ${!( (player.tier && player.tier.gte(5)) || (player.t && player.t.points && player.t.points.gte(5)) ) ? `
                Unlock after 5 Tier!
                ` : `
                Points: x${format(epicPointsBoost, 2)}<br>
                Quantum: x${format(epicQuantumBoost, 2)}<br>
                Plasma: x${format(epicPlasmaBoost, 2)}
            `}
                </div>
            </div>

            <div style="background-color: #5c3d00; color: #ffb700; border: 1px solid #ffffff; padding: 8px 0px; border-radius: 8px; font-size: 11px; font-weight: bold; min-width: 110px; text-align: center; min-height: 115px;">
                <div style="padding: 0 10px;">Legendary Rune(%0.05)</div>
                <div style="color: #ffd271; font-size: 14px; margin-top: 3px;">Amount: ${player.r.legendaryRunes ? formatWhole(player.r.legendaryRunes) : "0"}</div>
                <hr style="border: 0; border-top: 1px solid #ffffff; margin: 5px 0 0 0; width: 100%;">
                <div style="color: #cccccc; font-size: 11px; margin-top: 8px; padding: 0 5px; font-weight: normal; text-align: center;">
                Unlock after 7 Tier!
                </div>
            </div>
        </div>
    `;
}], // epicrune: font-style: italic; // <div style="color: #031a00; font-size: 11px; margin-top: 0px; padding: 0 5px; font-weight: normal;">
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
    if (hasMilestone('p', 1)) { gain = gain.mul(1.5);}


    return gain;
    },



    layerShown() { 
        return player.t.points.gte(3); 
    },

    // --- ARTIK DOĞRUDAN ANA PARA BİRİMİNİ ARTIRAN MOTOR ---
    update(diff) {
        if (player.t.points.gte(3) && player.e.points.gte(50000)) {
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
        if (level === 3) return new Decimal(1e9); // Tier 3 -> 4
        if (level === 4) return new Decimal(8e11);  // Tier 4 -> 5
        if (level === 5) return new Decimal(5e15); // Tier 5 -> 6 
        if (level === 6) return new Decimal(Infinity); // Tier 6 -> 7 (v0.2)
        
        
        
        return new Decimal(Infinity);
    },

    onPrestige(layer) {
    // 1. Enerji katmanının ve ana puanların düzgün çalışan reset motoru
    player.points = new Decimal(0);
    
    if (player.e) {
        player.e.points = new Decimal(0);
        player.e.upgrades = [];
    }

    // 2. Kuantum ve Plazma Katmanları Sıfırlama Motoru (Hata Korumalı)
    try {
        let tPoints = new Decimal(0);
        if (player.t && player.t.points) tPoints = player.t.points;
        else if (player.tier && player.tier.points) tPoints = player.tier.points;

        // Eğer oyuncu Tier 5 veya üzerindeyse zincirleme sıfırlamayı başlat
        if (tPoints.gte(5)) {
            // --- KUANTUM TEMİZLİĞİ ---
            if (player.q) {
                player.q.points = new Decimal(0);
                player.q.best = new Decimal(0);
                player.q.upgrades = [];
            }
            if (player.quantum) {
                player.quantum.points = new Decimal(0);
                player.quantum.best = new Decimal(0);
                player.quantum.upgrades = [];
            }

            // --- PLAZMA VE PLAZMA MILESTONE TEMİZLİĞİ (NEW) ---
            if (player.p) {
                player.p.points = new Decimal(0);      // Plazma puanlarını sıfırla
                player.p.best = new Decimal(0);        // En yüksek ulaşılan plazmayı sıfırla
                player.p.milestones = [];              // Plazma milestone'larını jilet gibi temizle
                player.p.upgrades = [];                // Eğer varsa plazma upgrade'lerini temizle
            }
            if (player.plasma) { // Eğer ID 'plasma' ise burası da koruma sağlar
                player.plasma.points = new Decimal(0);
                player.plasma.best = new Decimal(0);
                player.plasma.milestones = [];
                player.plasma.upgrades = [];
            }
        }
    } catch(err) {
        console.log("Sifirlama esnasinda bir hata oluştu ama oyun devam ediyor: ", err);
    }

    


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
            effectDescription: "x5⭢x25 Points!<br>x1⭢x4 Energy!<br>More energy upg!<br>Unlock Secret Layer!",
            done() {return player.t.points.gte(3)},
            unlocked() {return hasMilestone("t", 1)},
        },
        3: {
            requirementDescription: "4 Tier",
            effectDescription: "x25⭢x500 Points!<br>x4⭢x40 Energy!<br>Unlock New Layer!",
            done() {return player.t.points.gte(4)},
            unlocked() {return hasMilestone("t", 2)},
        },
        4: {
            requirementDescription: "5 Tier",
            effectDescription: "x40⭢x200 Energy!<br>x1⭢x3 Quantum!<br>Auto energy Upg!<br>More Quantum Upgrade!<br>Unlock New Layer!(Need 1e10 Points)<br>Unlock EpicRune boosts!",
            done() {return player.t.points.gte(5)},
            unlocked() {return hasMilestone("t", 3)},
        },
        5: {
            requirementDescription: "6 Tier",
            effectDescription: "x200⭢x1,000 Energy!<br>x3⭢x15 Quantum!<br>x1⭢x2.5 Plasma!<br>More Plasma Milestone!<br>More Energy&Quantum Upgrades!<br>Unlock R...?",
            done() {return player.t.points.gte(6)},
            unlocked() {return hasMilestone("t", 4)},
        },
        6: {
            requirementDescription: "? Tier",
            effectDescription: "x15⭢x150 Quantum!<br>x2.5⭢x50 Plasma!<br>Auto gain QP!<br>More Plasma Milestone!<br>More Upgrade!<br>Unlock New Layer!<br>x2 RuneLuck, +1 RuneBulk!",
            done() {return player.t.points.gte(7)},
            unlocked() {return false }
            //unlocked() {return hasMilestone("t", 5)},
        },

    },


    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "t", description: "T: Reset for Tier Up", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
})
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
        description: "Points boost energy gain!<br>Max:x111",
        cost: new Decimal(1000),
        effect() {
            return player.points.add(1).pow(0.1777).min(111)},
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
        cost: new Decimal(8e4),
        //effect() { return new Decimal(3) },
        unlocked() {return hasMilestone("t", 2) && hasUpgrade("e", 15);}
        },
        22: {
        title: "What, what is Rune?",
        description: "x2 Rune Shard Gain!<br>Special:x3 Energy!",
        cost: new Decimal(1e6),
        //effect() { return new Decimal(3) },
        unlocked() { return hasUpgrade("e", 21) }
        },
        23: {
        title: "More Useless!",
        description: "x5.55 Points Gain!",
        cost: new Decimal(8e6),
        //effect() { return new Decimal(3) },
        unlocked() { return hasUpgrade("e", 22) }
        },
        24: {
        title: "Wow!",
        description: "Energy upg bought boost energy and Points!",
        cost: new Decimal(2e7),
        effect() {
            let count = player.e.upgrades.length;
            return new Decimal(1).add(new Decimal(count).mul(0.35));
        },
        effectDisplay() { return `x${format(upgradeEffect('e', 24))}`;},
        unlocked() { return hasUpgrade("e", 23) }
        },
        25: {
        title: "Need more more points!",
        description: "Energy boost points but inf cap!",
        cost: new Decimal(1e8),
        effect() { 
            return player.e.points.add(1).pow(0.153).min(1.8e308);},
            effectDisplay() { return "x" + format(this.effect()) },
        unlocked() { return hasUpgrade("e", 24) }
        },
        31: {
        title: "New Upg?",
        description: "Energy boost itself!",
        cost: new Decimal(2.5e11),
        effect() {
            return player.e.points.add(1).pow(0.0643).min(1e4)},
            effectDisplay() { return "x" + format(this.effect()) },
        unlocked() {return hasMilestone("t", 5) && hasUpgrade("e", 25) }
        },
        32: {
        title: "Go more reset!",
        description: "Energy boost little Quantum gain!<br>(Go QuantumLayer)",
        cost: new Decimal(1.5e12),
        effect() {
            return player.e.points.add(1).pow(0.04022).min(1e4)},
            effectDisplay() { return "x" + format(this.effect()) },
        unlocked() {return hasUpgrade("e", 31) }
        },
        33: {
        title: "Finally!",
        description: "Points boost Plasma gain!",
        cost: new Decimal(1e13),
        effect() {
            return player.points.add(1).pow(0.0284).min(12.5)},
            effectDisplay() { return "x" + format(this.effect()) },
        unlocked() {return hasUpgrade("e", 32) }
        },




    },


    
    
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (player.r.unlocked) {
        // Uncommon Rune Boost: miktar * 0.005 + 1
        let uncommonBoost = player.r.uncommonRunes.mul(0.005).add(1);
        mult = mult.mul(uncommonBoost);

        // Rare Rune Energy Boost: miktar * 0.01 + 1
        let rareEnergyBoost = player.r.rareRunes.mul(0.015).add(1);
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
            if (player.t.points.gte(3)) {energyMultiplier = energyMultiplier.mul(4);}
            if (player.t.points.gte(4)) {energyMultiplier = energyMultiplier.mul(10);}
            if (player.t.points.gte(5)) {energyMultiplier = energyMultiplier.mul(5);}
            if (player.t.points.gte(6)) {energyMultiplier = energyMultiplier.mul(5);}
            if (hasUpgrade("e", 21)) { energyMultiplier = energyMultiplier.mul(5);}
            if (hasUpgrade("e", 22)) { energyMultiplier = energyMultiplier.mul(3);} //Rune after delete?
            if (hasUpgrade('e', 24)) {mult = mult.mul(upgradeEffect('e', 24));}
            if (hasUpgrade("q", 11)) { energyMultiplier = energyMultiplier.mul(10);}
            if (hasUpgrade("q", 31)) { energyMultiplier = energyMultiplier.mul(15);}
            if (hasMilestone("p", 0)) {energyMultiplier = energyMultiplier.mul(5);}
            if (hasMilestone("p", 2)) {energyMultiplier = energyMultiplier.mul(4);}
            if (hasMilestone("p", 5)) {energyMultiplier = energyMultiplier.mul(3);}
            if (hasUpgrade('e', 31)) {mult = mult.mul(upgradeEffect('e', 31));}
            


            // Üretimi ekle
            let totalGain = energyGainPerSecond.mul(energyMultiplier);
            player.e.points = player.e.points.add(totalGain.mul(diff));
        } else {
            // Eğer üstteki şart sağlanmıyorsa (Örn: Point 100'ün altına düştüyse)
            // Hiçbir şey yapma, üretim otomatik olarak durur (0 kazanım).
        }
        if (player.t && player.t.points && player.t.points.gte(5)) {
        for (let upg of Object.keys(layers.e.upgrades)) {
            // Eğer upgrade listede geçerli bir sayıysa, henüz satın alınmadıysa ve bütçe yetiyorsa otomatik buyUpgrade tetikler
            if (!isNaN(upg) && !hasUpgrade('e', upg)) {
                buyUpgrade('e', upg);
            }
        }
    }

    },
})
addLayer("q", {
    name: "Quantum", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Q", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#275522",
    requires: new Decimal(5e7), // Can be a function that takes requirement increases into account
    resource: "Quantum Points", // Name of prestige currency
    baseResource: "Energy", // Name of resource prestige is based on
    baseAmount() {return player.e.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    branches: ["e"],

    // --- KESİN QUANTUM RESET ÇÖZÜMÜ ---
    // Bu fonksiyon alt katmanların sıfırlanma anını yönetir.
    doReset(resettingLayer) {
        // Eğer reset atan katman Quantum'un kendisi ("q") ise İÇERİYE GİR
        if (resettingLayer == "q") {
            // 1. Energy katmanının puanlarını sıfırla
            player.e.points = new Decimal(0);

            // 2. Energy katmanının upgrade'lerini temizle
            player.e.upgrades = [];
            
            // BURASI ÇOK KRİTİK: Normalde TMT alt katmanların her şeyini siler.
            // Biz buraya başka hiçbir şey yazmayarak (Points, Tier, Rune katmanlarını çağırmayarak)
            // diğer tüm katmanları ve jeneratörleri koruma altına alıyoruz.
        }
        
        // Üst katmanlar (ileride gelecek olanlar) Quantum'u sıfırlamaya çalışırsa 
        // buradaki 'return;' sayesinde Quantum kendini koruyacak.
        return; 
    },
    
    // Quantum'un kendi içindeki verilerin üst katman resetlerinde silinmesini engeller
    keepOnReset: true,

    upgrades: {
        11: {
        title: "First reset layer!",
        description: "x10 Energy!",
        cost: new Decimal(1),
        //effect() { return new Decimal(1) },
        },
        12: {
        title: "More Reset!",
        description: "Quantum points boost itself!",
        cost: new Decimal(3),
        effect() {
                let qPoints = player.q.points;
                
                // Formül: (qPoints ^ 0.5) + 1
                // Karekök (pow 0.5) mantığı tam olarak istediğin şeyi yapar:
                // Başta (örneğin 4 puanda) anında +2 çarpan eklerken, ileride (örneğin 100 puanda) sadece +10 ekler.
                // Çarpan sürekli büyümeye devam eder ama büyüme hızı kademeli olarak yavaşlar.
                return qPoints.pow(0.4).add(0.41).max(1).min(190);
            },
            effectDisplay() { return format(this.effect()) + "x" },
        //effect() {
            //return player.q.points.add(1).pow(0.8).min(100)},
            //effectDisplay() { return "x" + format(this.effect()) },
        unlocked() { return hasUpgrade("q", 11) }
        },
        13: {
        title: "More more useless! :)",
        description: "x7.5 Points",
        cost: new Decimal(25),
        //effect() { return new Decimal(1) },
        unlocked() { return hasUpgrade("q", 12) }
        },
        14: {
        title: "More Runes!",
        description: "Unlock UncommonRune secret boost!",
        cost: new Decimal(50),
        //effect() { return new Decimal(1) },
        unlocked() { return hasUpgrade("q", 13) }
        },
        15: {
        title: "Keep points!",
        description: "Point boost itself!",
        cost: new Decimal(125),
        effect() {
            return player.points.add(1).pow(0.088).min(1e4)},
            effectDisplay() { return "x" + format(this.effect()) },
        unlocked() { return hasUpgrade("q", 14) }
        },
        21: {
        title: "Plasma booster!",
        description: "Quantum boost little Plasma gain!",
        cost: new Decimal(500),
        effect() {
            return player.q.points.add(1).pow(0.0777).min(1e4)},
            effectDisplay() { return "x" + format(this.effect()) },
        unlocked() {return hasMilestone("t", 4) && hasUpgrade("q", 15);}
        },
        22: {
        title: "Plasma booster!^2",
        description: "Energy boost very little plasma!",
        cost: new Decimal(12500),
        effect() {
            return player.e.points.add(1).pow(0.018).min(10)},
            effectDisplay() { return "x" + format(this.effect()) },
        unlocked() { return hasUpgrade("q", 21) }
        },
        23: {
        title: "Little Big Boost!",
        description: "x^1.02 Quantum Gain!",
        cost: new Decimal(25000),
        //effect() { return new Decimal(1) },
        unlocked() { return hasUpgrade("q", 22) }
        },
        24: {
        title: "Really Plasma Boost!",
        description: "x8 Plasma gain!",
        cost: new Decimal(2.5e5),
        //effect() { return new Decimal(1) },
        unlocked() { return hasUpgrade("q", 23) }
        },
        25: {
        title: "Nice!",
        description: "x20 Points gain!",
        cost: new Decimal(1e6),
        //effect() { return new Decimal(1) },
        unlocked() { return hasUpgrade("q", 24) }
        },
        31: {
        title: "Moreee Energy!",
        description: "x15 Energy gain!",
        cost: new Decimal(1e8),
        //effect() { return new Decimal(1) },
        unlocked() {
        return hasUpgrade("e", 32) || (player.q !== undefined);}
        },
        32: {
        title: "",
        description: "",
        cost: new Decimal(Infinity),
        //effect() { return new Decimal(1) },
        unlocked() { return false}
        },




    },

    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('q', 12)) {mult = mult.mul(upgradeEffect('q', 12));}
        if (player.t && player.t.points && player.t.points.gte(5)) {mult = mult.mul(5);}
        if (player.t && player.t.points && player.t.points.gte(6)) {mult = mult.mul(5);}
        if (hasMilestone("p", 0)) {mult = mult.mul(2);}
        if (hasMilestone("p", 1)) {mult = mult.mul(2.5);}
        if (hasMilestone('p', 3)) {mult = mult.mul(3);}
        if (hasMilestone('p', 4)) {mult = mult.mul(1.5);}
        if (hasMilestone('p', 5)) {mult = mult.mul(1.75);}
        if (hasUpgrade('e', 32)) {mult = mult.mul(upgradeEffect('e', 32));}



        if (hasUpgrade('q', 14)) {
            let uncommonCount = player.r.uncommonRunes || new Decimal(0);
            let qSecretBoost = new Decimal(1).add(uncommonCount.mul(0.002));
            mult = mult.mul(qSecretBoost);
        }
        if ((player.tier && player.tier.gte(5)) || (player.t && player.t.points && player.t.points.gte(5))) {
            let epicQuantumBoost = player.r.epicRunes.mul(0.08).add(1);
            mult = mult.mul(epicQuantumBoost);
        }



        return mult
    },
    
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
        if (hasUpgrade('q', 23)) {exp = exp.mul(1.02);}


        return exp;
    },
    
    row: 2, // Row the layer is in on the tree (0 is the first row)
    
    layerShown() { return player.t.points.gte(4);},
    hotkeys: [
        {key: "q", description: "Q: Reset for Quantum Points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
})
addLayer("p", {
    name: "Plasma", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#580058",
    requires: new Decimal(1e10), // Can be a function that takes requirement increases into account
    resource: "Plasma", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0, // Prestige currency exponent
    branches: ["e"],

    milestones:{
        0: {
            requirementDescription: "#1",
            effectDescription: "x5 Energy, x2 Quantum, x4 Plasma!<br>[100 Plasma]",
            done() {return player.p.points.gte(100)}
        },
        1: {
            requirementDescription: "#2",
            effectDescription: "x4 Points, x2.5 Quantum, x1.5 RuneShard!<br>[5,000 Plasma]",
            done() {return player.p.points.gte(5000)},
            unlocked() {return hasMilestone("p", 0)},
        },
        2: {
            requirementDescription: "#3",
            effectDescription: "x4 Energy, x^1.005 Points, x8 Plasma!<br>[50,000 Plasma]",
            done() {return player.p.points.gte(5e4)},
            unlocked() {return hasMilestone("p", 1)},
        },
        3: {
            requirementDescription: "#4",
            effectDescription() { 
            let pCount = player.p.points || new Decimal(0);
            let pBoost = pCount.mul(0.00000683).add(1).min(1000);
            
            return "x3 Quantum, Plasma boost itself! Currently: x" + format(pBoost, 2) + "<br>[250,000 Plasma]";
            },
            done() {return player.p.points.gte(2.5e5)},
            unlocked() {return hasMilestone("p", 2)},
        },
        4: {
            requirementDescription: "#5",
            effectDescription: "x3.5 Points, x1.5 Quantum, x1.25 RuneLuck(WIP)<br>[3,000,000 Plasma]",
            done() {return player.p.points.gte(3e6)},
            unlocked() {return hasMilestone("p", 3)},
        },
        5: {
            requirementDescription: "#6",
            effectDescription: "x3 Energy, x1.75 Quantum, x5 Plasma!<br>[500,000,000 Plasma]",
            done() {return player.p.points.gte(5e8)},
            unlocked() {return hasMilestone("t", 5) && hasMilestone("p", 4)},
        },
        6: {
            requirementDescription: "#7",
            effectDescription: "x4.5 Points, x...(WIP)<br>[7.5e9 Plasma]",
            done() {return player.p.points.gte(7.5e9)},
            unlocked() {return hasMilestone("p", 5)},
        },
        7: {
            requirementDescription: "#8",
            effectDescription: "Coming Part2!",
            done() {return player.p.points.gte(Infinity)},
            unlocked() {return hasMilestone("p", 6)},
        },



    },


    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        
        

        return mult
    },
    
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    
    row: 2, // Row the layer is in on the tree (0 is the first row)
    
    layerShown() { return player.t.points.gte(5);},
    update(diff) {
        // --- PLASMA DİNAMİK ÜRETİM MOTORU ---
        // Oyuncunun ana puanının (player.points) 1e10 üstünde olup olmadığını kontrol ediyoruz
        if (player.points && player.points.gte("1e10")) {
            
            // Saniyede kazanılacak baz plazma miktarı (1 plazma/sn)
            let plasmaGain = new Decimal(1); 
            if (hasMilestone('p', 0)) plasmaGain = plasmaGain.mul(4);
            if (hasMilestone('p', 2)) plasmaGain = plasmaGain.mul(8);
            if (hasMilestone('p', 5)) plasmaGain = plasmaGain.mul(5);
            if (player.t && hasMilestone('t', 5)) {plasmaGain = plasmaGain.mul(2.5);}
            if (hasMilestone('p', 3)) {
            let selfPlasmaBoost = player.p.points.mul(0.00000683).add(1).min(1000); 
            plasmaGain = plasmaGain.mul(selfPlasmaBoost);}
            if (hasUpgrade('q', 21)) {mult = mult.mul(upgradeEffect('q', 21));}
            if (hasUpgrade('q', 22)) {mult = mult.mul(upgradeEffect('q', 22));}
            if (hasUpgrade('q', 24)) {plasmaGain = plasmaGain.mul(8);}
            if (hasUpgrade('e', 33)) {mult = mult.mul(upgradeEffect('e', 33));}



            if ((player.tier && player.tier.gte(5)) || (player.t && player.t.points && player.t.points.gte(5))) {
            let epicPlasmaBoost = player.r.epicRunes.mul(0.10).add(1);
            plasmaGain = plasmaGain.mul(epicPlasmaBoost);}
            

            // Plazma puanını zamanla (diff) doğru orantılı olarak artırıyoruz
            player.p.points = player.p.points.add(plasmaGain.mul(diff));
        }
        // Eğer 1e10'un altına düşerse kod bu bloğa hiç girmeyeceği için üretim otomatik olarak durur!
    },
})