import React from 'react';
import { TableRow, TableCell, Paper, TableContainer, Table, TableHead, TableBody, Container, Button, Card, Tabs, Tab, Typography } from '@material-ui/core';
import { SendMessage } from "../lib/nui"
import { IInventoryData, IInventoryItem } from '../../../src/shared/interfaces';
import CloseIcon from '@material-ui/icons/Close';

interface IInventoryProps {
	close: () => void;
}

interface IInventoryState {
	inventory: IInventoryData;
}

export class Inventory extends React.Component<IInventoryProps, IInventoryState> {

	constructor(props: any) {
		super(props)

		window.addEventListener('message', (event) => {
			if (event.data.app === "inventory" && event.data.type === "data") {
				this.setState({ inventory: event.data.inventory});
			}
		});

		this.getInventory = this.getInventory.bind(this);
		this.inventory = this.inventory.bind(this);

		this.getInventory();
	}

	getInventory() {
		SendMessage("inventory", "get").then((response) => {
			if (!!response) {
				this.setState({inventory: response});
			}
		});
	}

	inventory() {
		return <TableContainer component={Card} style={{backgroundColor: "#333333"}} >
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>Amount</TableCell>
						<TableCell>Weight</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{this.state?.inventory?.contents.map((item: IInventoryItem, i: number) => (
						<TableRow key={i}>
							<TableCell>{item.item.name}</TableCell>
							<TableCell>{item.quantity}</TableCell>
							<TableCell>{item.item.weight}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	}

	render() {
		return <Container maxWidth="md" >
			<Paper style={{padding: "32px", margin: "16px"}} >
				<Button variant="contained" color="secondary" endIcon={<CloseIcon />} onClick={() => this.props.close()} >Close</Button>
				<this.inventory />
			</Paper>
		</Container>
	}
}
