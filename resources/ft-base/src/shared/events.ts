export enum Event {
	characterUpdated = "ft-base:characterUpdated",
	selectedNewChar = "ft-base:selectNewChar", 
	loadedCharacters = "ft-base:loadedCharacters",
	serverLoadCharacters = "ft-base:loadCharacters",
	playerConnecting = "playerConnecting",
	tpm = "ft-base:tpm",
	serverCharSelected = "ft-base:charSelected",
	serverNewChar = "ft-base:newChar",
	loadCharSkin = "cui_character:requestCharData",
	openCharCustomization = "cui_character:open",
	playerSpawned = "playerSpawned",
	clientResourceStarted = "onClientResourceStart",
	itemDefinitions = "ft-base:item-definitions"
}

export default Event;