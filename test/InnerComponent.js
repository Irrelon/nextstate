import React from "react";
import {useState} from "../dist/index";
import state1 from "./state1";
import state2 from "./state2";

class InnerComponent extends React.Component {
	render () {
		return (
			<div>{JSON.stringify(this.props.stateProp1)} {JSON.stringify(this.props.stateProp2)}</div>
		);
	}
}

export default useState({
	"stateProp1": state1,
	"stateProp2": state2
}, InnerComponent);