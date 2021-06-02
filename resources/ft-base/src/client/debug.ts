import { Character } from "./lib/character";
import FTEvent from "../shared/events";
import * as nui from "./lib/nuiLib";
import NUIEvent from "./lib/nuiEvents";
import { AllItems } from "./items";
import { IItem } from "../shared/interfaces";

RegisterCommand(
	"tpm",
	() => {
		TeleportToMarker();
		emitNet(FTEvent.tpm);
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
	const curChar = Character.CurrentChar();
	console.log(`[${curChar?.id}] ${curChar?.first_name} ${curChar?.last_name}`);
	Character.UpdateGamertag();
}, false);

RegisterCommand("nuiq", () => {
	nui.Unfocus();
}, false);

nui.onNui(NUIEvent.getItems, (): Array<IItem> => {
	const allItems = AllItems();
	if (allItems.length === 0) {
		emitNet(FTEvent.getItemDefinitions);
		console.log("refresh again please");
	}
	return allItems;
});

// RegisterCommand("giveitem", (src: string, args: string[]) => {
// 	emitNet();
// }, false);