import { TableCache } from "../lib/sql";
import { item } from "../../shared/interfaces";

const items = new TableCache<item>("items");
const itemDict: Record<string, item> = {};

function tryBuildDict() {
	if (items.isLoaded) {
		const itemDict: Record<string, item> = {};
		for (const item of items.rows()) {
			itemDict[item.key] = item;
		}	
	} else {
		setTimeout(tryBuildDict, 100);
	}
}

setTimeout(tryBuildDict, 100);

export function GetItems(): Array<item> {
	if (items.rows().length === 0) {
		items.refresh().then(tryBuildDict);
		console.error("uh oh, no items found");
	}
	return items.rows();
}

export async function GetItem(itemKey: string): Promise<item> {
	return itemDict[itemKey];
}

