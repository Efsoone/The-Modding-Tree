addLayer("a", {
    name: "Achievements",
    symbol: "A",
    position: 0,
    row: "side",
    type: "none", 
    color: "yellow",
    resource: "Achievements",
    tooltip() { return ("Achievements") },
    
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        achievements: [],
        infobox: {},
    }},
    
    layerShown() { return true },

    // Kazanılan başarım sayısı otomatik olarak Achievement Points olarak güncellenir
    update(diff) { player.a.points = new Decimal(player.a.achievements.length)
    },
    achievementPopups: true,
    achievements: {
      11: {
        name: "Starting!",
        done() { return player.r.totalRollsBulk.gte(1)
        },
        tooltip: "Open first rune!<br>Reward: 2 AP!",
        reward: 2,
      },
      12: {
        name: "Beginning!",
        done() { return player.r.totalRollsBulk.gte(1000) },
        tooltip: "Open total 1,000 Runes!<br>Reward: 3 AP!",
        reward: 3,
      },
      13: {
        name: "More progress!",
        done() { return player.r.totalRollsBulk.gte(1e4) },
        tooltip: "Open total 10,000 Runes!<br>Reward: 4 AP, x1.5 Rune Bulk!",
        reward: 4,
      },
      14: {
        name: "Need Faster!",
        done() { return player.r.totalRollsBulk.gte(1e5) },
        tooltip: "Open total 100,000 Runes!<br>Reward: 7 AP, x1.75 Rune Luck!",
        reward: 7,
      },
      15: {
        name: "Pro!",
        done() { return player.r.totalRollsBulk.gte(1e6) },
        tooltip: "Open total 1,000,000 Runes!<br>Reward: 14 AP, x2.5 Rune Bulk!",
        reward: 14,
      },
      21: {
        name: "SKILLSS!",
        done() { return player.points.gte(1) },
        tooltip: "Get '1' skills!<br>Reward: 8 AP",
        reward: 8,
      },
      22: {
        name: "First Reseting!",
        done() { return player.rp.best.gte(1) },
        tooltip: "Reset for RP!<br>Reward: 12 AP",
        reward: 12,
      },
      23: {
        name: "Millionaire!",
        done() { return player.rp.points.gte(1e6) },
        tooltip: "Get 1,000,000 RP!<br>Reward: 14 AP, x2.5 RP Gain!",
        reward: 14,
      },
      24: {
        name: "Even more AFK!",
        done() { return player.r.totalRollsBulk.gte(1e7) },
        tooltip: "Open total 10,000,000 Runes!<br>Reward: 25 AP, x2 Rune Luck&Bulk!",
        reward: 25,
      },
      25: {
        name: "Borinng!",
        done() { return new Decimal(player.r.runes.secret || 0).gte(1) },
        tooltip: "Unlock Secret Rune!<br>Reward: 21 AP, x1.5 Rune Luck!",
        reward: 21,
      },
    
    },

  milestones: {
      0: {
          requirementDescription: "Finally Begin!",
          effectDescription: "Congratulations, starting skills gain!<br>[30 AP]",
          done() { return player.a.points.gte(5) }
        },
      1: {
          requirementDescription: "End of One!",
          effectDescription: "v0.2 to unlock!<br>[1.8e308 AP]",
          done() { return player.a.points.gte(100) },
          unlocked() { return player.a.points.gte(100) }
        },
    },

    

    infoboxes: {
        faqInfo1: {
            title: "How to play the game?",
            body() {
                return "Welcome to game! This is an <b>RNG-based incremental game</b>.<br><br>To get started, head over to the <b style='color: #14b8a6;'>Runes (R)</b> layer and hit <b style='color: #ffffff;'>Rune Roll</b> to unlock your first runes. Use them to collect <b style='color: #14b8a6;'>Rune Shards</b>, boost your <b style='color: #ffffff;'>Skills</b>, and scale your progress.<br><br>Good luck and have fun!"
            }
        }
    },
    // Sekmelerin içerikleri
    microtabs: {
        stuff: {
      "Achievements": {
      content: [
        "blank",
        ["display-text", () => {
    let totalAP = 0
    for (let id in tmp.a.achievements) {
    if (hasAchievement("a", id)) {
    totalAP += tmp.a.achievements[id].reward || 0
      }
    }
    // Yumuşak üslü büyüme
    let apBoost = Math.pow(1 + totalAP, 0.15005)
    return `You have <h2 style='color: yellow; text-shadow: 0 0 10px yellow; display: inline;'>${totalAP}</h2> Achievement Points, which boost skills gain by <h2 style='color: #ffffff; text-shadow: 0 0 8px #ffffff; display: inline;'>x${apBoost.toFixed(2)}</h2>`
        }],
        "blank",
        "blank",
        "achievements"
        ]
       },
        "Milestones": {
        content: [
          "blank",
          ["display-text", () => {
    let totalAP = 0
    for (let id in tmp.a.achievements) {
    if (hasAchievement("a", id)) {
    totalAP += tmp.a.achievements[id].reward || 0
      }
    }
    // Yumuşak üslü büyüme
    let apBoost = Math.pow(1 + totalAP, 0.15005)
    return `You have <h2 style='color: yellow; text-shadow: 0 0 10px yellow; display: inline;'>${totalAP}</h2> Achievement Points, which boost skills gain by <h2 style='color: #ffffff; text-shadow: 0 0 8px #ffffff; display: inline;'>x${apBoost.toFixed(2)}</h2>`
        }],
          "blank",
          "milestones",
          ]
          },
          "FAQ": {
          content: [
            "blank",
            ["infobox", "faqInfo1"]
          ]
        }
      }
    },

    tabFormat: [
    ["microtabs", "stuff", { "border": "none" }]
    ]
})
