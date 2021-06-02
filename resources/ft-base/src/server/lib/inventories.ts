import { ICharacter, IInventory } from "../../shared/interfaces";
import { Inventory, InventoryItem } from "./inventory";
import { Cache, ICache, execute } from "./sql";

const playerInventories = new Cache<IInventory>("inventories", "char_id");
const playerInventoryContents: ICache<Inventory> = {};

export async function getInventory(charId: number): Promise<Inventory> {
	if (!playerInventoryContents[charId.toString()]) {
		const invData = await playerInventories.get(charId.toString());
		const inv = new Inventory(invData);
		playerInventoryContents[charId] = inv;
		return inv;
	} else {
		return playerInventoryContents[charId.toString()];
	}
}

export function CreateInventoryIfNotExists(char: ICharacter): void {
	const emptyInv: InventoryItem[] = [];
	execute("INSERT IGNORE INTO inventories (name, type, char_id, contents) VALUES (?, 'Player', ?, ?)", [`Char ${char.id}'s inventory`, char.id, JSON.stringify(emptyInv)]);
}