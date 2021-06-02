import { ft } from "./server";

RegisterCommand("addcash", (src: string, args: string[]) => {
	const amount = parseInt(args[0]);
	if (amount > 0) {
		ft.players.GetPlayerSrc(src).then((player) => {
			if (player.is_admin || player.is_dev) {
				const char = ft.characters.GetCurrentCharacter(src);
				ft.characters.AddCash(char, amount);
			}
		});
	}}, false);

RegisterCommand("saddcash", async (src: string, args: string[]) => {
	if (args.length >= 2) {
		const amount = parseInt(args[1]);
		if (amount > 0) {
			ft.characters.AddCash(await ft.characters.GetCharacter(args[0]), amount);
		}
	}
}, false);

RegisterCommand("additem2", (src: string, args: string[]) => {
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