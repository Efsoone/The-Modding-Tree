let modInfo = {
	name: "The Reborn Incremental Tree",
	author: "Efsoone",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "Nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Nothing!<br>
	<h3>v0.1</h3><br>
		- Three new layer!<br>
		- Rune Layer?(WIP)<br>
		- Endgame:(WIP)
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
		if (hasMilestone('t', 1)) {gain = gain.mul(5)}
		else if (hasMilestone('t', 0)) {gain = gain.mul(3)}
		if (hasMilestone('t', 2)) {gain = gain.mul(5)}
		if (hasUpgrade('e', 12)) {gain = gain.mul(2.5)}
		if (hasUpgrade("e", 15)) {gain = gain.mul(upgradeEffect("e", 15));}
		if (hasUpgrade('e', 23)) {gain = gain.mul(3.33)}




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

function getGameSpeed() {
    let speed = new Decimal(1)

    
    return speed
}


// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}