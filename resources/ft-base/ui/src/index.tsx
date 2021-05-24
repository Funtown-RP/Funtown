import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Button, Grid } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import PersonIcon from '@material-ui/icons/Person'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

enum State {
	closed,
	main,
	charSelect
}

interface MainState {
	state: State;
}

class Main extends React.Component<any, MainState> {

	constructor(props: any) {
		super(props);
		this.setState({ state: State.closed });
		window.addEventListener('message', (event) => {
			if (event.data.type === "open") {
				if (event.data.app === "main") {
					this.setState({ state: State.main});
				}
			}
		});
	}

	Main() {
		return <Grid container direction="column" alignItems="flex-start" spacing={2} >
				<Button variant="contained" color="primary" endIcon={<PersonIcon />} onClick={() => this.setState({ state: State.charSelect})} >Character Select</Button>
				<Button variant="contained" color="secondary" endIcon={<CloseIcon />} onClick={() => this.CloseApp()} >Close</Button>
			</Grid>
	}

	CharSelect() {
		return <div>
				<Button variant="contained" color="secondary" endIcon={<ArrowBackIcon />} onClick={() => this.setState({ state: State.main})} >Back</Button>
			</div>;
	}

	CloseApp() {
		this.setState({state: State.closed});
		this.Unfocus();
	}

	Unfocus() {
		fetch(`https://ft-base/close`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({})
		})
	}

  	render() {
	  	if (this.state?.state === State.charSelect) {
			return this.CharSelect();
	  	} else if (this.state?.state === State.main) {
		  	// Main menu
			return this.Main();
	  	} else {
		  	// Closed
		  	return <div></div>;
	  	}
  	}
}
// ========================================

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);

// setTimeout(() => {ReactDOM.render(
//   <CharSelect chars={["firsty", "secondy", "thirdy", "fourdy", "fiddy"]}/>,
//   document.getElementById('root')
// );},
//     5000)

// interface CharSelectProps {
// 	chars: Array<any>;
// }

// class CharSelect extends React.Component<CharSelectProps> {
//   render() {
//     const listItems = this.props.chars.map((char) => <ListItem key={char.toString()} value={char.toString()} />);
//     return (<ul>{listItems}</ul>);
//   }
// }

// interface ListItemProps {
// 	value: string;
// }

// function ListItem(props: ListItemProps) {
//   return <li>{props.value}</li>;
// }