export interface ICharacter {
	id: number;
	player_discord: string;
	first_name: string;
	last_name: string;
	dob?: Date,
	address: string
	cash: number;
	bank: number;
}

export interface IPlayer {
	id: number;
	steam: string;
	discord: string;
	is_admin: boolean;
	is_dev: boolean;
}

export enum InventoryType {
	player = "Player",
	storage = "Storage"
}

export interface IInventory {
	id: number;
	name: string;
	type: InventoryType;
	char_id: number;
	storage_key: string;
	contents: string;
}

export interface IItem {
	id: number;
	key: string;
	name: string;
	weight: number;
	max_stack: number;
	usable: boolean;
}

export interface IInventorySlot {
	item: IItem;
	quantity: number;
}

export interface IInventoryData {
	contents: IInventorySlot[];
	invData: IInventory;
}