import { inventory, item } from "../../shared/interfaces";
import { execute } from "./sql";

export interface InventoryItem {
	item: item;
	quantity: number;
}

export class Inventory {
	contents: InventoryItem[];
	invData: inventory;

	constructor(inventoryData: inventory) {
		this.invData = inventoryData;
		this.contents = JSON.parse(inventoryData.contents);
	}

	addItem(item: item, quantity = 1): void {
		let quantityToAdd = quantity;
		for (let i = 0; i < this.contents.length; i++) {
			const invItem = this.contents[i];
			if (invItem.item.key === item.key && invItem.quantity < invItem.item.max_stack) {
				if (invItem.quantity + quantityToAdd <= item.max_stack) {
					// Can all fit into this item
					this.contents[i] = { item: item, quantity: invItem.quantity + quantityToAdd };
					break;
				} else {
					// Cannot all fit into this item
					const numToAdd = item.max_stack - invItem.quantity;
					this.contents[i] = { item: item, quantity: invItem.quantity + numToAdd};
					quantityToAdd = quantityToAdd - numToAdd;
				}
			}
		}
		if (quantityToAdd > 0) {
			this.contents.push({ item: item, quantity: quantityToAdd});
		}
		this.save();
	}

	itemCount(itemkey: string): number {
		let count = 0;
		for (let i = 0; i < this.contents.length; i++) {
			const invItem = this.contents[i];
			if (invItem.item.key === itemkey) {
				count = count + invItem.quantity;
			}
		}
		return count;
	}

	removeItem(itemkey: string, quantity = 1): boolean {
		let quantityToRemove = quantity;
		for (let i = 0; i < this.contents.length; i++) {
			const invItem = this.contents[i];
			if (invItem.item.key === itemkey) {
				if (invItem.quantity > quantityToRemove) {
					// Have extra in this stack, remove from stack and quit
					this.contents[i] = { item: invItem.item, quantity: invItem.quantity - quantityToRemove};
					this.save();
					return true;
				} else {
					// Have exactly enough in stack or not enough, remove from stack and keep going through loop if there's any left
					this.contents.splice(i, 1);
					quantityToRemove = quantityToRemove - invItem.quantity;
				}
				if (quantityToRemove <= 0) {
					this.save();
					return true;
				}
			}
		}
		if (quantityToRemove > 0) {
			return false;
		}
		this.save();
	}

	save(): void {
		execute("UPDATE inventories SET contents = ? WHERE id = ?", [JSON.stringify(this.contents), this.invData.id]);
	}
}