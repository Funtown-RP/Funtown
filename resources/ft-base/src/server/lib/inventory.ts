import { IInventory, IInventorySlot, IItem, IInventoryData } from "../../shared/interfaces";
import { execute } from "./sql";
import { Items } from "./items";

export class Inventory implements IInventoryData {
	contents: IInventorySlot[];
	invData: IInventory;

	constructor(inventoryData: IInventory) {
		this.invData = inventoryData;
		this.contents = JSON.parse(inventoryData.contents);
		this.UpdateItemDefs().then((shouldSave: boolean) => {
			if (shouldSave) {
				this.Save();
			}
		});
	}

	async UpdateItemDefs(): Promise<boolean> {
		let changed = false;
		for (let i = 0; i < this.contents.length; i++) {
			await Items.GetItem(this.contents[i].item.key).then((itemDef) => {
				if (this.contents[i].item !== itemDef) {
					this.contents[i].item = itemDef;
					changed = true;
				}
			});
		}
		return changed;
	}

	async AddItem(item: IItem, quantity = 1): Promise<void> {
		let quantityToAdd = quantity;
		for (let i = 0; i < this.contents.length; i++) {
			const invItem = this.contents[i];
			if (!invItem?.item?.key) {
				continue;
			}
			if (invItem.item.key === item.key && invItem.quantity < invItem.item.max_stack) {
				if (invItem.quantity + quantityToAdd <= item.max_stack) {
					// Can all fit into this item
					this.contents[i] = { item: item, quantity: invItem.quantity + quantityToAdd };
					quantityToAdd = 0;
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
		this.Save();
		return;
	}

	ItemCount(itemkey: string): number {
		let count = 0;
		for (let i = 0; i < this.contents.length; i++) {
			const invItem = this.contents[i];
			if (invItem.item.key === itemkey) {
				count = count + invItem.quantity;
			}
		}
		return count;
	}

	RemoveItem(itemkey: string, quantity = 1): boolean {
		let quantityToRemove = quantity;
		for (let i = 0; i < this.contents.length; i++) {
			const invItem = this.contents[i];
			if (invItem.item.key === itemkey) {
				if (invItem.quantity > quantityToRemove) {
					// Have extra in this stack, remove from stack and quit
					this.contents[i] = { item: invItem.item, quantity: invItem.quantity - quantityToRemove};
					this.Save();
					return true;
				} else {
					// Have exactly enough in stack or not enough, remove from stack and keep going through loop if there's any left
					this.contents.splice(i, 1);
					quantityToRemove = quantityToRemove - invItem.quantity;
				}
				if (quantityToRemove <= 0) {
					this.Save();
					return true;
				}
			}
		}
		if (quantityToRemove > 0) {
			return false;
		}
		this.Save();
	}

	Save(): void {
		execute("UPDATE inventories SET contents = ? WHERE id = ?", [JSON.stringify(this.contents), this.invData.id]);
	}
}