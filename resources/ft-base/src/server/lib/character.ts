import { Cache, ArrayCache, execute } from "./sql";
import { ICharacter } from "../../shared/interfaces";
import FTEvent from "../../shared/events";

export class Characters {
	charactersId = new Cache<ICharacter>("characters", "id");
	charactersDiscord = new ArrayCache<ICharacter>("characters", "player_discord");
	currentCharacters: {[src: string]: ICharacter} = {};

	CharSelected(src: string, char: ICharacter): void {
		this.currentCharacters[src] = char;
	}
	
	async GetCharacters(discord: string): Promise<ICharacter[]> {
		return await this.charactersDiscord.get(discord);
	}
	
	async GetCharacter(characterID: string | number): Promise<ICharacter> {
		return await this.charactersId.get(characterID.toString());
	}
	
	GetCurrentCharacter(src: string): ICharacter {
		return this.currentCharacters[src];
	}
	
	GetCharacterSrc(char: ICharacter): string {
		for (const src in this.currentCharacters) {
			if (this.currentCharacters[src]?.id === char.id) {
				return src;
			}
		}
		return "";
	}
	
	/**
	 * Mark a character as having changed
	 */
	async CharacterChanged(discord: string): Promise<void> {
		const characters = await this.charactersDiscord.get(discord);
		for (const character of characters) {
			this.charactersId.changed(character.id.toString());
	
			const src = this.GetCharacterSrc(character);
			const curChar = this.GetCurrentCharacter(src);
			if (src !== "" && !curChar || (curChar.id === character.id)) {
				this.GetCharacter(character.id).then((updatedChar: ICharacter) => {
					emitNet(FTEvent.characterUpdated, src, updatedChar);
				});
			}
		}
	}
	
	async NewCharacter(src: string, discord: string, firstName: string, lastName: string, dob: Date): Promise<void> {
		this.charactersDiscord.changed(discord);
		execute("INSERT INTO characters (player_discord, first_name, last_name, dob) VALUES (?, ?, ?, ?)", [discord, firstName, lastName, dob.toISOString().slice(0, 19).replace("T", " ")], async (result) => {
			this.charactersDiscord.changed(discord);
			const newChar = await this.GetCharacter(result.insertId);
			emitNet(FTEvent.selectedNewChar, src, newChar);
		});
	}
	
	AddCash(char: ICharacter, amount: number): void {
		execute("UPDATE characters SET cash = cash + ? WHERE id = ?", [amount, char.id], () => {
			this.CharacterChanged(char.player_discord);
		});
	}
	
	RemoveCash(char: ICharacter, amount: number): void {
		execute("UPDATE characters SET cash = cash - ? WHERE id = ?", [amount, char.id], () => {
			this.CharacterChanged(char.player_discord);
		});
	}
	
	Withdraw(char: ICharacter, amount: number): void {
		execute("UPDATE characters SET cash = cash + ?, bank = bank - ? WHERE id = ?", [amount, amount, char.id], () => {
			this.CharacterChanged(char.player_discord);
		});
	}
	
	Deposit(char: ICharacter, amount: number): void {
		execute("UPDATE characters SET cash = cash - ?, bank = bank + ? WHERE id = ?", [amount, amount, char.id], () => {
			this.CharacterChanged(char.player_discord);
		});
	}
}