import React from "react";
import * as ReactDOM from "react-dom/client";
import { createTheme, ThemeProvider } from "@material-ui/core";
import { Loadscreen } from "./apps/loadscreen";
import "./index.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Menu } from "./apps/menu";

// ========================================
const theme = createTheme({
	spacing: 4,
	palette: {
		type: "dark",
		primary: {
			light: "#b2fab4",
			main: "#81c784",
			dark: "#1c519657313a",
			contrastText: "#000",
		},
		secondary: {
			light: "#ffa4a2",
			main: "#e57373",
			dark: "#af4448",
			contrastText: "#000",
		},
	},
});

const container = document.getElementById("root");
if (container) {
	const root = ReactDOM.createRoot(container);
	root.render(
		<ThemeProvider theme={theme}>
			<Router>
				<Routes>
					<Route path="/loadscreen" element={<Loadscreen />} />
					<Route path="/" element={<Menu />} />
				</Routes>
			</Router>
		</ThemeProvider>
	);
}

