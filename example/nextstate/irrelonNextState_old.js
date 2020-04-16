import React from "react";
import {getContext, getStore} from "./Store";
import {init as initLog} from "irrelon-log";

const log = initLog("irrelonNextState");
const InternalContext = getContext();

const generateNewStoreContainer = (stateStore) => {
	return {
		stateStore
	};
};

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
	//let serverSideStore;
	
	log.debug(`irrelonNextState(${JSON.stringify(Object.keys(stateMap))}, ${ComponentToWrap.name})`);
	
	/*if (!process || !process.browser) {
		if (!InternalContext.Consumer._currentValue) {
			log.debug(`(${ComponentToWrap.name}) Creating server-side store...`);
			serverSideStore = getStore();
		} else {
			log.debug(`(${ComponentToWrap.name}) Using existing react-tree server-side store...`);
			serverSideStore = InternalContext.Consumer._currentValue.stateStore;
		}
	}*/
	
	class RenderConsumer extends React.Component {
		render () {
			const {init} = this.props;
			
			log.debug(`(${ComponentToWrap.name}) Rendering consumer (init: ${init})...`);
			
			const storeContainer = this.context;
			const stateStore = storeContainer.stateStore;
			const stateData = resolveMapping(stateMap, stateStore, false);
			log.debug(`(${ComponentToWrap.name}) Passing state data to component:`, JSON.stringify(stateData));
			
			return (
				<ComponentToWrap {...this.props} {...stateData}>
					{this.props.children}
				</ComponentToWrap>
			);
		}
	}
	
	RenderConsumer.contextType = InternalContext;
	
	class WrappedComponent extends React.PureComponent {
		static contextType = InternalContext;
		
		constructor (props) {
			super(props);
			
			log.debug(`WrappedComponent(${ComponentToWrap.name}) constructor...`);
			
			debugger;
			
			if (!this.context && !props._serverSideState) {
				log.debug(`(${ComponentToWrap.name}) No props._serverSideState found, creating new store...`);
				this.stateStore = getStore();
			} else {
				log.debug(`(${ComponentToWrap.name}) props._serverSideState exists, creating new store with initial data...`);
				this.stateStore = getStore(props._serverSideState);
			}
			
			this.state = {
				storeContainer: generateNewStoreContainer(this.stateStore)
			};
			
			/*this.handleChange = () => {
				log.debug(`(${ComponentToWrap.name}) Handling change...`);
				this.setState({
					storeContainer: generateNewStoreContainer(this.stateStore)
				});
			};*/
			
			if (process && process.browser) {
				//this.stateStore.events.on("change", this.handleChange);
			}
		}
		
		componentWillUnmount () {
			//this.stateStore.events.off("change", this.handleChange);
		}
		
		render () {
			console.log(this.state);
			
			log.debug(`(${ComponentToWrap.name}) Render method called...`);
			
			if (!InternalContext.Consumer._currentValue) {
				log.debug(`(${ComponentToWrap.name}) No context current value exists`);
				log.debug(`(${ComponentToWrap.name}) Rendering provider...`);
				
				return (
					<InternalContext.Provider value={this.state.storeContainer}>
						<RenderConsumer init={true} />
					</InternalContext.Provider>
				);
			}
			
			return (
				<RenderConsumer />
			);
		}
	}
	
	WrappedComponent.getInitialProps = async (...args) => {
		let finalProps = {};
		let store;
		
		log.debug(`(${ComponentToWrap.name}) WrappedComponent.getInitialProps running...`);
		
		if (InternalContext.Consumer._currentValue) {
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
	};
	
	return WrappedComponent;
};

export default irrelonNextState;
