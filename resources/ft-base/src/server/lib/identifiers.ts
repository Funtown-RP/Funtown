export interface identifiers {
	steam: string;
	discord: string;
}

export function GetPlayerIdentifiers(src: string): identifiers {
	let discord = "";
	let steam = "";

	for (let i = 0; i < GetNumPlayerIdentifiers(src); i++) {
		const identifier = GetPlayerIdentifier(src, i);

		if (identifier.startsWith('discord')) {
			discord = identifier;
		}

		if (identifier.startsWith('steam')) {
			steam = identifier;
		}
	}
	return { discord: discord, steam: steam };
}

export enum webapp {
	charSelect = "charSelect",
}