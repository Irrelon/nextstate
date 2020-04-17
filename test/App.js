import React from "react";
import {irrelonNextState} from "../src/index";
import InnerComponent from "./InnerComponent";

class App extends React.PureComponent {
	constructor (props) {
		super(props);
	}
	
	render () {
		return (
			<InnerComponent someProp={"true dat"}>
				{this.props.children}
			</InnerComponent>
		);
	}
}

export default irrelonNextState({

}, App);
