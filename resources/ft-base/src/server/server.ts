import { GetPlayerIdentifiers } from "./lib/identifiers";
import * as players from "./lib/player";
import * as characters from "./lib/character";
import * as sql from "./lib/sql";
import { character } from "../shared/interfaces";
import Event from "../shared/events";

onNet(Event.tpm, () => {
	console.log(`TPM by ${source}`);
});

onNet(Event.playerConnecting, () => {
	insertOrUpdatePlayer(source);
});

function insertOrUpdatePlayer (src: string) {
	const identifiers = GetPlayerIdentifiers(src);
	sql.execute("INSERT INTO `players` (`steam`,`discord`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `steam` = ?", [identifiers.steam, identifiers.discord, identifiers.steam], () => {
		players.PlayerChanged(identifiers.discord);
	});
}

onNet(Event.serverLoadCharacters, () => {
	const src = source;
	characters.GetCharacters(GetPlayerIdentifiers(src).discord).then((chars) => {
		emitNet(Event.loadedCharacters, src, chars);
	});
});

onNet(Event.serverCharSelected, (char: character) => {
	const src = source;
	characters.CharSelected(src, char);
	console.log(`Client ${src} [${char.player_discord}] is now [${char.id}] ${char.first_name} ${char.last_name}.`);
});

onNet(Event.serverNewChar, (data) => {
	const src = source;
	const firstName = data.firstName || "First";
	const lastName = data.lastName || "Last";
	const dob = new Date(data.dob);
	characters.NewCharacter(src, GetPlayerIdentifiers(src).discord, firstName, lastName, dob);
});