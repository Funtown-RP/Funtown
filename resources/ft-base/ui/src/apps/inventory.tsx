import React from 'react';
import { TableRow, TableCell, Paper, TableContainer, Table, TableHead, TableBody, Container, Button, Card } from '@material-ui/core';
import { SendMessage } from "../lib/nui"
import { IInventoryData, IInventorySlot } from '../../../src/shared/interfaces';
import CloseIcon from '@material-ui/icons/Close';

interface IInventoryProps {
	close: () => void;
}

interface IInventoryState {
	inventory: IInventoryData;
}

const appname = "inventory";

export class Inventory extends React.Component<IInventoryProps, IInventoryState> {

	constructor(props: any) {
		super(props)

		window.addEventListener('message', (event) => {
			if (event.data.app === appname && event.data.type === "data") {
				this.setState({ inventory: event.data.inventory});
			}
		});

		this.getInventory = this.getInventory.bind(this);
		this.inventory = this.inventory.bind(this);
		this.useItem = this.useItem.bind(this);
		this.dropItem = this.dropItem.bind(this);

		this.getInventory();
	}

	getInventory() {
		SendMessage(appname, "get").then((response) => {
			if (!!response) {
				this.setState({inventory: response});
			}
		});
	}

	useItem(slot: IInventorySlot) {
		SendMessage(appname, "use", slot).then((response) => {
			if (response) {
				this.props.close();
			} else {
				this.getInventory();
			}
		})
	}

	dropItem(slot: IInventorySlot) {
		SendMessage(appname, "drop", slot).then(() => {
			this.getInventory();
		})
	}

	inventory() {
		return <TableContainer component={Card} style={{backgroundColor: "#333333"}} >
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>Amount</TableCell>
						<TableCell>Weight</TableCell>
						<TableCell></TableCell>
						<TableCell></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{this.state?.inventory?.contents.map((slot: IInventorySlot, i: number) => (
						<TableRow key={i}>
							<TableCell>{slot.item.name}</TableCell>
							<TableCell>{slot.quantity}</TableCell>
							<TableCell>{slot.item.weight}</TableCell>
							<TableCell>{!!slot.item.usable && <Button color='primary' onClick={() => this.useItem(slot)} >Use</Button>}</TableCell>
							<TableCell><Button color='secondary' onClick={() => this.dropItem(slot)} >Drop</Button></TableCell>
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
