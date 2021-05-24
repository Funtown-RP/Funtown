import { Cache, ArrayCache } from "../lib/sql"

export interface character {
	id: number;
	player_discord: string;
	first_name: string;
	last_name: string;
}

const charactersId = new Cache<character>("characters", "id");
const charactersDiscord = new ArrayCache<character>("characters", "player_discord");

export async function GetCharacters(discord: string): Promise<character[]> {
	return await charactersDiscord.get(discord);
}

export async function GetCharacter(characterID: string): Promise<character> {
	return await charactersId.get(characterID);
}

export function CharacterChanged(discord: string): void {
	charactersId.changed(charactersDiscord[discord].id)
	charactersDiscord.changed(discord);
}