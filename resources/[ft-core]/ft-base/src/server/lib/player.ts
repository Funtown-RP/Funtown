import * as sql from "./sql"

export interface player {
	id: number;
	steam: string;
	discord: string;
	is_admin: boolean;
	is_dev: boolean;
}

export interface identifiers {
	steam: string;
	discord: string;
}

const players = new sql.Cache<player>("SELECT * FROM players WHERE discord = ?");

export function GetPlayerIdentifiers (src: string): identifiers {
	let discord = "";
	let steam = "";
	for (let i = 0; i < GetNumPlayerIdentifiers(src); i++) {
		const identifier = GetPlayerIdentifier(src, i);
		if (identifier.startsWith('discord')) {
			discord = identifier;
		}
		if (identifier.startsWith('steam')) {
			steam = identifier;
		}
	}
	return { discord: discord, steam: steam };
}

export async function GetPlayerSrc (src: string) {
	const discord = GetPlayerIdentifiers(src).discord;
	if (discord.length > 0) {
		return await GetPlayer(discord);
	}
}

export async function GetPlayer (discord: string): Promise<player> {
	return await players.get(discord);
}

export function PlayerChanged (discord: string): void {
	players.changed(discord);
}