import React from 'react';
import { CircularProgress, Container, Grid, Paper, Typography } from '@material-ui/core';

export class Loadscreen extends React.Component<any, any> {
	render() {
		return <Container>
			<Paper elevation={12} >
				<Grid container direction="column" alignItems="stretch" spacing={2} >
					<Grid item style={{ justifyContent: 'center', display: 'flex', padding: 16 }} >
						<Typography variant="h5" component="h2">Loading Funtown...</Typography>
					</Grid>
					<Grid item style={{ justifyContent: 'center', display: 'flex', padding: 16 }} >
						<CircularProgress color="secondary" size={120} />
					</Grid>
				</Grid>
			</Paper>
		</Container>
	}
}