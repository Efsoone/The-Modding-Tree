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
	num: "0.2 Part1",
	name: "Huge Update!",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Nothing!<br>
			<br>
	<h3>v0.1</h3><br>
		- Three new layer!<br>
		- Rune Layer?<br>
				<br>
	<h3>Endgame: 1e9 Points!</h3><br>
				<br>
	<h3>v0.2 Part1</h3><br>
		- More new tier!<br>
		- More Layer!<br>
		- Changed Energy Upg!<br>
		- Generator broken Fixed!<br>
		- RuneButton Fixed!<br>
		- Part2 Coming Soon!<br>
				<br>
	<h3>Endgame: 1e17 Points!</h3>
	

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
		if (hasMilestone('t', 3)) {gain = gain.mul(20)}
		if (hasUpgrade('e', 12)) {gain = gain.mul(2.5)}
		if (hasUpgrade("e", 15)) {gain = gain.mul(upgradeEffect("e", 15));}
		if (hasUpgrade('e', 23)) {gain = gain.mul(5.55)}
		if (hasUpgrade('e', 24)) {gain = gain.mul(upgradeEffect('e', 24));}
		if (hasUpgrade("e", 25)) {gain = gain.mul(upgradeEffect("e", 25));}
		if (hasUpgrade('q', 13)) {gain = gain.mul(7.5)}
		if (hasUpgrade("q", 15)) {gain = gain.mul(upgradeEffect("q", 15));}
		if (hasMilestone('p', 1)) {gain = gain.mul(4)}
		if (hasMilestone('p', 4)) {gain = gain.mul(3.5)}
		if (hasMilestone('p', 6)) {gain = gain.mul(4.5)}
		if (hasUpgrade('q', 25)) {gain = gain.mul(20)}



		if (hasMilestone('p', 2)) {gain = gain.pow(1.005);}

		if (player.r.unlocked) {
        // Common Rune Boost: miktar * 0.004 + 1
        let commonBoost = player.r.commonRunes.mul(0.004).add(1);
        gain = gain.mul(commonBoost);

        // Rare Rune Points Boost: miktar * 0.02 + 1
        let rarePointsBoost = player.r.rareRunes.mul(0.02).add(1);
        gain = gain.mul(rarePointsBoost);}
		
		if ((player.tier && player.tier.gte(5)) || (player.t && player.t.points && player.t.points.gte(5))) {
    	let epicPointsBoost = player.r.epicRunes.mul(0.05).add(1);
    	gain = gain.mul(epicPointsBoost);}



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