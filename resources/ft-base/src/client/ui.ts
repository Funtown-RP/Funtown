import * as nui from "./lib/nuiLib";
import NUIEvent from "./lib/nuiEvents";
import FTEvent from "./../shared/events";

nui.onNui(NUIEvent.close, () => {
	nui.Unfocus();
});

nui.onNui(NUIEvent.getCharacters, () => {
	emitNet(FTEvent.serverLoadCharacters);
});

nui.onNui(NUIEvent.newChar, (data) => {
	emitNet(FTEvent.serverNewChar, data);
});

nui.onNui(NUIEvent.test, () => {
	// Keep this here!
	// It's used to determine if the UI can find a GTA client.
});

nui.onNui(NUIEvent.getInventory, () => {
	emitNet(FTEvent.getInventory);
});

onNet(FTEvent.inventoryData, (inventory: never) => {
	nui.SendMessage("inventory", "data", {inventory: inventory});
});