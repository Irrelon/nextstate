import {useState, State} from "irrelon-nextstate";
import React from "react";

const dataState = new State("data", "Hello");

const updateState = (store, key) => () => {
	dataState.set(store, key, Math.floor(Math.random() * 20));
};

const Home = (props) => {
	const propArr = ["test1", "test2", "test3"];
	
	return (
		<div>
			<table>
				<tbody>
				{propArr.map((field) => {
					return (
						<tr key={field}>
							<td>{new Date().getTime()}</td>
							<td>{props.data[field]}</td>
							<td><button onClick={updateState(props.stateStore, field)}>Update</button></td>
						</tr>
					);
				})}
				</tbody>
			</table>
		</div>
	);
};

export default useState({
	"data": "data"
}, Home);