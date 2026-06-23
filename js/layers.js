addLayer("r", {
    name: "Runes",
    symbol: "R", // Katman düğümünde görünecek harf
    position: 0, 
    startData() { return {
        unlocked: false, // Başlangıçta kilitli olacak
        points: new Decimal(0), // İleride rün puanları veya parçacıkları için kullanılabilir
    }},
    // Fallback renk (CSS yüklenene kadar görünecek düz renk)
    color: "#3d3d3d", 

    // --- RENK GEÇİŞİ (GRADIENT) EKLEME ALANI ---
    nodeStyle() {
        return {
            // Siyah (#000000) renginden yavaşça beyaza (#ffffff) geçiş (Animasyonsuz)
            background: "linear-gradient(135deg, #000000 0%, #ffffff 100%)",
            // Yazının (R harfinin) siyah-beyaz arka planda okunabilmesi için zıt renk (Örn: Gri/Gümüş)
            color: "#3d3d3d",
            // İstersen butonun dış çerçevesine de şık bir gri tonu verebilirsin
            "border-color": "#272727"
        }
    }, // Rün sistemine yakışacak efsanevi bir mor/indigo tonu
    
    // --- KİLİT AÇMA ŞARTLARI ---
    requires: new Decimal(8e5), // 80k Energy gereksinimi
    resource: "Rune Shards", 
    baseResource: "Energy", // Kilit açmak için harcanacak/bakılacak kaynak
    baseAmount() { return player.e.points }, // Energy katmanındaki puanları kontrol eder
    
    type: "none", // Mekanikleri tamamen kendimiz yazacağımız için yine "none" tutuyoruz
    row: "side",  // İŞTE BURASI! Katmanı sol/sağ menüde bir yan katman (Side Layer) yapar.

    // --- RÜN KAYNAKLARI VE İSTATİSTİKLERİ ---
    RuneShards: new Decimal(0),

    layout: [
        "main-display",
        "blank",
        "upgrades" // İleride buraya Roblox tarzı zarlar, rünler ve butonlar gelecek
    ],

    tabFormat: {
    "Main": {
        content: [
            "main-display",
            "blank",
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
                        
                        <span style="color: #bbbbbb; display: block; text-align: center;">Loading...</span>
                    </div>
                `;
            }],
        ]
    }},
    microtabs: {
    stuff:{
        "Main": {
        Upgrades: {
            content: ["upgrades"]
        }},
        "Stats": {
            content: [""]
        }}},




    // Katmanın görünme şartı: Oyuncu Tier 3'e ulaştığında bu yan katman satın alınabilir olarak belirecek
    layerShown() { 
        return player.t.points.gte(3); 
    },

    update(diff) {
        if (player.t.points.gte(3) && player.e.points.gte(80000)) {
            player.r.unlocked = true;
        }
        
    },
}),
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
        if (level === 3) return new Decimal(Infinity); // Tier 3 -> 4
        
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
        },
        2: {
            requirementDescription: "3 Tier",
            effectDescription: "x5⭢x25 Points!<br>x1⭢x2.5 Energy!<br>More energy upg!<br>Unlock Rune Layer(WIP)",
            done() {return player.t.points.gte(3)},
        },
        3: {
            requirementDescription: "4 Tier",
            effectDescription: "Soon?",
            done() {return player.t.points.gte(4)},
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
        unlocked() { return hasMilestone("t", 2) }
        },
        22: {
        title: "What what is Rune?",
        description: "x5 Rune Shard Gain!(WIP)<br>Special:x2.5 Energy!",
        cost: new Decimal(2.5e6),
        //effect() { return new Decimal(3) },
        unlocked() { return hasUpgrade("e", 21) }
        },
        23: {
        title: "More Useless!",
        description: "x3.33 Points Gain!",
        cost: new Decimal(33333333),
        //effect() { return new Decimal(3) },
        unlocked() { return hasUpgrade("e", 22) }
        },
        24: {
        title: "Coming Soon!",
        description: "I'm working rune layer.<br>More Coming very soon!",
        cost: new Decimal(Infinity),
        //effect() { return new Decimal(3) },
        unlocked() { return hasUpgrade("e", 23) }
        },



    },


    
    
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "e", description: "E: Reset for Energy", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
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

            // Üretimi ekle
            let totalGain = energyGainPerSecond.mul(energyMultiplier);
            player.e.points = player.e.points.add(totalGain.mul(diff));
        } else {
            // Eğer üstteki şart sağlanmıyorsa (Örn: Point 100'ün altına düştüyse)
            // Hiçbir şey yapma, üretim otomatik olarak durur (0 kazanım).
        }
    },
})
