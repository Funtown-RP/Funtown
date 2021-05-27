import React from 'react';
import { Button, Container, Grid, Paper, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add'
import { character } from '../../../src/shared/interfaces';
import { KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

interface CharSelectState {
	characters: character[];
	newCharacter: boolean;
}

interface CharSelectProps {
	close: () => void;
	forceChoice: boolean;
}

export class CharSelect extends React.Component<CharSelectProps, CharSelectState> {

	firstName: string = "";
	lastName: string = "";
	dob?: Date;

	constructor(props: any) {
		super(props);
		this.setState({ characters: [], newCharacter: false})

		window.addEventListener('message', (event) => {
			if (event.data.app === "charSelect" && event.data.type === "characters" && Array.isArray(event.data.characters)) {
				this.setState({ characters: event.data.characters, newCharacter: false });
			}
		});
		sendMessage('getCharacters');
	}

	selectChar(char: character) {
		sendMessage('selectChar', char);
		this.props.close();
	}

	startNewChar() {
		this.setState({ characters: this.state?.characters, newCharacter: true});
	}

	newChar() {
		if (this.firstName === "" || this.lastName === "" || !this.dob) {
			alert("Fill in all fields");
			return;
		}
		sendMessage('newChar', { firstName: this.firstName, lastName: this.lastName, dob: this.dob});
		this.props.close();
	}

	render() {
		if (!this.state?.newCharacter) {
			return <Grid container direction="column" alignItems="flex-start" spacing={2}>
				<Grid item><Button variant="contained" color="secondary" endIcon={<CloseIcon />} onClick={() => this.props.close()} disabled={this.props.forceChoice}>Close</Button></Grid>
				{this.state?.characters.map((char) => {return <Grid item><Button variant="contained" onClick={() => this.selectChar(char)} >{char.first_name} {char.last_name}</Button></Grid>})}
				<Grid item><Button variant="contained" color="primary" endIcon={<AddIcon />} onClick={() => this.startNewChar()} >New Character</Button></Grid>
			</Grid>
		} else {
			return <Container maxWidth="md">
				<Paper >
					<form noValidate>
						<Grid container direction="row" spacing={2} alignItems="center" alignContent="center" >
							<Grid item xs={6}><TextField label="First name" margin="normal" variant="filled" onChange={(ev) => { this.firstName = ev.target.value; }} /></Grid>
							<Grid item xs={6}><TextField label="Last name" margin="normal" variant="filled" onChange={(ev) => { this.lastName = ev.target.value; }} /></Grid>
							<Grid item xs={6}>
								<TextField label="Date of birth" margin="normal" type="date" variant="filled" InputLabelProps={{ shrink: true,}}
								onChange={(ev) => { this.dob = new Date(ev.target.value); }}  />
							</Grid>
							<Grid item xs={6}><Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => {this.newChar();}} >New Character</Button></Grid>
						</Grid>
					</form>
				</Paper>
			</Container>
		}
		
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
