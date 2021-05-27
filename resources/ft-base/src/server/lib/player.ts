import { Cache } from "../lib/sql";
import { GetPlayerIdentifiers } from "../lib/identifiers";
import { player } from "../../shared/interfaces";

const players = new Cache<player>("players", "discord");

export async function GetPlayerSrc(src: string): Promise<player> {
	const discord = GetPlayerIdentifiers(src).discord;
	if (discord.length > 0) {
		return await GetPlayer(discord);
	}
}

export async function GetPlayer(discord: string): Promise<player> {
	return await players.get(discord);
}

export function PlayerChanged(discord: string): void {
	players.changed(discord);
}
