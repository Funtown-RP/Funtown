import { TableCache } from "../lib/sql";
import { IItem } from "../../shared/interfaces";

export class Items {
	static items = new TableCache<IItem>("items");
	static itemDict: Record<string, IItem> = {};
	
	private static async tryBuildDict(): Promise<void> {
		if (this.items.Rows().length === 0) {
			await this.items.Refresh();
		}
		this.itemDict = {};
		const rows = this.items.Rows();
		for (const item of rows) {
			
			this.itemDict[item.key] = item;
		}
	}
		
	static GetItems(): Array<IItem> {
		if (this.items.Rows().length === 0) {
			this.items.Refresh().then(this.tryBuildDict);
			console.error("uh oh, no items found");
		}
		return this.items.Rows();
	}
	
	static async GetItem(itemKey: string): Promise<IItem> {
		if (this.items.Rows().length === 0 ||  Object.keys(this.itemDict).length === 0) {
			await this.items.Refresh();
			await this.tryBuildDict();
		}
		return this.itemDict[itemKey];
	}
	
}


