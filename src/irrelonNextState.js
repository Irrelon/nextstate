import React from "react";
import {getContext, getStore} from "./Store";
import {init as initLog} from "irrelon-log";
import ProvideState from "./ProvideState";

const log = initLog("irrelonNextState");
const Context = getContext();

const resolveMapping = (stateMapArr, store, init = false, componentName) => {
	log.debug(`(init: ${init}) Mapping states (${stateMapArr.length})...`);
	
	const stateData = stateMapArr.reduce((mapData, stateMap) => {
		const stateMapKeys = Object.keys(stateMap);
		
		log.debug(`(init: ${init}) Mapping state keys:`, JSON.stringify(stateMapKeys));
		
		stateMapKeys.forEach((propName) => {
			const mapFunction = stateMap[propName];
			if (!mapFunction) {
				throw new Error(`"irrelonNextState: The prop named "${propName}" in the component "${componentName}" has been passed an undefined value when we expected a state method such as myState.get()`)
			}
			const isStateFunction = mapFunction.__isNextStateStoreFunction;
			
			log.debug(`Mapping ${propName}...`);
			
			if (typeof mapFunction !== "function") {
				throw new Error(`Mapping prop ${propName} failed, not provided a function!`);
			}
			
			if (init && isStateFunction) {
				// Ask state to init
				mapFunction.init(store);
			}
			
			if (isStateFunction) {
				mapData[propName] = mapFunction(store);
			} else {
				// Pass the existing aggregated mapping to the function
				// and map the return value to the prop
				mapData[propName] = mapFunction(mapData);
			}
		});
		
		return mapData;
	}, {});
	
	log.debug(`Mapping complete`);
	
	return stateData;
}

const irrelonNextState = (...args) => {
	const stateMapArr = args.slice(0, args.length - 1);
	const ComponentToWrap = args[args.length - 1];
	const argSignature = `${ComponentToWrap.name}`;
	
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
			const stateData = resolveMapping(stateMapArr, store, true, ComponentToWrap.name);
			
			args[0] = {...args[0], ...stateData};
			
			if (ComponentToWrap.getInitialProps) {
				log.debug(`DecisionWrapper(${ComponentToWrap.name}) calling wrapped component ${ComponentToWrap.name}.getInitialProps()...`);
				const pageProps = await ComponentToWrap.getInitialProps(...args);
				finalProps = {...pageProps};
			}
			
			finalProps._serverSideState = store.exportData();
			
			return finalProps;
		}
		
		render () {
			if (this.context && this.context.stateStore) {
				// We already have a provider
				log.debug(`DecisionWrapper(${ComponentToWrap.name}) render, we have a context, rendering component...`);
				const stateData = resolveMapping(stateMapArr, this.context.stateStore, true, ComponentToWrap.name);
				
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
							const stateData = resolveMapping(stateMapArr, stateContainer.stateStore, false, ComponentToWrap.name);
							
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
