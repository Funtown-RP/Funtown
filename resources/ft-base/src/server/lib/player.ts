import { Cache } from "../lib/sql";
import { GetPlayerIdentifiers } from "../lib/identifiers";
import { IPlayer } from "../../shared/interfaces";

const players = new Cache<IPlayer>("players", "discord");

export async function GetPlayerSrc(src: string): Promise<IPlayer> {
	const discord = GetPlayerIdentifiers(src).discord;
	if (discord.length > 0) {
		return GetPlayer(discord);
	}
}

export async function GetPlayer(discord: string): Promise<IPlayer> {
	return players.get(discord);
}

export function PlayerChanged(discord: string): void {
	players.changed(discord);
}
