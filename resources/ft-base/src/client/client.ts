import { character } from "../shared/interfaces";
import Event from "../shared/events";
import { currentChar, UpdateGamertag, SelectChar} from "./lib/char";
import * as nui from "./lib/nuiLib";

on(Event.playerSpawned, () => {
	if (!currentChar()) {
		nui.SendMessage("charSelect", "open", {forceChoice: true });
		nui.Focus();
	}
});

on(Event.clientResourceStarted, (resourceName: string) => {
	if (resourceName === GetCurrentResourceName()) {
		setTimeout(() => {
			nui.SendMessage("charSelect", "open", { forceChoice: true });
			nui.Focus();
		}, 1000);
	}
});

onNet(Event.selectedNewChar, (char: character) => {
	SelectChar(char, true);
});

onNet("cui_character:recievePlayerData", () => {
	UpdateGamertag();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
onNet(Event.loadedCharacters, (characters: any) => {
	nui.SendMessage("charSelect", "characters", { characters: characters });
});