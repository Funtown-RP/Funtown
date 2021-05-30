import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { Loadscreen } from "./apps/loadscreen";
import './index.scss'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Menu } from "./apps/menu";

// ========================================
const theme = createMuiTheme({
	spacing: 4,
	palette: {
		type: 'dark',
		primary: {
		  light: '#b2fab4',
		  main: '#81c784',
		  dark: '#1c519657313a',
		  contrastText: '#000',
		},
		secondary: {
		  light: '#ffa4a2',
		  main: '#e57373',
		  dark: '#af4448',
			contrastText: '#000',
		},
	},
})

ReactDOM.render(
	<ThemeProvider theme={theme}>
		<Router>
			<Switch>
				<Route path="/loadscreen">
					<Loadscreen />
				</Route>
				<Route path="/">
					<Menu />
				</Route>
			</Switch>
		</Router>
	</ThemeProvider>,
  document.getElementById('root')
);