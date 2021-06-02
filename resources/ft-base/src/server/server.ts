import * as ft from "./lib/ft";
export * as ft from "./lib/ft";
import * as sql from "./lib/sql";
import { ICharacter } from "../shared/interfaces";
import FTEvent from "../shared/events";

onNet(FTEvent.tpm, () => {
	console.log(`TPM by ${source}`);
});

onNet(FTEvent.playerConnecting, () => {
	insertOrUpdatePlayer(source);
});

RegisterCommand("additem", (src: string, args: string[]) => {
	const itemkey = args[0];
	const amount = parseInt(args[1]) || 1;
	ft.players.GetPlayerSrc(src).then((player) => {
		if (player.is_admin || player.is_dev) {
			const char = ft.characters.GetCurrentCharacter(src);
			ft.inventories.getInventory(char.id).then((inv: ft.inventory.Inventory) => {
				inv.addItem(ft.items.GetItem(itemkey), amount);
			});
		}
	});
}, false);

function insertOrUpdatePlayer (src: string) {
	const identifiers = ft.identifiers.GetPlayerIdentifiers(src);
	sql.execute("INSERT INTO `players` (`steam`,`discord`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `steam` = ?", [identifiers.steam, identifiers.discord, identifiers.steam], () => {
		ft.players.PlayerChanged(identifiers.discord);
	});
}

onNet(FTEvent.serverLoadCharacters, () => {
	const src = source;
	ft.characters.GetCharacters(ft.identifiers.GetPlayerIdentifiers(src).discord).then((chars) => {
		emitNet(FTEvent.loadedCharacters, src, chars);
	});
});

onNet(FTEvent.serverCharSelected, (char: ICharacter) => {
	const src = source;
	ft.characters.CharSelected(src, char);
	ft.inventories.CreateInventoryIfNotExists(char);
	console.log(`Client ${src} [${char.player_discord}] is now [${char.id}] ${char.first_name} ${char.last_name}.`);
});

onNet(FTEvent.serverNewChar, (data) => {
	const src = source;
	const firstName = data.firstName || "First";
	const lastName = data.lastName || "Last";
	const dob = new Date(data.dob);
	ft.characters.NewCharacter(src, ft.identifiers.GetPlayerIdentifiers(src).discord, firstName, lastName, dob);
});

onNet(FTEvent.playerConnecting, () => {
	const src = source;
	emitNet(FTEvent.itemDefinitions, src, ft.items.GetItems());
});

RegisterCommand("items", (src: string) => {
	emitNet(FTEvent.itemDefinitions, src, ft.items.GetItems());
}, false);

onNet(FTEvent.getItemDefinitions, () => {
	const src = source;
	emitNet(FTEvent.itemDefinitions, src, ft.items.GetItems());
});