import { Cache } from "../lib/sql";
import { GetPlayerIdentifiers } from "../lib/identifiers";
import { IPlayer } from "../../shared/interfaces";

export class Players {
	static players = new Cache<IPlayer>("players", "discord");

	static async GetPlayerSrc(src: string): Promise<IPlayer> {
		const discord = GetPlayerIdentifiers(src).discord;
		if (discord.length > 0) {
			return this.GetPlayer(discord);
		}
	}
	
	static async GetPlayer(discord: string): Promise<IPlayer> {
		return this.players.get(discord);
	}
	
	static PlayerChanged(discord: string): void {
		this.players.changed(discord);
	}
}



