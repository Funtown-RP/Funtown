export enum FTEvent {
	characterUpdated = "ft-base:character-updated",
	selectedNewChar = "ft-base:select-new-char", 
	loadedCharacters = "ft-base:loaded-characters",
	serverLoadCharacters = "ft-base:load-characters",
	playerConnecting = "playerConnecting",
	tpm = "ft-base:tpm",
	serverCharSelected = "ft-base:char-selected",
	serverNewChar = "ft-base:new-char",
	loadCharSkin = "cui_character:requestCharData",
	openCharCustomization = "cui_character:open",
	playerSpawned = "playerSpawned",
	clientResourceStarted = "onClientResourceStart",
	itemDefinitions = "ft-base:item-definitions",
	getItemDefinitions = "ft-base:get-item-definitions",
	getInventory = "ft-base:get-inventory",
	inventoryData = "ft-base:inventory-data"
}

export default FTEvent;