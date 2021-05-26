import { character } from "../shared/interfaces"
import { Event } from "../shared/events";
import { currentChar, setCurrentChar} from "./lib/char";

let gamertag = -1;

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
  emitNet(Event.tpm);
}, false)

function TeleportToMarker (): void {
  const marker = GetFirstBlipInfoId(8);
  if (DoesBlipExist(marker)) {
    const markerCoords = GetBlipInfoIdCoord(marker);
    TeleportToCoords(markerCoords[0], markerCoords[1]);
  } else {
    console.log("No marker found.");
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
      SetPedCoordsKeepVehicle(PlayerPedId(), x, y, groundCoords[1]);
      return;
    }
    
  }   
  setTimeout(() => {TeleportFindZ(x, y); }, 100);
}

function UpdateGamertag() {
  if (!gamertag) {
    RemoveMpGamerTag(gamertag);
  }
  const curChar = currentChar();
  gamertag = CreateFakeMpGamerTag(PlayerPedId(), `[${curChar.id}] ${curChar.first_name} ${curChar.last_name}`, false, false, "", 0);
  SetMpGamerTagVisibility(gamertag, 0, true);
  SetMpGamerTagAlpha(gamertag, 0, 200);
  setTimeout(() => { SetMpGamerTagVisibility(gamertag, 0 , false)}, 2500);
}

onNet(Event.characterUpdated, (char: character) => {
  if (currentChar().id === char.id) {
    setCurrentChar(char);
    console.log(`char updated: ${JSON.stringify(currentChar)}`);
  }
})

on(Event.playerSpawned, () => {
  if (!currentChar) {
    SendNuiMessage(JSON.stringify({ type: 'open', app: 'charSelect', forceChoice: true}))
    SetNuiFocus(true, true);
  }
});

on(Event.clientResourceStarted, (resourceName: string) => {
  if (resourceName === GetCurrentResourceName()) {
    setTimeout(() => {
      SendNuiMessage(JSON.stringify({ type: 'open', app: 'charSelect', forceChoice: true}))
      SetNuiFocus(true, true);
    }, 1000);
  }
});

RegisterCommand("debug", (_source: string, _args: Array<any>) => {
  SendNuiMessage(JSON.stringify({ type: 'open', app: 'main'}))
  SetNuiFocus(true, true);
}, false);

RegisterCommand('char', () => {
  const curChar = currentChar();
  console.log(`[${curChar.id}] ${curChar.first_name} ${curChar.last_name}`);
  UpdateGamertag();
}, false);

RegisterNuiCallbackType('close')
on('__cfx_nui:close', (_data, callback) => {
    SetNuiFocus(false, false);
    callback({});
}); 

RegisterNuiCallbackType('getCharacters')
on('__cfx_nui:getCharacters', (_data, callback) => {
    emitNet(Event.serverLoadCharacters)
    callback({});
});

function SelectChar(char: character, isNew: boolean) {
  setCurrentChar(char);
  emitNet(Event.loadCharSkin, currentChar(), isNew);
  emitNet(Event.serverCharSelected, currentChar());
  if (isNew) {
    emit(Event.openCharCustomization, ['identity', 'features', 'style', 'apparel' ])
  }
}

onNet(Event.selectedNewChar, (char: character) => {
  SelectChar(char, true);
});

RegisterNuiCallbackType('selectChar')
on('__cfx_nui:selectChar', (data: any, callback: (...args) => void) => {
    SelectChar(data as character, false);
    callback({});
});

onNet('cui_character:recievePlayerData', () => {
  UpdateGamertag();
})

RegisterNuiCallbackType('newChar')
on('__cfx_nui:newChar', (data: any, callback: (...args) => void) => {
    emitNet(Event.serverNewChar, data)
    callback({});
});

onNet(Event.loadedCharacters, (characters: any) => {
  SendNuiMessage(JSON.stringify({ app: 'charSelect', type: 'characters', characters: characters}));
});

RegisterCommand("nuiq", () => {
  SetNuiFocus(false, false);
}, false)