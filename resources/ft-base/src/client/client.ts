import { character } from "../shared/interfaces";
import { Event } from "../shared/events";
import { currentChar, UpdateGamertag, SelectChar} from "./lib/char";
import * as nui from "./lib/nuiLib";

setTick(() => {
	// Turn off emergency/police/ems dispatch every frame
	for (let i = 0; i < 25; i++) {
		EnableDispatchService(i, false);
	}

	// Turn off wanted level
	ClearPlayerWantedLevel(PlayerId());
});

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

onNet(Event.loadedCharacters, (characters: any) => {
	nui.SendMessage("charSelect", "characters", { characters: characters });
});
