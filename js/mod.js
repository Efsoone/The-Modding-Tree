let modInfo = {
	name: "The Rune Incrememtal",
	author: "Efsoone",
	pointsName: "skills",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 0.5,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1.1",
	name: "Full Released!",
}

let changelog = `<h1>Changelog:</h1><br>
  <h3>v0.1.1</h3><br>
    - Added FAQ infobox!<br>
    - Fixed Rune Stats tab!<br>
  <h3>v0.1</h3><br>
    - Released the game!<br>
    - Fixed more stuff!<br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints()) return new Decimal(0)
	  if (!hasMilestone("a", 0)) return new Decimal(0)
  let baseGain = player.points.gte(10) ? 0.0002 : 0.002
  let gain = new Decimal(baseGain)
  
  let totalAP = 0
  for (let id in player.a.achievements) {
  let achId = player.a.achievements[id]
  if (tmp.a.achievements[achId]) {
  totalAP += tmp.a.achievements[achId].reward || 0
  }}
  let apBoost = Math.pow(1 + totalAP, 0.15005)
  gain = gain.times(apBoost)
  if (tmp.r && tmp.r.getMythicSkillsBoost) { gain = gain.times(tmp.r.getMythicSkillsBoost)};
  if (tmp.r && tmp.r.getDivineSkillsBoost) { gain = gain.times(tmp.r.getDivineSkillsBoost)};
  if (tmp.r && tmp.r.getSecretSkillsBoost) { gain = gain.times(tmp.r.getSecretSkillsBoost)};


  
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(1800) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}