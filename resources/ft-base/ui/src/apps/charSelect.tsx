import React from 'react';
import { Button, Container, Grid, Paper, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add'
import { character } from '../../../src/shared/interfaces';

interface CharSelectState {
	characters: character[];
	newCharacter: boolean;
	firstNameError: boolean;
	lastNameError: boolean;
	dobError: boolean;
}

interface CharSelectProps {
	close: () => void;
	forceChoice: boolean;
}

export class CharSelect extends React.Component<CharSelectProps, CharSelectState> {

	firstName: string = "";
	lastName: string = "";
	dob?: Date;

	firstNameError: boolean = false;
	lastNameField?: JSX.Element;
	dobField?: JSX.Element;

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
		let firstNameErr = false;
		let lastNameErr = false;
		let dobErr = false;
		if (this.firstName === "") {
			firstNameErr = true;
		} else if (this.lastName === "") {
			lastNameErr = true;
		} else if (!this.dob) {
			dobErr = true;
		}

		this.setState({ 
			characters: this.state?.characters,
			newCharacter: this.state?.newCharacter,
			firstNameError: firstNameErr,
			lastNameError: lastNameErr,
			dobError: dobErr 
		});

		if (firstNameErr || lastNameErr || dobErr) {
			return;
		}

		sendMessage('newChar', { firstName: this.firstName, lastName: this.lastName, dob: this.dob});
		this.props.close();
	}

	render() {
		if (!this.state?.newCharacter) {
			return <Container maxWidth="xs">
				<Paper>
					<Grid container direction="column" alignItems="flex-start" spacing={2}>
						<Grid item><Button variant="contained" color="secondary" endIcon={<CloseIcon />} onClick={() => this.props.close()} disabled={this.props.forceChoice}>Close</Button></Grid>
							{this.state?.characters?.map((char) => {return <Grid item><Button variant="contained" onClick={() => this.selectChar(char)} >{char.first_name} {char.last_name}</Button></Grid>})}
						<Grid item><Button variant="contained" color="primary" endIcon={<AddIcon />} onClick={() => this.startNewChar()} >New Character</Button></Grid>
					</Grid>
				</Paper>
			</Container>
		} else {
			return <Container maxWidth="sm">
				<Paper >
					<form noValidate>
						<Grid container direction="row" spacing={2} alignItems="center" alignContent="center" >
						<Grid item xs={12}><Button variant="contained" color="secondary" endIcon={<CloseIcon />} onClick={() => this.setState({ characters: this.state?.characters, newCharacter: false})} >Cancel</Button></Grid>
							<Grid item xs={6}><TextField label="First name" error={this.state.firstNameError} helperText="Required" required margin="normal" variant="filled" onChange={(ev) => { this.firstName = ev.target.value; }} /></Grid>
							<Grid item xs={6}><TextField label="Last name" error={this.state.lastNameError} helperText="Required" required margin="normal" variant="filled" onChange={(ev) => { this.lastName = ev.target.value; }} /></Grid>
							<Grid item xs={6}>
								<TextField label="Date of birth" error={this.state.dobError} helperText="Required" required margin="normal" type="date" variant="filled" InputLabelProps={{ shrink: true,}}
								onChange={(ev) => { this.dob = new Date(ev.target.value); }}  />
							</Grid>
							<Grid item xs={6}><Button variant="contained" color="primary" endIcon={<AddIcon />} onClick={() => {this.newChar();}} >Create Character</Button></Grid>
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
