import { character } from "../../shared/interfaces";
import { Event } from "../../shared/events";

let currentCharacter: character = undefined;
let gamertag = -1;

global.exports("currentChar", () => {
	return currentChar;
});

export function currentChar(): character {
	return currentCharacter;
}

export function setCurrentChar(char: character): void {
	currentCharacter = char;
}

export function SelectChar(char: character, isNew: boolean): void {
	setCurrentChar(char);
	emitNet(Event.loadCharSkin, currentChar(), isNew);
	emitNet(Event.serverCharSelected, currentChar());
	if (isNew) {
		emit(Event.openCharCustomization, ["identity", "features", "style", "apparel"]);
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
