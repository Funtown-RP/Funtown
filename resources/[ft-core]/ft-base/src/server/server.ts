onNet('ft-core:tpm', () => {
  console.log(`TPM from ${source}`)
});

onNet('playerConnecting', () => {
  const src = source;
  
  for (let i = 0; i < GetNumPlayerIdentifiers(src); i++) {
    const identifier = GetPlayerIdentifier(src, i);
    console.log(identifier);
  }
})