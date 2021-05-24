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

export async function CharacterChanged(discord: string): Promise<void> {
	const characters = await charactersDiscord.get(discord)
	for (const character of characters) {
		charactersId.changed(character.id.toString());
	}
	
	charactersDiscord.changed(discord);
}