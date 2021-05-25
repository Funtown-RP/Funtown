export interface character {
	id: number;
	player_discord: string;
	first_name: string;
	last_name: string;
	dob?: Date,
	address: string
}

export interface player {
	id: number;
	steam: string;
	discord: string;
	is_admin: boolean;
	is_dev: boolean;
}