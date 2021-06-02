import { currentChar, UpdateGamertag } from "./lib/char";
import Event from "../shared/events";
import * as nui from "./lib/nuiLib";
import NUIEvent from "./lib/nuiEvents";
import { AllItems } from "./items";
import { item } from "../shared/interfaces";

RegisterCommand(
	"tpm",
	() => {
		TeleportToMarker();
		emitNet(Event.tpm);
	},
	false
);

function TeleportToMarker(): void {
	const marker = GetFirstBlipInfoId(8);
	if (DoesBlipExist(marker)) {
		const markerCoords = GetBlipInfoIdCoord(marker);
		TeleportToCoords(markerCoords[0], markerCoords[1]);
	} else {
		console.log("No marker found.");
	}
}

function TeleportToCoords(x: number, y: number): void {
	SetPedCoordsKeepVehicle(PlayerPedId(), x, y, 0);
	setTimeout(() => {
		TeleportFindZ(x, y);
	}, 1);
}

function TeleportFindZ(x: number, y: number) {
	for (let height = 10000; height > 0; height--) {
		const groundCoords = GetGroundZFor_3dCoord(x, y, height, false);

		if (groundCoords[0]) {
			SetPedCoordsKeepVehicle(PlayerPedId(), x, y, groundCoords[1]);
			return;
		}
	}
	setTimeout(() => {
		TeleportFindZ(x, y);
	}, 100);
}

RegisterCommand("debug", () => { 
	nui.SendMessage("main", "open"); nui.Focus(); 
}, false);

RegisterCommand("char", () => {
	const curChar = currentChar();
	console.log(`[${curChar?.id}] ${curChar?.first_name} ${curChar?.last_name}`);
	UpdateGamertag();
}, false);

RegisterCommand("nuiq", () => {
	nui.Unfocus();
}, false);

nui.onNui(NUIEvent.getItems, (): Array<item> => {
	const allItems = AllItems();
	if (allItems.length === 0) {
		emitNet(Event.getItemDefinitions);
		console.log("refresh again please");
	}
	return allItems;
});

// RegisterCommand("giveitem", (src: string, args: string[]) => {
// 	emitNet();
// }, false);