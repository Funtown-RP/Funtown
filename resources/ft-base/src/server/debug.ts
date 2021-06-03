import * as ft from "./lib/ft";

RegisterCommand("addcash", (src: string, args: string[]) => {
	const amount = parseInt(args[0]);
	if (amount > 0) {
		ft.Players.GetPlayerSrc(src).then((player) => {
			if (player.is_admin || player.is_dev) {
				const char = ft.Characters.GetCurrentCharacter(src);
				ft.Characters.AddCash(char, amount);
			}
		});
	}}, false);

RegisterCommand("saddcash", async (src: string, args: string[]) => {
	if (args.length >= 2) {
		const amount = parseInt(args[1]);
		if (amount > 0) {
			ft.Characters.AddCash(await ft.Characters.GetCharacter(args[0]), amount);
		}
	}
}, false);

RegisterCommand("additem2", (src: string, args: string[]) => {
	const itemkey = args[0];
	const amount = parseInt(args[1]) || 1;
	ft.Players.GetPlayerSrc(src).then((player) => {
		if (player.is_admin || player.is_dev) {
			const char = ft.Characters.GetCurrentCharacter(src);
			ft.Inventories.getInventory(char.id).then((inv: ft.Inventory) => {
				inv.addItem(ft.Items.GetItem(itemkey), amount);
			});
		}
	});
}, false);