import { ICharacter } from "../shared/interfaces";
import FTEvent from "../shared/events";
import { Character } from "./lib/character";
import * as nui from "./lib/nuiLib";

on(FTEvent.playerSpawned, () => {
	if (!Character.CurrentChar()) {
		nui.SendMessage("charSelect", "open", {forceChoice: true });
		nui.Focus();
	}
});

on(FTEvent.clientResourceStarted, (resourceName: string) => {
	if (resourceName === GetCurrentResourceName()) {
		setTimeout(() => {
			nui.SendMessage("charSelect", "open", { forceChoice: true });
			nui.Focus();
		}, 1000);
	}
});

onNet(FTEvent.selectedNewChar, (char: ICharacter) => {
	Character.SelectChar(char, true);
});

onNet("cui_character:recievePlayerData", () => {
	Character.UpdateGamertag();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
onNet(FTEvent.loadedCharacters, (characters: any) => {
	nui.SendMessage("charSelect", "characters", { characters: characters });
});