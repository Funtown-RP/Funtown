import { TableCache } from "../lib/sql";
import { IItem } from "../../shared/interfaces";

export class Items {
	static items = new TableCache<IItem>("items");
	static itemDict: Record<string, IItem> = {};
	
	static tryBuildDict(): void {
		if (this.items.isLoaded) {
			this.itemDict = {};
			const rows = this.items.rows();
			for (const item of rows) {
				this.itemDict[item.key] = item;
			}	
		} else {
			setTimeout(this.tryBuildDict, 100);
		}
	}
		
	static GetItems(): Array<IItem> {
		if (this.items.rows().length === 0) {
			this.items.refresh().then(this.tryBuildDict);
			console.error("uh oh, no items found");
		}
		return this.items.rows();
	}
	
	static GetItem(itemKey: string): IItem {
		if (!this.itemDict) {
			console.error("Tried to get an item but the item definition dictionary is empty");
			this.tryBuildDict();
		}
		return this.itemDict[itemKey];
	}
	
}


