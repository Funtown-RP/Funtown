import * as nui from "./lib/nuiLib";
import { NUIEvent } from "./lib/nuiEvents";
import { SelectChar } from "./lib/char";
import { Event } from "./../shared/events";
import { character } from "./../shared/interfaces";

nui.onNui(NUIEvent.close, () => {
	nui.Unfocus();
});

nui.onNui(NUIEvent.getCharacters, () => {
	emitNet(Event.serverLoadCharacters);
});

nui.onNui(NUIEvent.selectChar, (data) => {
	SelectChar(data as character, false);
});

nui.onNui(NUIEvent.newChar, (data) => {
	emitNet(Event.serverNewChar, data);
});
