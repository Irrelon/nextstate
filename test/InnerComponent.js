import React from "react";
import {useState} from "../dist/index";

class InnerComponent extends React.Component {
	changeState () {
		this.props.stateStore("state1", {
			foo: true
		});
	}
	
	render () {
		return (
			<div>{JSON.stringify(this.props.stateProp1)} {JSON.stringify(this.props.stateProp2)}</div>
		);
	}
}

export default useState({
	"stateProp1": "state1",
	"stateProp2": "state2"
}, InnerComponent);