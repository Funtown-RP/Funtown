import React from 'react';
//import ReactDOM from 'react-dom';
import { Button, Grid } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add'
import { character } from '../../../src/shared/interfaces';

interface CharSelectState {
	characters: character[];
}

interface CharSelectProps {
	close: () => void;
	forceChoice: boolean;
}

export class CharSelect extends React.Component<CharSelectProps, CharSelectState> {
	constructor(props: any) {
		super(props);
		this.setState({ characters: []})

		window.addEventListener('message', (event) => {
			if (event.data.app === "charSelect" && event.data.type === "characters" && Array.isArray(event.data.characters)) {
				this.setState({ characters: event.data.characters });
			}
		});

		sendMessage('getCharacters');
	}

	selectChar(char: character) {
		sendMessage('selectChar', char);
		this.props.close();
	}

	newChar() {
		sendMessage('newChar');
		this.props.close();
	}

	render() {
		return <Grid container direction="column" alignItems="flex-start" spacing={2}>
			<Grid item><Button variant="contained" color="secondary" endIcon={<CloseIcon />} onClick={() => this.props.close()} disabled={this.props.forceChoice}>Close</Button></Grid>
			{this.state?.characters.map((char) => {return <Grid item><Button variant="contained" onClick={() => this.selectChar(char)} >{char.first_name} {char.last_name}</Button></Grid>})}
			<Grid item><Button variant="contained" color="primary" endIcon={<AddIcon />} onClick={() => this.newChar()} >New Character</Button></Grid>
		</Grid>
	}
}

function sendMessage (command: string, data?: any) {
	if (!data) {
		data = {};
	}
	fetch(`https://ft-base/charselect:${command}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
		},
		body: JSON.stringify(data)
	});
}
