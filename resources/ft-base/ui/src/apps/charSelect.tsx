import React from 'react';
import { Button, Card, CardActions, CardContent, Container, Grid, Paper, TextField, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add'
import CheckIcon from '@material-ui/icons/Check'
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
		this.setState({ characters: [], newCharacter: false })

		window.addEventListener('message', (event) => {
			if (event.data.app === "charSelect" && event.data.type === "characters" && Array.isArray(event.data.characters)) {
				this.setState({ characters: event.data.characters, newCharacter: false });
			}
		});
		sendMessage('getCharacters')
	}

	selectChar (char: character) {
		sendMessage('selectChar', char);
		this.props.close();
	}

	startNewChar () {
		this.setState({ characters: this.state?.characters, newCharacter: true });
	}

	newChar () {
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
			newCharacter: true,
			firstNameError: firstNameErr,
			lastNameError: lastNameErr,
			dobError: dobErr
		});

		if (firstNameErr || lastNameErr || dobErr) {
			return;
		}

		sendMessage('newChar', { firstName: this.firstName, lastName: this.lastName, dob: this.dob });
		this.props.close();
	}

	CharSelectCard (props: any) {
		const char: character = props.char
		return <Card variant="outlined" >
			<CardContent>
				<Typography variant="h5" component="h2">{char.first_name} {char.last_name}</Typography>
				<Typography color="textSecondary">
					Citizen #: <b>{char.id}</b>
				</Typography>
				<Typography color="textSecondary">
					DOB: <b>{char.dob && new Date(char.dob).toLocaleDateString()}</b>
				</Typography>
				{char.address && <Typography color="textSecondary">
					Address: <b>{char.address}</b>
				</Typography>}
			</CardContent>
			<CardActions>
				<Button color="primary" size="medium" startIcon={<CheckIcon />} onClick={() => props.onSelect(char)} >Log in</Button>
			</CardActions>
		</Card>;
	}

	render () {
		if (!this.state?.newCharacter) {
			return <Container maxWidth="xs"  >
				<Paper >
					<Grid container direction="column" alignItems="stretch" spacing={2}>
						{this.state?.characters?.map((char) => {
							return <Grid item alignContent="stretch">
								<this.CharSelectCard char={char} onSelect={(char: character) => this.selectChar(char)} />
							</Grid>
						})}
						<Grid item sm style={{ justifyContent: 'center', display: 'flex' }}>
							{!this.props.forceChoice && <Button variant="contained" color="secondary" endIcon={<CloseIcon />} onClick={() => this.props.close()} >Cancel</Button>}
							<Button variant="contained" color="primary" endIcon={<AddIcon />} onClick={() => this.startNewChar()} >New Character</Button>
						</Grid>
					</Grid>
				</Paper>
			</Container>
		} else {
			return <Container maxWidth="sm">
				<Paper >
					<form noValidate>
						<Grid container direction="row" spacing={2} alignItems="center" alignContent="center" >
							<Grid item xs={12} ><Button variant="contained" color="secondary" endIcon={<CloseIcon />} onClick={() => this.setState({ characters: this.state?.characters, newCharacter: false })} >Cancel</Button></Grid>
							<Grid item xs={6} style={{ justifyContent: 'center', display: 'flex' }} ><TextField label="First name" error={this.state.firstNameError} helperText="Required" required margin="normal" variant="filled" onChange={(ev) => { this.firstName = ev.target.value; }} /></Grid>
							<Grid item xs={6} style={{ justifyContent: 'center', display: 'flex' }} ><TextField label="Last name" error={this.state.lastNameError} helperText="Required" required margin="normal" variant="filled" onChange={(ev) => { this.lastName = ev.target.value; }} /></Grid>
							<Grid item xs={6} style={{ justifyContent: 'center', display: 'flex' }} >
								<TextField label="Date of birth" error={this.state.dobError} helperText="Required" required margin="normal" type="date" variant="filled" InputLabelProps={{ shrink: true, }}
									onChange={(ev) => { this.dob = new Date(ev.target.value); }} />
							</Grid>
							<Grid item xs={6} style={{ justifyContent: 'center', display: 'flex' }} ><Button variant="contained" color="primary" endIcon={<AddIcon />} onClick={() => { this.newChar(); }} >Create Character</Button></Grid>
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
