import * as players from "./lib/player";
import * as characters from "./lib/character";

RegisterCommand("addcash", (src: string, args: string[]) => {
	const amount = parseInt(args[0]);
	if (amount > 0) {
		players.GetPlayerSrc(src).then((player) => {
			if (player.is_admin || player.is_dev) {
				const char = characters.GetCurrentCharacter(src);
				characters.AddCash(char, amount);
			}
		});
	}}, false);

RegisterCommand("saddcash", async (src: string, args: string[]) => {
	if (args.length >= 2) {
		const amount = parseInt(args[1]);
		if (amount > 0) {
			characters.AddCash(await characters.GetCharacter(args[0]), amount);
		}
	}
}, false);