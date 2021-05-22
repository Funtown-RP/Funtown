"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ghmattimysql = __importStar(require("./ghmattimysql"));
onNet('ft-core:tpm', () => {
    console.log(`TPM from ${source}`);
});
onNet('playerConnecting', () => {
    const src = source;
    let steam = "";
    let discord = "";
    for (let i = 0; i < GetNumPlayerIdentifiers(src); i++) {
        const identifier = GetPlayerIdentifier(src, i);
        if (identifier.startsWith('steam')) {
            steam = identifier;
            console.log('steam found');
        }
        else if (identifier.startsWith('discord')) {
            discord = identifier;
            console.log('discord found');
        }
        console.log(identifier);
    }
    exports.ghmattimysql.execute("INSERT INTO players (steam, discord) VALUES (?, ?) ON DUPLICATE KEY UPDATE steam = ?", [steam, discord, steam]);
});
RegisterCommand("sql", (source) => {
    const src = source;
    let steam = "";
    let discord = "";
    for (let i = 0; i < GetNumPlayerIdentifiers(src); i++) {
        const identifier = GetPlayerIdentifier(src, i);
        if (identifier.startsWith('steam')) {
            steam = identifier;
            console.log('steam found');
        }
        else if (identifier.startsWith('discord')) {
            discord = identifier;
            console.log('discord found');
        }
    }
    console.log(steam, discord);
    ghmattimysql.execute("INSERT INTO `players` (`steam`,`discord`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `steam` = ?", [steam, discord, steam], (result) => {
        console.log('returned from db');
        console.log(JSON.stringify(result));
    });
    console.log('trying to select');
    ghmattimysql.execute("SELECT * FROM player_skins", [], (result) => {
        setImmediate(() => {
            console.log('returned from db');
            console.log(JSON.stringify(result));
        });
    });
}, false);
