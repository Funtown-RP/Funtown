import { ICharacter, IInventory } from "../../shared/interfaces";
import { Inventory, IInventoryItem } from "./inventory";
import { Cache, ICache, execute } from "./sql";

export class Inventories {
	static playerInventories = new Cache<IInventory>("inventories", "char_id");
	static playerInventoryContents: ICache<Inventory> = {};

	static async GetInventory(charId: number): Promise<Inventory> {
		if (!this.playerInventoryContents[charId.toString()]) {
			const invData = await this.playerInventories.Get(charId.toString());
			const inv = new Inventory(invData);
			this.playerInventoryContents[charId] = inv;
			return inv;
		} else {
			return this.playerInventoryContents[charId.toString()];
		}
	}
	
	static CreateInventoryIfNotExists(char: ICharacter): void {
		const emptyInv: IInventoryItem[] = [];
		execute("INSERT IGNORE INTO inventories (name, type, char_id, contents) VALUES (?, 'Player', ?, ?)", [`Char ${char.id}'s inventory`, char.id, JSON.stringify(emptyInv)]);
	}
}


