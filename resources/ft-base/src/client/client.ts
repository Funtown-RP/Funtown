const debug = true;
import { character } from "../shared/interfaces"

let currentChar: character = undefined;

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

on('playerSpawned', () => {
  if (!currentChar) {
    SendNuiMessage(JSON.stringify({ type: 'open', app: 'charSelect', forceChoice: true}))
    SetNuiFocus(true, true);
  }
});

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

onNet("ft-base:selectNewChar", (char: character) => {
  currentChar = char;
  emitNet('cui_character:requestCharData', currentChar, true)
  emit('cui_character:open', ['identity', 'features', 'style', 'apparel' ])
});

RegisterNuiCallbackType('selectChar')
on('__cfx_nui:selectChar', (data: any, callback: (...args) => void) => {
    currentChar = data as character;
    emitNet('cui_character:requestCharData', currentChar, false)
    callback({});
});

RegisterNuiCallbackType('newChar')
on('__cfx_nui:newChar', (data: any, callback: (...args) => void) => {
    emitNet('ft-base:newChar', data)
    callback({});
});

onNet('ft-base:loadedCharacters', (characters: any) => {
  SendNuiMessage(JSON.stringify({ app: 'charSelect', type: 'characters', characters: characters}));
});

global.exports('currentChar', () => {return currentChar});

RegisterCommand("nuiq", () => {
  SetNuiFocus(false, false);
}, false)