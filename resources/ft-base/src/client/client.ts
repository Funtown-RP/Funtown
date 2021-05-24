const debug = true;


setTick(() => {
  // Turn off emergency/police/ems dispatch every frame
  for (let i = 0; i < 25; i++) {
    EnableDispatchService(i, false)
  }

  // Turn off wanted level
    ClearPlayerWantedLevel(PlayerId())
})

RegisterCommand("tpm", () => {
  TeleportToMarker();
  emitNet("ft-core:tpm");
}, false)

function TeleportToMarker (): void {
  const marker = GetFirstBlipInfoId(8);
  if (DoesBlipExist(marker)) {
    const markerCoords = GetBlipInfoIdCoord(marker);
    debugLog("Teleporting to marker.");
    TeleportToCoords(markerCoords[0], markerCoords[1]);
  } else {
    debugLog("No marker found.");
  }
}

function TeleportToCoords(x: number, y: number): void {
  SetPedCoordsKeepVehicle(PlayerPedId(), x, y, 0);
  setTimeout(() => {TeleportFindZ(x, y); }, 1);
}

function TeleportFindZ(x: number, y: number) {
  for (let height = 10000; height > 0; height--) {
    
    const groundCoords = GetGroundZFor_3dCoord(x, y, height, false);

    if (groundCoords[0]) {
      debugLog(height.toString());
      SetPedCoordsKeepVehicle(PlayerPedId(), x, y, groundCoords[1]);
      return;
    }
    
  }   
  debugLog("Couldn't find ground, trying again");
  setTimeout(() => {TeleportFindZ(x, y); }, 100);
}

function debugLog(message: string)
{
  if (debug) {
    console.log(message)
  }
}

RegisterCommand("debug", (_source: string, _args: Array<any>) => {
  SendNuiMessage(JSON.stringify({ type: 'open', app: 'main'}))
  SetNuiFocus(true, true);
}, false);

RegisterNuiCallbackType('close')
on('__cfx_nui:close', (_data, callback) => {
    SetNuiFocus(false, false);
    callback({});
});

RegisterNuiCallbackType('getCharacters')
on('__cfx_nui:getCharacters', (_data, callback) => {
    emitNet('ft-base:loadCharacters')
    callback({});
});

RegisterNuiCallbackType('selectChar')
on('__cfx_nui:selectChar', (data: any, callback: (...args) => void) => {
    console.log(JSON.stringify(data))
    emitNet('ft-base:selectChar', data.charID)
    callback({});
});

onNet('ft-base:loadedCharacters', (characters: any) => {
  SendNuiMessage(JSON.stringify({ app: 'charSelect', type: 'characters', characters: characters}));
});

RegisterCommand("nuiq", () => {
  SetNuiFocus(false, false);
}, false)