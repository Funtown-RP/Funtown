import * as players from "./lib/player";
import * as sql from "./lib/sql"

onNet('ft-core:tpm', () => {
  console.log(`TPM by ${source}`)
});

onNet('playerConnecting', () => {
  insertOrUpdatePlayer(source);
})

function insertOrUpdatePlayer (src: string) {
  const identifiers = players.GetPlayerIdentifiers(src);
  sql.execute("INSERT INTO `players` (`steam`,`discord`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `steam` = ?", [identifiers.steam, identifiers.discord, identifiers.steam],
    () => {
      players.PlayerChanged(identifiers.discord);
    });
}

RegisterCommand('sql', (src: string) => {
  const identifiers = players.GetPlayerIdentifiers(src);
  sql.execute("INSERT INTO `players` (`steam`,`discord`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `steam` = ?", [identifiers.steam, identifiers.discord, identifiers.steam],
    () => {
      players.PlayerChanged(identifiers.discord);
    });
}, false);

RegisterCommand('sql2', async (src: string) => {
  console.log(JSON.stringify(await players.GetPlayerSrc(src)))
}, false);