import { character } from "../../shared/interfaces";
import Event from "../../shared/events";
import * as nui from "./nuiLib";
import NUIEvent from "../lib/nuiEvents";
import { AllItems } from "../items";

let currentCharacter: character = undefined;
let gamertag = -1;

global.exports("currentChar", () => {
	return currentCharacter;
});

export function currentChar(): character {
	return currentCharacter;
}

export function setCurrentChar(char: character): void {
	currentCharacter = char;
}

export function SelectChar(char: character, isNew: boolean): void {
	setCurrentChar(char);
	emitNet(Event.loadCharSkin, char, isNew);
	emitNet(Event.serverCharSelected, char);
	if (isNew) {
		emit(Event.openCharCustomization, ["identity", "features", "style", "apparel"]);
	}
	
	const allItems = AllItems();
	if (allItems.length === 0) {
		// this helps debugging, don't have to reconnect to server to get items
		emitNet(Event.getItemDefinitions);
	}
}

export function UpdateGamertag(): void {
	if (!gamertag) {
		RemoveMpGamerTag(gamertag);
	}
	const curChar = currentChar();
	if (!curChar) {
		return;
	}
	gamertag = CreateFakeMpGamerTag(PlayerPedId(), `[${curChar.id}] ${curChar.first_name} ${curChar.last_name}`, false, false, "", 0);
	SetMpGamerTagVisibility(gamertag, 0, true);
	SetMpGamerTagAlpha(gamertag, 0, 200);
	setTimeout(() => {
		SetMpGamerTagVisibility(gamertag, 0, false);
	}, 2500);
}

onNet(Event.characterUpdated, (char: character) => {
	const curChar = currentChar();
	if (!curChar || curChar.id === char.id) {
		setCurrentChar(char);
		console.log(`char updated: ${JSON.stringify(currentChar)}`);
	}
});

nui.onNui(NUIEvent.selectChar, (data) => {
	SelectChar(data as character, false);
});