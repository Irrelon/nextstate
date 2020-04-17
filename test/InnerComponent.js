import React from "react";
import {irrelonNextState} from "../src/index";
import state1 from "./state1";
import state2 from "./state2";

class InnerComponent extends React.Component {
	changeState () {
		const {updateState1} = this.props;
		
		updateState1({
			foo: true
		});
	}
	
	render () {
		return (
			<div>{JSON.stringify(this.props.stateProp1)} {JSON.stringify(this.props.stateProp2)}</div>
		);
	}
}

export default irrelonNextState({
	"stateProp1": state1,
	"stateProp2": state2,
	"updateState1": state1.patch
}, InnerComponent);
