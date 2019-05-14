import React from "react";
import {ProvideState} from "../dist/index";
import InnerComponent from "./InnerComponent";

class App extends React.PureComponent {
	constructor (props) {
		super(props);
	}
	
	render () {
		return (
			<ProvideState>
				<InnerComponent someProp={"true dat"}>
					{this.props.children}
				</InnerComponent>
			</ProvideState>
		);
	}
}

export default App;