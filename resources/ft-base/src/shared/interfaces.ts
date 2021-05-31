export interface character {
	id: number;
	player_discord: string;
	first_name: string;
	last_name: string;
	dob?: Date,
	address: string
	cash: number;
	bank: number;
}

export interface player {
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

export interface inventory {
	id: number;
	name: string;
	type: InventoryType;
	char_id: number;
	storage_key: string;
	contents: string;
}

export interface item {
	id: number;
	key: string;
	name: string;
	weight: number;
	max_stack: number;
}