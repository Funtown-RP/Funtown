import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Chip, Button } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';

enum State {
	main,
	charSelect
}

interface MainState {
	state: State;
}

class Main extends React.Component<any, MainState> {

	constructor(props: any) {
		super(props);
		this.setState({ state: State.main });
		window.addEventListener('message', (event) => {
			if (event.data.type === "open") {
				if (event.data.app === "charSelect") {
					this.setState({ state: State.charSelect});
				}
			}
		});
	}

	CharSelect() {
		return <div>
				<Button variant="contained" color="secondary" endIcon={<CloseIcon />} onClick={() => this.CloseApp()} >Close</Button>
				<h2>Character Select</h2>
			</div>
	}

	CloseApp() {
		this.setState({state: State.main});
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
	  } else {
		return <Chip color="secondary" label="Name Here" onClick={() => this.setState({state: State.charSelect})} />
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