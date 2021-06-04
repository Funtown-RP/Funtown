import { ICharacter, IInventory, IInventoryItem } from "../../shared/interfaces";
import { Inventory } from "./inventory";
import { Cache, ICache, execute } from "./sql";

export class Inventories {
	static playerInventories = new Cache<IInventory>("inventories", "char_id");
	static playerInventoryContents: ICache<Inventory> = {};

	static async GetInventory(char: ICharacter): Promise<Inventory> {
		if (!this.playerInventoryContents[char.id.toString()]) {
			const invData = await this.playerInventories.Get(char.id.toString());
			if (!invData) {
				console.error("Error getting inventory data");
			}
			const inv = new Inventory(invData);
			this.playerInventoryContents[char.id] = inv;
			return inv;
		} else {
			return this.playerInventoryContents[char.id.toString()];
		}
	}
	
	static CreateInventoryIfNotExists(char: ICharacter): void {
		const emptyInv: IInventoryItem[] = [];
		execute("INSERT IGNORE INTO inventories (name, type, char_id, contents) VALUES (?, 'Player', ?, ?)", [`Char ${char.id}'s inventory`, char.id, JSON.stringify(emptyInv)]);
	}

	static InventoryChanged(char: ICharacter): void {
		delete this.playerInventoryContents[char.id.toString()];
	}
}


