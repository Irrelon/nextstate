import {irrelonNextState} from "../nextstate";
import React from "react";
import projectState from "../state/projectState";

const Test = (props) => {
	const {project} = props;
	
	return (
		<div className="column">
			{JSON.stringify(project)}
		</div>
	);
};

export default irrelonNextState({
	"project": projectState.get()
}, Test);
