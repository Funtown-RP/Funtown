import * as ft from "./lib/ft";
import * as sql from "./lib/sql";
import { ICharacter } from "../shared/interfaces";
import FTEvent from "../shared/events";

onNet(FTEvent.tpm, () => {
	console.log(`TPM by ${source}`);
});

onNet(FTEvent.playerConnecting, () => {
	insertOrUpdatePlayer(source);
});

function insertOrUpdatePlayer (src: string) {
	const identifiers = ft.GetPlayerIdentifiers(src);
	sql.execute("INSERT INTO `players` (`steam`,`discord`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `steam` = ?", [identifiers.steam, identifiers.discord, identifiers.steam], () => {
		ft.Players.PlayerChanged(identifiers.discord);
	});
}

RegisterCommand("additem", (src: string, args: string[]) => {
	const itemkey = args[0];
	const amount = parseInt(args[1]) || 1;
	ft.Players.GetPlayerSrc(src).then((player) => {
		if (player.is_admin || player.is_dev) {
			const char = ft.Characters.GetCurrentCharacter(src);
			ft.Inventories.GetInventory(char.id).then((inv: ft.Inventory) => {
				inv.AddItem(ft.Items.GetItem(itemkey), amount);
			});
		}
	});
}, false);

onNet(FTEvent.serverLoadCharacters, () => {
	const src = source;
	ft.Characters.GetCharacters(ft.GetPlayerIdentifiers(src).discord).then((chars) => {
		emitNet(FTEvent.loadedCharacters, src, chars);
	});
});

onNet(FTEvent.serverCharSelected, (char: ICharacter) => {
	const src = source;
	ft.Characters.CharSelected(src, char);
	ft.Inventories.CreateInventoryIfNotExists(char);
	console.log(`Client ${src} [${char.player_discord}] is now [${char.id}] ${char.first_name} ${char.last_name}.`);
});

onNet(FTEvent.serverNewChar, (data) => {
	const src = source;
	const firstName = data.firstName || "First";
	const lastName = data.lastName || "Last";
	const dob = new Date(data.dob);
	ft.Characters.NewCharacter(src, ft.GetPlayerIdentifiers(src).discord, firstName, lastName, dob);
});

onNet(FTEvent.playerConnecting, () => {
	const src = source;
	emitNet(FTEvent.itemDefinitions, src, ft.Items.GetItems());
});

RegisterCommand("items", (src: string) => {
	emitNet(FTEvent.itemDefinitions, src, ft.Items.GetItems());
}, false);

onNet(FTEvent.getItemDefinitions, () => {
	const src = source;
	emitNet(FTEvent.itemDefinitions, src, ft.Items.GetItems());
});