let modInfo = {
	name: "The Reborn Incremental",
	author: "???",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (1), // Used for hard resets and new players
	offlineLimit: 2,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0.3a",
	name: "Reborn the game!",
}

let changelog = `<h1>Changelog</h1><br>
			<br>
	<h2>v0.0</h2><br>
		- Making the game.<br>
			<br>
	<h2>v0.0.1</h2><br>
		- Fixing all layer.<br>
		- Two new Upgrade!<br>
			<br>
	<h2>v0.0.2</h2><br>
		- New Reborn reset.<br>
		- Three new Upgrade!<br>
		- Two upgrade nerfed!<br>
		- Endgame:4th Reborn!<br>
			<br>
	<h2>v0.0.3</h2><br>
		- Two new reborn reset!<br>
		- New layer, more upgrades.<br>
		- Buffed one upgrade.<br>
				<br>
	<h3>Endgame:6th Reborn!</h3>
		
		`

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
	if(!canGenPoints())
		return new Decimal(0)
		let gain = new Decimal(1)
		if (hasMilestone("r", 0)) {gain = gain.add(1)}
		if (hasMilestone("r", 1)) {gain = gain.mul(1.5)}
		if (hasMilestone("r", 3)) {gain = gain.mul(2)}
		if (hasMilestone("r", 6)) gain = gain.pow(1.2)
		if (hasUpgrade("c", 12)) gain = gain.times(upgradeEffect("c", 12))
		if (hasUpgrade("c", 14)) gain = gain.times(upgradeEffect("c", 14))
		if (hasUpgrade("c", 15)) gain = gain.times(upgradeEffect("c", 15))
		if (hasUpgrade("c", 22)) gain = gain.mul(upgradeEffect("c", 22))
		if (hasUpgrade("c", 24)) gain = gain.times(upgradeEffect("c", 24))
		if (hasUpgrade("c", 25)) gain = gain.times(upgradeEffect("c", 25))
		if (hasUpgrade("c", 16)) gain = gain.times(upgradeEffect("c", 16))
		if (hasUpgrade("co", 15)) gain = gain.times(upgradeEffect("co", 15))
		if (hasUpgrade("co", 25)) gain = gain.times(upgradeEffect("co", 25))


			

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
	return player.points.gte(new Decimal("1.8e308"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(7200) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}