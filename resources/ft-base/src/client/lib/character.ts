import { ICharacter } from "../../shared/interfaces";
import FTEvent from "../../shared/events";
import { AllItems } from "../items";

export class Character {
	static currentCharacter: ICharacter = undefined;
	static gamertag = -1;

	static CurrentChar(): ICharacter {
		return Character.currentCharacter;
	}

	static SetCurrentChar(char: ICharacter): void {
		Character.currentCharacter = char;
	}

	static SelectChar(char: ICharacter, isNew: boolean): void {
		this.SetCurrentChar(char);
		emitNet(FTEvent.loadCharSkin, char, isNew);
		emitNet(FTEvent.serverCharSelected, char);
		if (isNew) {
			emit(FTEvent.openCharCustomization, ["identity", "features", "style", "apparel"]);
		}
		
		const allItems = AllItems();
		if (allItems.length === 0) {
			// this helps debugging, don't have to reconnect to server to get items
			emitNet(FTEvent.getItemDefinitions);
		}
	}

	static UpdateGamertag(): void {
		if (!Character.gamertag) {
			RemoveMpGamerTag(Character.gamertag);
		}
		const curChar = this.CurrentChar();
		if (!curChar) {
			return;
		}
		Character.gamertag = CreateFakeMpGamerTag(PlayerPedId(), `[${curChar.id}] ${curChar.first_name} ${curChar.last_name}`, false, false, "", 0);
		SetMpGamerTagVisibility(Character.gamertag, 0, true);
		SetMpGamerTagAlpha(Character.gamertag, 0, 200);
		setTimeout(() => {
			SetMpGamerTagVisibility(Character.gamertag, 0, false);
		}, 2500);
	}
}
