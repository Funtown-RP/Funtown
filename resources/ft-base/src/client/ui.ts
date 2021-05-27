import * as nui from "./lib/nuiLib";
import { NUIEvent } from "./lib/nuiEvents";
import { Event } from "./../shared/events";

nui.onNui(NUIEvent.close, () => {
	nui.Unfocus();
});

nui.onNui(NUIEvent.getCharacters, () => {
	emitNet(Event.serverLoadCharacters);
});

nui.onNui(NUIEvent.newChar, (data) => {
	emitNet(Event.serverNewChar, data);
});

nui.onNui(NUIEvent.test, () => {
	// Keep this here!
	// It's used to determine if the UI can find a GTA client.
  });