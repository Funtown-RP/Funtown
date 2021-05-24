import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Button, Grid } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import PersonIcon from '@material-ui/icons/Person';
import { character } from '../../src/server/classes/character';

enum State {
	closed,
	main,
	charSelect
}

interface MainState {
	state: State;
}

interface CharSelectState {
	characters: character[];
}

interface CharSelecProps {
	close: () => void;
}

class CharSelect extends React.Component<CharSelecProps, CharSelectState> {
	constructor(props: any) {
		super(props);
		this.setState({ characters: []})

		window.addEventListener('message', (event) => {
			if (event.data.app === "charSelect" && event.data.type === "characters" && Array.isArray(event.data.characters)) {
				this.setState({ characters: event.data.characters });
			}
		});

		fetch(`https://ft-base/getCharacters`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({})
		})
	}

	selectChar(charID: number) {
		fetch(`https://ft-base/selectChar`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({charID: charID.toString()})
		})
	}

	render() {
		return <Grid container direction="column" alignItems="flex-start" spacing={2}>
			<Grid item><Button variant="contained" color="secondary" endIcon={<CloseIcon />} onClick={() => this.props.close()}>Close</Button></Grid>
			{this.state?.characters.map((char) => {return <Grid item><Button variant="contained" onClick={() => this.selectChar(char.id)} >{char.first_name} {char.last_name}</Button></Grid>})}
		</Grid>
	}
}

class Main extends React.Component<any, MainState> {

	constructor(props: any) {
		super(props);
		this.setState({ state: State.closed });
		window.addEventListener('message', (event) => {
			if (event.data.type === "open") {
				if (event.data.app === "main") {
					this.setState({ state: State.main});
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
			return <CharSelect close={() => this.CloseApp()} />
	  	} else if (this.state?.state === State.main) {
		  	// Main menu
			return this.Menu();
	  	} else {
		  	// Closed
		  	return <div></div>;
	  	}
  	}
}
// ========================================

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);

// setTimeout(() => {ReactDOM.render(
//   <CharSelect chars={["firsty", "secondy", "thirdy", "fourdy", "fiddy"]}/>,
//   document.getElementById('root')
// );},
//     5000)

// interface CharSelectProps {
// 	chars: Array<any>;
// }

// class CharSelect extends React.Component<CharSelectProps> {
//   render() {
//     const listItems = this.props.chars.map((char) => <ListItem key={char.toString()} value={char.toString()} />);
//     return (<ul>{listItems}</ul>);
//   }
// }

// interface ListItemProps {
// 	value: string;
// }

// function ListItem(props: ListItemProps) {
//   return <li>{props.value}</li>;
// }