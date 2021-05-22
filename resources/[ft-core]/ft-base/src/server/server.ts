onNet('ft-core:tpm', () => {
  console.log(`TPM from ${source}`)
});

onNet('playerConnecting', () => {
  const src = source;
  
  let steam = "";
  let discord = "";

  for (let i = 0; i < GetNumPlayerIdentifiers(src); i++) {
    const identifier = GetPlayerIdentifier(src, i);
    if (identifier.startsWith('steam')) {
      steam = identifier;
    }
    else if (identifier.startsWith('discord')) {
      discord = identifier;
    }
  }

  global.exports.ghmattimysql.execute("INSERT INTO `players` (`steam`,`discord`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `steam` = ?", [steam, discord, steam]);
})

RegisterCommand("sql", (source: string) => {
const src = source;
  
  let steam = "";
  let discord = "";

  for (let i = 0; i < GetNumPlayerIdentifiers(src); i++) {
    const identifier = GetPlayerIdentifier(src, i);
    if (identifier.startsWith('steam')) {
      steam = identifier;
    }
    else if (identifier.startsWith('discord')) {
      discord = identifier;
    }
  }

  global.exports.ghmattimysql.execute("INSERT INTO `players` (`steam`,`discord`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `steam` = ?", [steam, discord, steam]);

}, false)