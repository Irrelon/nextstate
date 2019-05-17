import React from "react";
import {getContext} from "./Store";
import Log from "irrelon-log";

const log = new Log("ProvideState");

class ProvideState extends React.PureComponent {
	constructor (props) {
		super(props);
		
		if (!props.stateStore) {
			throw new Error("No stateStore prop passed to ProvideState, cannot continue!");
		}
		
		this.state = {stateStore: {...props.stateStore}};
		log.debug("Constructing with state:", JSON.stringify(this.state));
		
		this.handleChange = () => {
			this.setState({stateStore: {...props.stateStore}});
		};
		
		if (process && process.browser) {
			props.stateStore.events.on("change", this.handleChange);
		}
	}
	
	componentWillUnmount () {
		this.props.stateStore.events.off("change", this.handleChange);
	}
	
	render () {
		log.debug('Rendering with store data:', JSON.stringify(this.state.stateStore.exportData()));
		const Context = getContext();
		
		return (
			<Context.Provider value={this.state.stateStore}>
				{this.props.children}
			</Context.Provider>
		);
	}
}

export default ProvideState;