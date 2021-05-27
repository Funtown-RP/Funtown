import { currentChar, UpdateGamertag } from "./lib/char";
import { Event } from "../shared/events";
import * as nui from "./lib/nuiLib";
import { NUIEvent } from "./lib/nuiEvents";

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

nui.onNui(NUIEvent.test, () => {
  // Keep this here!
  // It's used to determine if the UI can find a GTA client
	console.log('UI found!')
});

RegisterCommand("debug", () => { 
  nui.SendMessage("main", "open"); nui.Focus(); 
}, false);

RegisterCommand("char", () => {
		const curChar = currentChar();
		console.log(`[${curChar?.id}] ${curChar?.first_name} ${curChar?.last_name}`);
		UpdateGamertag();
	}, false
);

RegisterCommand("nuiq", () => {
  nui.Unfocus();
}, false);
