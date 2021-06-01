import React from 'react';
import { TableRow, TableCell, Paper, TableContainer, Table, TableHead, TableBody, Container, Button, Card, Tabs, Tab, Typography, Box } from '@material-ui/core';
import { SendMessage } from "../lib/nui"
import { item } from '../../../src/shared/interfaces';
import CloseIcon from '@material-ui/icons/Close';

export interface DebugScreenProps {
	close: () => void;
}

export interface DebugScreenState {
	tab: number;
	items: item[];
}

export class DebugScreen extends React.Component<DebugScreenProps, DebugScreenState> {

	constructor(props: DebugScreenProps) {
		super(props)
		this.state = { tab: 0, items: [] };
		this.getItems();

		this.getItems = this.getItems.bind(this);
		this.itemDefs = this.itemDefs.bind(this);
	}

	getItems() {
		SendMessage("debug", "items").then((response) => {
			if (!!response) {
				this.setState({tab: this.state.tab, items: response});
			}
		});
	}

	itemDefs() {
		return <TableContainer component={Card} >
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
					{Array.isArray(this.state?.items) && this.state?.items?.map((item: item) => (
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
	}

	render() {
		return <Container maxWidth="md" >
			<Paper style={{padding: "32px", margin: "16px"}} >
				<Button variant="contained" color="secondary" endIcon={<CloseIcon />} onClick={() => this.props.close()} >Close</Button>
				<Tabs centered value={this.state.tab} style={{ marginBottom: "24px" }} onChange={(event: object, value: number) => {
					this.setState({tab: value});
				}}>
					<Tab label="Item Definitions" />
					<Tab label="Test" />
				</Tabs>
				{this.state.tab === 0 && <this.itemDefs />}
				{this.state.tab === 1 && <Typography variant="h5" component="h2" style={{display: 'flex', justifyContent: 'center'}}>Test tab</Typography>}
			</Paper>
		</Container>
	}
}
