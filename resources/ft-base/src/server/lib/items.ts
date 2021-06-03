import { TableCache } from "../lib/sql";
import { IItem } from "../../shared/interfaces";

export class Items {
	static items = new TableCache<IItem>("items");
	static itemDict: Record<string, IItem> = {};
	
	private static tryBuildDict(): void {
		if (this.items.isLoaded) {
			this.itemDict = {};
			const rows = this.items.Rows();
			for (const item of rows) {
				this.itemDict[item.key] = item;
			}	
		} else {
			setTimeout(this.tryBuildDict, 100);
		}
	}
		
	static GetItems(): Array<IItem> {
		if (this.items.Rows().length === 0) {
			this.items.Refresh().then(this.tryBuildDict);
			console.error("uh oh, no items found");
		}
		return this.items.Rows();
	}
	
	static GetItem(itemKey: string): IItem {
		if (!this.itemDict) {
			console.error("Tried to get an item but the item definition dictionary is empty");
			this.tryBuildDict();
		}
		return this.itemDict[itemKey];
	}
	
}


