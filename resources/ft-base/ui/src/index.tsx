import React from 'react';
import ReactDOM from 'react-dom';
import { Container, createMuiTheme, MenuItem, MenuList, Paper, ThemeProvider } from '@material-ui/core';
import { CharSelect } from './apps/charSelect';
import { Loadscreen } from "./apps/loadscreen";
import './index.scss'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

enum State {
	closed,
	main,
	charSelect
}

interface MainState {
	state: State;
	forceChoice?: boolean;
}

class Main extends React.Component<any, MainState> {

	constructor(props: any) {
		super(props);
		this.state = { state: State.closed };

		window.addEventListener('message', (event) => {
			if (event.data.type === "open") {
				if (event.data.app === "main") {
					this.setState({ state: State.main});
				} else if (event.data.app === 'charSelect') {
					this.setState({ state: State.charSelect, forceChoice: !!event.data.forceChoice });
				}
			}
		});
	}

	Menu() {
		return <Container style={{width: 'auto'}} ><Paper >
			<MenuList  >
				<MenuItem style={{ justifyContent: 'center', display: 'flex' }} 
					onClick={() => this.setState({ state: State.charSelect, forceChoice: false})}>Character Select</MenuItem>
				<MenuItem style={{ justifyContent: 'center', display: 'flex' }}
					onClick={() => this.CloseApp()}>Close</MenuItem>
			</MenuList>
		</Paper></Container>
	}

	CloseApp() {
		this.setState({state: State.closed});
		this.Unfocus();
	}

	Unfocus() {
		fetch(`https://ft-base/close`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({})
		})
	}

	OpenMenuIfNoResponse() {
		return Promise.race([
			new Promise<boolean>((resolve: any) => { const wait = setTimeout(() => { clearTimeout(wait); resolve(true); }, 500) }),
			fetch(`https://ft-base/debug:test`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json; charset=UTF-8',
					},
					body: JSON.stringify({})
				})
		]).then((response: any) => { 
			if (response === true) {
				// timed out
				this.setState({ state: State.main});
			}
		});
	}

  	render() {
	  	if (this.state?.state === State.charSelect) {
			return <CharSelect close={() => this.CloseApp()} forceChoice={!!this.state.forceChoice} />
	  	} else if (this.state?.state === State.main) {
		  	// Main menu
			return this.Menu();
	  	} else {
		  	// Closed
			this.OpenMenuIfNoResponse();
			return <div></div>;
	  	}
  	}
}
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
					<Main />
				</Route>
			</Switch>
		</Router>
	</ThemeProvider>,
  document.getElementById('root')
);