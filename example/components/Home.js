import {irrelonNextState} from "../nextstate";
import React from "react";
import {RowFunctional, RowComponent} from "./Row";
import projectState from "../state/projectState";

const Home = (props) => {
	const {data} = props;
	const propArr = ["test1", "test2"];
	
	return (
		<div className="column">
			{propArr.map((field) => {
				return (<RowFunctional key={field} parentName={""} fieldName={field} fieldData={data[field]} />);
			})}
			{propArr.map((field) => {
				return (<RowComponent key={field} parentName={""} fieldName={field} fieldData={data[field]} />);
			})}
			<style jsx>{`
				.column {
					display: flex;
					flex-direction: column;
				}
				
				div {
					padding: 2px;
				}
			`}</style>
		</div>
	);
};

export default irrelonNextState({
	"project": projectState
}, Home);
