import { Cache, ArrayCache, execute } from "../lib/sql"
import { character } from "../../shared/interfaces"

const charactersId = new Cache<character>("characters", "id");
const charactersDiscord = new ArrayCache<character>("characters", "player_discord");
const currentCharacters: {[src: string]: character} = {};

export function CharSelected(src: string, char: character): void {
	currentCharacters[src] = char;
}

export async function GetCharacters(discord: string): Promise<character[]> {
	return await charactersDiscord.get(discord);
}

export async function GetCharacter(characterID: string): Promise<character> {
	return await charactersId.get(characterID);
}

export function GetCurrentCharacter(src: string): character {
	return currentCharacters[src];
}

export async function CharacterChanged(discord: string): Promise<void> {
	const characters = await charactersDiscord.get(discord)
	for (const character of characters) {
		charactersId.changed(character.id.toString());
	}
	
	charactersDiscord.changed(discord);
}

export async function NewCharacter(src: string, discord: string, firstName: string, lastName: string): Promise<void> {
	charactersDiscord.changed(discord);
	execute("INSERT INTO characters (player_discord, first_name, last_name) VALUES (?, ?, ?)", [discord, firstName, lastName], 
		async (result) => {
			charactersDiscord.changed(discord);
			const newChar = await GetCharacter(result.insertId);
			emitNet('ft-base:selectNewChar', src, newChar);
		});
}

export function AddCash(char: character, amount: number): void {
	execute("UPDATE characters SET cash = cash + ? WHERE id = ?", [amount, char.id], () => {
		CharacterChanged(char.player_discord);
	});
}

export function RemoveCash(char: character, amount: number): void {
	execute("UPDATE characters SET cash = cash - ? WHERE id = ?", [amount, char.id], () => {
		CharacterChanged(char.player_discord);
	});
}

export function Withdraw(char: character, amount: number): void {
	execute("UPDATE characters SET cash = cash + ?, bank = bank - ? WHERE id = ?", [amount, amount, char.id], () => {
		CharacterChanged(char.player_discord);
	});
}

export function Deposit(char: character, amount: number): void {
	execute("UPDATE characters SET cash = cash - ?, bank = bank + ? WHERE id = ?", [amount, amount, char.id], () => {
		CharacterChanged(char.player_discord);
	});
}