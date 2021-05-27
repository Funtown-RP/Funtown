import { NUIEvent } from "./nuiEvents";

export function onNui(nuiEvent: NUIEvent, handler: (data: any) => any): void {
	RegisterNuiCallbackType(nuiEvent);
	on(`__cfx_nui:${nuiEvent}`, (data, callback) => {
		callback(handler(data));
	});
}

export function Focus(cursor = true): void {
	SetNuiFocus(true, cursor);
}

export function Unfocus(): void {
	SetNuiFocus(false, false);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function SendMessage(app: string, type: string, data?: any): void {
	const message = { app: app, type: type, ...data };
	SendNuiMessage(JSON.stringify(message));
}