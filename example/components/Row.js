import {get as pathGet, join as pathJoin} from "@irrelon/path";
import {useState, State} from "irrelon-nextstate";
import React from "react";
const dataState = new State("data", "Hello");

const updateState = (store, key) => () => {
	console.log("update", key);
	dataState.set(store, key, Math.floor(Math.random() * 20));
};

const RowFunctional = useState({}, React.memo((props) => {
	const {parentName, fieldName, fieldData, stateStore} = props;
	
	return (
		<div className="row" key={fieldName}>
			<div>{new Date().getTime()}</div>
			<div>{typeof fieldData === "object" ? `{${fieldName}: {...}}` : `{${fieldName}: ${fieldData}}`}</div>
			<div><button onClick={updateState(stateStore, pathJoin(parentName, fieldName))}>Update</button></div>
			{typeof fieldData === "object" && <div className="children">
				{Object.entries(fieldData).map(([fieldKey, fieldVal]) => <RowFunctional key={fieldKey} parentName={pathJoin(parentName, fieldName)} fieldName={fieldKey} fieldData={fieldVal} />)}
			</div>}
			<style jsx>{`
				.row {
					display: flex;
					flex-direction: row;
				}
				
				div {
					padding: 2px;
				}
				
				.children {
					display: flex;
					flex-direction: column;
					background: rgba(0, 255, 0, 0.2);
				}
			`}</style>
		</div>
	);
}));

class RowComponentUnwrapped extends React.PureComponent {
	render () {
		const {parentName, fieldName, fieldData, stateStore} = this.props;
		
		return (
			<div className="row" key={fieldName}>
				<div>{new Date().getTime()}</div>
				<div>{typeof fieldData === "object" ? `{${fieldName}: {...}}` : `{${fieldName}: ${fieldData}}`}</div>
				<div><button onClick={updateState(stateStore, fieldName)}>Update</button></div>
				{typeof fieldData === "object" && <div className="children">
					{Object.entries(fieldData).map(([fieldKey, fieldVal]) => <RowComponent key={fieldKey} parentName={pathJoin(parentName, fieldName)} fieldName={fieldKey} fieldData={fieldVal} />)}
				</div>}
				<style jsx>{`
					.row {
						display: flex;
						flex-direction: row;
					}
					
					div {
						padding: 2px;
					}
					
					.children {
						display: flex;
						flex-direction: column;
						background: rgba(0, 255, 0, 0.2);
					}
				`}</style>
			</div>
		);
	}
}

const RowComponent = useState({}, RowComponentUnwrapped);

export {
	RowFunctional,
	RowComponent
};