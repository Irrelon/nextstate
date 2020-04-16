import React from "react";
import {getContext, getStore} from "./Store";
import {init as initLog} from "irrelon-log";
import ProvideState from "./ProvideState";

const log = initLog("irrelonNextState");
const Context = getContext();

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
	const argSignature = `${JSON.stringify(Object.keys(stateMap))}, ${ComponentToWrap.name}`;
	log.debug(`irrelonNextState(${argSignature})`);
	
	class DecisionWrapper extends React.PureComponent {
		static async getInitialProps (...args) {
			let finalProps = {};
			let store;
			
			log.debug(`DecisionWrapper(${ComponentToWrap.name}).getInitialProps() running...`);
			
			if (Context.Consumer._currentValue && Context.Consumer._currentValue.stateStore) {
				log.debug(`DecisionWrapper(${ComponentToWrap.name}).getInitialProps context HAS data, using it...`);
				store = Context.Consumer._currentValue.stateStore;
			} else {
				log.debug(`DecisionWrapper(${ComponentToWrap.name}).getInitialProps context has no data, creating new store...`);
				store = getStore();
			}
			
			log.debug(`DecisionWrapper(${ComponentToWrap.name}).getInitialProps resolving stateData mapping...`);
			const stateData = resolveMapping(stateMap, store, true);
			
			args[0] = {...args[0], ...stateData};
			
			if (ComponentToWrap.getInitialProps) {
				log.debug(`DecisionWrapper(${ComponentToWrap.name}) calling wrapped component ${ComponentToWrap.name}.getInitialProps()...`);
				finalProps = {...ComponentToWrap.getInitialProps(...args)}
			}
			
			finalProps._serverSideState = store.exportData();
			
			return finalProps;
		}
		
		render () {
			if (this.context && this.context.stateStore) {
				// We already have a provider
				log.debug(`DecisionWrapper(${ComponentToWrap.name}) render, we have a context, rendering component...`);
				const stateData = resolveMapping(stateMap, this.context.stateStore, false);
				
				return (
					<ComponentToWrap {...this.props} {...stateData}>
						{this.props.children}
					</ComponentToWrap>
				)
			}
			
			// We don't have a provider, render one
			log.debug(`DecisionWrapper(${ComponentToWrap.name}) render, we DO NOT have a context, rendering provider...`);
			
			if (this.props.stateStore) {
				this.stateStore = this.props.stateStore;
			} else {
				this.stateStore = getStore(this.props._serverSideState);
			}
			
			return (
				<ProvideState stateStore={this.stateStore} >
					<Context.Consumer>
						{(stateContainer) => {
							log.debug(`${ComponentToWrap.name} Provider consumer re-render`);
							const stateData = resolveMapping(stateMap, stateContainer.stateStore, false);
							
							return (
								<ComponentToWrap {...this.props} {...stateData}>
									{this.props.children}
								</ComponentToWrap>
							);
						}}
					</Context.Consumer>
				</ProvideState>
			)
		}
	}
	
	DecisionWrapper.contextType = Context;
	
	return DecisionWrapper;
};

export default irrelonNextState;
