import { GetPlayerIdentifiers } from "./lib/identifiers";
import * as players from "./classes/player";
import * as characters from "./classes/character";
import * as sql from "./lib/sql"
import { character } from "../shared/interfaces";

onNet('ft-core:tpm', () => {
  console.log(`TPM by ${source}`)
});

onNet('playerConnecting', () => {
  insertOrUpdatePlayer(source);
});

function insertOrUpdatePlayer (src: string) {
  const identifiers = GetPlayerIdentifiers(src);
  sql.execute("INSERT INTO `players` (`steam`,`discord`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `steam` = ?", [identifiers.steam, identifiers.discord, identifiers.steam],
    () => {
      players.PlayerChanged(identifiers.discord);
    });
}

onNet('ft-base:loadCharacters', () => {
  const src = source;
  characters.GetCharacters(GetPlayerIdentifiers(src).discord).then((chars) => {
    emitNet('ft-base:loadedCharacters', src, chars)
  });
});

onNet('ft-base:charSelected', (char: character) => {
  const src = source;
  characters.CharSelected(src, char);
  console.log(`Client ${src} [${char.player_discord}] is now [${char.id}] ${char.first_name} ${char.last_name}.`)
});

RegisterCommand('sql', (src: string) => {
  const identifiers = GetPlayerIdentifiers(src);
  sql.execute("INSERT INTO `players` (`steam`,`discord`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `steam` = ?", [identifiers.steam, identifiers.discord, identifiers.steam],
    () => {
      players.PlayerChanged(identifiers.discord);
    });
}, false);

onNet('ft-base:newChar', (data: any) => {
  const src = source;
  const firstName = data.firstName || "First";
  const lastName = data.lastName || "Last";
  characters.NewCharacter(src, GetPlayerIdentifiers(src).discord, firstName, lastName);
});

RegisterCommand("newchar", (src: string, args: string[]) => {
  characters.NewCharacter(src, GetPlayerIdentifiers(src).discord, args[0], args[1]);
}, false)

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