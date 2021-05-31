import { item } from "../shared/interfaces";
import Event from "../shared/events";

let items: Array<item> = [];
const itemDict: Record<string, item> = {};

onNet(Event.itemDefinitions, (itemDefs: item[]) => {
	items = itemDefs;
	for (const item of items) {
		itemDict[item.key] = item;
	}	

	console.log(JSON.stringify(items), JSON.stringify(itemDict));
});

export function GetItem(key: string): item {
	return itemDict[key];
}

export function AllItems(): Array<item> {
	return items;
}