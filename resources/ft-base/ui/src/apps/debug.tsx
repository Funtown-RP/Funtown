import React from 'react';
import { TableRow, TableCell, Paper, TableContainer, Table, TableHead, TableBody, Container, Button, Card } from '@material-ui/core';
import { SendMessage } from "../lib/nui"
import { item } from '../../../src/shared/interfaces';
import CloseIcon from '@material-ui/icons/Close';

export interface DebugScreenProps {
	close: () => void;
} 

export class DebugScreen extends React.Component<DebugScreenProps, any> {

	items: item[] = [];

	constructor(props: DebugScreenProps) {
		super(props)
		this.getItems();
	}

	getItems() {
		SendMessage("debug", "items").then((response) => {
			if (!!response) {
				this.items = response;
				this.forceUpdate();
			}
		});
	}

	render() {
		return <Container maxWidth="md" >
			<Paper style={{padding: "32px", margin: "16px"}} >
			<Button variant="contained" color="secondary" endIcon={<CloseIcon />} onClick={() => this.props.close()} >Close</Button>
			<Button variant="contained" color="primary" onClick={() => this.getItems()} >Refresh</Button>
			<TableContainer component={Card} >
			<Table>
				<TableHead>
					<TableRow>
					<TableCell>Key</TableCell>
					<TableCell>Name</TableCell>
					<TableCell>Weight</TableCell>
					<TableCell>Max Stack</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{Array.isArray(this.items) && this.items.map((item: item) => (
						<TableRow key={item.key}>
							<TableCell>{item.key}</TableCell>
							<TableCell>{item.name}</TableCell>
							<TableCell>{item.weight}</TableCell>
							<TableCell>{item.max_stack}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
		</Paper>
	</Container>
	}
}
