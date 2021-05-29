import { OpenApp, App } from "./lib/nuiLib";

enum Controls {
	menu = "ft-controls:menu"
}

RegisterKeyMapping(Controls.menu, "Open Menu", "keyboard", "f1");

RegisterCommand(Controls.menu, () => {
	OpenApp(App.menu);
}, false);