import { character } from "../../shared/interfaces";

let currentCharacter: character = undefined;

global.exports('currentChar', () => {return currentChar});

export function currentChar(): character {
	return currentCharacter;
}

export function setCurrentChar(char: character): void {
	currentCharacter = char;
}