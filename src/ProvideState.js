import React from "react";
import {getContext} from "./Store";
import {init as initLog} from "irrelon-log";

const log = initLog("ProvideState");

class ProvideState extends React.PureComponent {
	constructor (props) {
		super(props);
		
		if (!props.stateStore) {
			throw new Error("No stateStore prop passed to ProvideState, cannot continue!");
		}
		
		this.state = {
			storeContainer: this.generateNewStoreContainer(props.stateStore)
		};
		
		//log.debug("Constructing with state:", JSON.stringify(this.state.storeContainer));
		
		this.handleChange = () => {
			this.setState({
				storeContainer: this.generateNewStoreContainer(props.stateStore)
			});
		};
		
		if (process && process.browser) {
			props.stateStore.events.on("change", this.handleChange);
		}
	}
	
	generateNewStoreContainer = (stateStore) => {
		return {
			stateStore
		};
	};
	
	componentWillUnmount () {
		this.props.stateStore.events.off("change", this.handleChange);
	}
	
	render () {
		//log.debug('Rendering with store data:', JSON.stringify(this.state.storeContainer.stateStore.exportData()));
		const Context = getContext();
		
		return (
			<Context.Provider value={this.state.storeContainer}>
				{this.props.children}
			</Context.Provider>
		);
	}
}

export default ProvideState;
