import { item } from "../shared/interfaces";
import Event from "../shared/events";

let items: Array<item> = [];
let itemDict: Record<string, item> = {};

onNet(Event.itemDefinitions, (itemDefs: item[]) => {
	items = itemDefs;
	itemDict = {};
	for (const item of items) {
		itemDict[item.key] = item;
	}	

	console.log(JSON.stringify(items));
	console.log(JSON.stringify(itemDict));
});

export function GetItem(key: string): item {
	return itemDict[key];
}

export function AllItems(): Array<item> {
	return items;
}