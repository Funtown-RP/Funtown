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

RegisterCommand('sql', (src: string) => {
  const identifiers = GetPlayerIdentifiers(src);
  sql.execute("INSERT INTO `players` (`steam`,`discord`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `steam` = ?", [identifiers.steam, identifiers.discord, identifiers.steam],
    () => {
      players.PlayerChanged(identifiers.discord);
    });
}, false);

RegisterCommand('chars', (src) => {
  const discord = GetPlayerIdentifiers(src).discord;
  characters.GetCharacters(discord).then((chars) => { setImmediate(() => console.log(JSON.stringify(chars)));})
}, false);

RegisterCommand('char', (_src, args) => {
  characters.GetCharacter(args[0]).then((char) => { setImmediate(() => console.log(JSON.stringify(char)));})
}, false);