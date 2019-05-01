import React from "react";
import {ProvideState, getStore} from "../dist/index";
import InnerComponent from "./InnerComponent";
import state1 from "./state1";
import state2 from "./state2";

class App extends React.PureComponent {
	constructor (props) {
		super(props);
		getStore();
	}
	
	render () {
		return (
			<ProvideState stateArr={[state1, state2]}>
				<InnerComponent>
					{this.props.children}
				</InnerComponent>
			</ProvideState>
		);
	}
}

export default App;