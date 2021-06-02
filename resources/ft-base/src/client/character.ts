import { ICharacter } from "../shared/interfaces";
import { Character } from "./lib/character";
import { FTEvent } from "../shared/events";
import NUIEvent from "./lib/nuiEvents";
import * as nui from "./lib/nuiLib";

onNet(FTEvent.characterUpdated, (char: ICharacter) => {
	const curChar = Character.CurrentChar();
	if (!curChar || curChar.id === char.id) {
		Character.SetCurrentChar(char);
		console.log(`char updated: ${JSON.stringify(Character.CurrentChar)}`);
	}
});

global.exports("CurrentChar", () => {
	return Character.currentCharacter;
});

nui.onNui(NUIEvent.selectChar, (data) => {
	console.log("NUI select char");
	Character.SelectChar(data as ICharacter, false);
});
