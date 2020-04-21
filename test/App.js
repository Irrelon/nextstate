import React from "react";
import {irrelonNextState} from "../src/index";
import InnerComponent from "./InnerComponent";
import state1 from "./state1";

class App extends React.PureComponent {
	render () {
		return (
			<InnerComponent someProp={"true dat"}>
				{this.props.children}
			</InnerComponent>
		);
	}
}

App.getInitialProps = async ({updateState1}) => {
	updateState1("foo");
	return {
		pageProp: "isHere"
	};
};

export default irrelonNextState({
	"state1": state1.get(),
	"updateState1": state1.update()
}, App);
