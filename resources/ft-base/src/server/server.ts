import { GetPlayerIdentifiers } from "./lib/identifiers";
import * as players from "./classes/player";
import * as characters from "./classes/character";
import * as sql from "./lib/sql"

onNet('ft-core:tpm', () => {
  console.log(`TPM by ${source}`)
});

onNet('playerConnecting', () => {
  insertOrUpdatePlayer(source);
})

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
  
})

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