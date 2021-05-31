import { TableCache } from "../lib/sql";
import { item } from "../../shared/interfaces";

const items = new TableCache<item>("items");
let itemDict: Record<string, item> = {};

function tryBuildDict() {
	if (items.isLoaded) {
		itemDict = {};
		const rows = items.rows();
		for (const item of rows) {
			itemDict[item.key] = item;
		}	
		console.log(JSON.stringify(itemDict));
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

export function GetItem(itemKey: string): item {
	if (!itemDict) {
		console.error("Tried to get an item but the item definition dictionary is empty");
		tryBuildDict();
	}
	return itemDict[itemKey];
}

