import { IItem } from "../shared/interfaces";
import FTEvent from "../shared/events";

let items: Array<IItem> = [];
let itemDict: Record<string, IItem> = {};

onNet(FTEvent.itemDefinitions, (itemDefs: IItem[]) => {
	items = itemDefs;
	itemDict = {};
	for (const item of items) {
		itemDict[item.key] = item;
	}	
});

export function GetItem(key: string): IItem {
	return itemDict[key];
}

export function AllItems(): Array<IItem> {
	return items;
}