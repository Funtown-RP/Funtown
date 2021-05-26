import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Button, Grid } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import PersonIcon from '@material-ui/icons/Person';
import { CharSelect } from './apps/charSelect';
import { isChrome } from 'react-device-detect'

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
		return <Grid container direction="column" alignItems="flex-start" spacing={2} >
				<Grid item>
					<Button variant="contained" color="primary" endIcon={<PersonIcon />} onClick={() => this.setState({ state: State.charSelect})} >Character Select</Button>
				</Grid>
				
				<Grid item>
					<Button variant="contained" color="secondary" endIcon={<CloseIcon />} onClick={() => this.CloseApp()} >Close</Button>
				</Grid>
			</Grid>
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

  	render() {
	  	if (this.state?.state === State.charSelect) {
			return <CharSelect close={() => this.CloseApp()} forceChoice={!!this.state.forceChoice} />
	  	} else if (this.state?.state === State.main) {
		  	// Main menu
			return this.Menu();
	  	} else {
		  	// Closed
			  if (isChrome) {
				  return this.Menu();
			  }
		  	return <div></div>;
	  	}
  	}
}
// ========================================

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);