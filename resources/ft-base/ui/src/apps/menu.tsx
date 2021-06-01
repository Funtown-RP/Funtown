import { Container, MenuItem, MenuList, Paper } from "@material-ui/core";
import React from "react";
import { CharSelect } from "./charSelect";
import { SendMessage } from "../lib/nui";
import { DebugScreen } from "./debug";

enum State {
	closed,
	main,
	charSelect,
	debug
}

interface MenuState {
	state: State;
	forceChoice?: boolean;
}

export class Menu extends React.Component<any, MenuState> {

	constructor(props: any) {
		super(props);
		this.state = { state: State.closed };

		this.Menu = this.Menu.bind(this);
		this.OpenMenuIfNoResponse = this.OpenMenuIfNoResponse.bind(this);
		this.CloseApp = this.CloseApp.bind(this);

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
		return <Container style={{width: 'auto'}} >
			<Paper style={{padding: "12px", margin: "16px"}}>
				<MenuList  >
					<MenuItem style={{ justifyContent: 'center', display: 'flex' }} 
						onClick={() => this.setState({ state: State.charSelect, forceChoice: false})}>Character Select</MenuItem>
					<MenuItem style={{ justifyContent: 'center', display: 'flex' }} 
						onClick={() => this.setState({ state: State.debug})}>Debug</MenuItem>
					<MenuItem style={{ justifyContent: 'center', display: 'flex' }}
						onClick={() => this.CloseApp()}>Close</MenuItem>
				</MenuList>
			</Paper>
		</Container>
	}

	CloseApp() {
		this.setState({state: State.closed});
		this.Unfocus();
	}

	Unfocus() {
		SendMessage("ui","close");
	}

	OpenMenuIfNoResponse() {
		return Promise.race([
			new Promise<boolean>((resolve: any) => { const wait = setTimeout(() => { clearTimeout(wait); resolve(true); }, 500) }),
			SendMessage("debug","test")
		]).then((response: any) => { 
			if (response === true) {
				// timed out
				this.setState({ state: State.main });
			}
		});
	}

  	render() {
		switch (this.state?.state) {
			case State.charSelect:
				return <CharSelect close={() => this.CloseApp()} forceChoice={!!this.state.forceChoice} />;
			case State.main:
				return <this.Menu />;
			case State.debug:
				return <DebugScreen close={() => this.CloseApp()} />;
			default:
				this.OpenMenuIfNoResponse();
				return <div></div>;
	  	}
  	}
}