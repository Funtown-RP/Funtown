import React from 'react';
//import ReactDOM from 'react-dom';
import { Button, Grid } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { character } from '../../../src/server/classes/character';

interface CharSelectState {
	characters: character[];
}

interface CharSelecProps {
	close: () => void;
}

export class CharSelect extends React.Component<CharSelecProps, CharSelectState> {
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