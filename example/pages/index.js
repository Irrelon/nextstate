import React from 'react';
import projectState from "../state/projectState";
import {irrelonNextState} from "../nextstate";
import Test from "../components/Test";

const {setLogLevel} = require("../nextstate");
setLogLevel("ProvideState=*,State=*,Store=*,useState=*,irrelonNextState=*");

const Home = (props) => {
	const {projectState, projectState2, projectStatePatch, projectSubItem, someNextJsProp} = props;
	
	return (
		<div className="body">
			<table>
				<tbody>
				<tr>
					<td>someNextJsProp</td>
					<td>{someNextJsProp}</td>
				</tr>
				<tr>
					<td>projectState</td>
					<td>{JSON.stringify(projectState)}</td>
				</tr>
				<tr>
					<td>projectState2</td>
					<td>{JSON.stringify(projectState2)}</td>
				</tr>
				<tr>
					<td>projectSubItem</td>
					<td>{JSON.stringify(projectSubItem)}</td>
				</tr>
				</tbody>
			</table>
			<Test/>
			<button onClick={() => {
				projectStatePatch({
					name: "Next Thing"
				});
			}}>Update</button>
			<style jsx>{`
                .body {
                    flex-direction: column;
                    display: flex;
                    flex: 1;
                    width: 100vw;
                    height: 100vh;
                    background-color: #555;
                    color: #fff;
                }
            `}</style>
		</div>
	);
};

Home.getInitialProps = async ({projectStatePatch}) => {
	const cookieVal = "My Cookie Project";
	
	projectStatePatch({
		name: cookieVal
	});
	
	return {
		someNextJsProp: "foo",
		cookieVal
	};
};

export default irrelonNextState({
	"projectState": projectState.get(),
	"projectStatePatch": projectState.update(),
	"projectStateFind": projectState.find()
}, {
	"projectSubItem": ({projectState, projectStatePatch, projectStateFind}) => {
		return projectStateFind({
			_id: "1"
		});
	},
	"projectState2": projectState.get()
}, Home);
