import { OpenApp, App } from "./lib/nuiLib";

enum Controls {
	menu = "ft-controls:menu",
	inventory = "ft-controls:inventory"
}

RegisterKeyMapping(Controls.menu, "Open Menu", "keyboard", "f1");
RegisterCommand(Controls.menu, () => {
	OpenApp(App.menu);
}, false);

RegisterKeyMapping(Controls.inventory, "Inventory", "keyboard", "f2");
RegisterCommand(Controls.inventory, () => {
	OpenApp(App.inventory);
}, false);