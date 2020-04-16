import React from "react";
import {getContext, getStore} from "./Store";
import {init as initLog} from "irrelon-log";
import ProvideState from "./ProvideState";

const log = initLog("irrelonNextState");
const InternalContext = getContext();

const resolveMapping = (stateMap, store, init = false) => {
	const stateMapKeys = Object.keys(stateMap);
	const stateData = {};
	
	log.debug(`(init: ${init}) Mapping state keys:`, JSON.stringify(stateMapKeys));
	
	stateMapKeys.forEach((propName) => {
		const stateInstanceFunction = stateMap[propName];
		
		log.debug(`Mapping ${propName}...`);
		
		if (typeof stateInstanceFunction !== "function") {
			throw new Error("Cannot map a prop to a state that is not a function!");
		}
		
		if (init) {
			// Ask state to init
			stateInstanceFunction.init(store);
		}
		
		stateData[propName] = stateInstanceFunction(store);
	});
	
	log.debug(`Mapping complete`);
	
	return stateData;
}

const irrelonNextState = (stateMap, ComponentToWrap) => {
	class DecisionWrapper extends React.PureComponent {
		static async getInitialProps (...args) {
			let finalProps = {};
			let store;
			
			log.debug(`(${ComponentToWrap.name}) WrappedComponent.getInitialProps running...`);
			
			if (InternalContext.Consumer._currentValue && InternalContext.Consumer._currentValue.stateStore) {
				log.debug(`(${ComponentToWrap.name}) WrappedComponent.getInitialProps context HAS data, using it...`);
				store = InternalContext.Consumer._currentValue.stateStore;
			} else {
				log.debug(`(${ComponentToWrap.name}) WrappedComponent.getInitialProps context has no data, creating new store...`);
				store = getStore();
			}
			
			log.debug(`(${ComponentToWrap.name}) WrappedComponent.getInitialProps resolving stateData mapping...`);
			const stateData = resolveMapping(stateMap, store, false);
			
			args[0] = {...args[0], ...stateData};
			
			if (ComponentToWrap.getInitialProps) {
				finalProps = {...ComponentToWrap.getInitialProps(...args)}
			}
			
			finalProps._serverSideState = store.exportData();
			
			return finalProps;
		}
		
		constructor (props) {
			super(props);
			
			if (!this.context) {
				this.stateStore = getStore(props._serverSideState);
			}
		}
		
		render () {
			const stateData = {};
			
			if (this.context) {
				// We already have a provider
				return (
					<ComponentToWrap {...this.props} {...stateData}>
						{this.props.children}
					</ComponentToWrap>
				)
			}
			
			// We don't have a provider, render one
			return (
				<ProvideState>
					<ComponentToWrap {...this.props} {...stateData}>
						{this.props.children}
					</ComponentToWrap>
				</ProvideState>
			)
		}
	}
	
	DecisionWrapper.contextType = InternalContext;
	
	return DecisionWrapper;
};

export default irrelonNextState;
