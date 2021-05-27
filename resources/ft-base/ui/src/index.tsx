import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Container, MenuItem, MenuList, Paper } from '@material-ui/core';
import { CharSelect } from './apps/charSelect';

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
		return <Container maxWidth="xs" ><Paper >
			<MenuList>
				<MenuItem onClick={() => this.setState({ state: State.charSelect})}>Character Select</MenuItem>
				<MenuItem onClick={() => this.CloseApp()}>Close</MenuItem>
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

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);