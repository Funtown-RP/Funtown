import * as players from "./classes/player";
import * as characters from "./classes/character";
import { GetPlayerIdentifiers } from "./lib/identifiers";

RegisterCommand("addcash", (src: string, args: string[]) => {
  const amount = parseInt(args[0])
  if (amount > 0) {
    players.GetPlayerSrc(src).then((player) => {
      if (player.is_admin || player.is_dev) {
        const char = characters.GetCurrentCharacter(src);
        characters.AddCash(char, amount);
      }
  })
}}, false)

RegisterCommand("saddcash", async (src: string, args: string[]) => {
  if (args.length >= 2) {
    const amount = parseInt(args[1])
    if (amount > 0) {
     characters.AddCash(await characters.GetCharacter(args[0]), amount);
    }
  }
}, false);

RegisterCommand("newchar", (src: string, args: string[]) => {
	characters.NewCharacter(src, GetPlayerIdentifiers(src).discord, args[0], args[1]);
  }, false)