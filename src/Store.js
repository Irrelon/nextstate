import React from "react";
import Log from "irrelon-log";
const log = new Log("Store");

let Context;
const Emitter = require("irrelon-emitter");
const events = new Emitter();

let storeObj;

const newStore = (initialData) => {
	log.info("Creating new store with initialData:", JSON.stringify(initialData));
	Context = React.createContext(initialData);
	storeObj = {...initialData};
	events.emit("store");
};

const getContext = () => {
	return Context;
};

const getStore = (initialData) => {
	if (!process || !process.browser) {
		// Init a new store object whenever we are on the server
		newStore(initialData);
		return;
	}
	
	if (storeObj) {
		log.info("Already have a store, using existing one");
		return;
	}
	
	newStore(initialData);
};

const getState = (name) => {
	if (!storeObj) {
		return;
	}
	
	return storeObj[name];
};

const setState = (name, val, options = {}) => {
	const resolve = () => {
		if (options && options.stateInstance) {
			options.stateInstance.emit("change");
		}
	};
	
	if (storeObj) {
		log.info(`[${name}] Setting state:`, JSON.stringify(val));
		storeObj[name] = val;
		events.emit("change");
		
		return resolve();
	}
	
	log.info(`[${name}] Waiting to set state:`, JSON.stringify(val));
	
	// Hook when we get a store
	if (!process || !process.browser) {
		// On server, we listen for store init every time it is emitted
		events.once("store", () => {
			log.info(`[${name}] Store now available, setting state:`, JSON.stringify(val));
			setState(name, val, options);
			
			return;
		});
		
		return;
	}
	
	// On client we only want to hook the store event once
	// and only listen to the event if the dev told us to init
	// the value on the client instead of using the data sent
	// from the server - usually you don't want to specify
	// initOnClient as true since we want the server to tell us
	// what the initial value should be
	if (options.initOnClient === true) {
		events.once("store", () => {
			log.info(`[${name}] Store now available, setting state:`, JSON.stringify(val));
			setState(name, val, options);
			
			return;
		});
	}
};

const exportStore = () => {
	return JSON.parse(JSON.stringify(storeObj));
};

class ProvideState extends React.PureComponent {
	constructor (props) {
		super(props);
		
		this.state = exportStore();
		log.info("Constructing ProvideState with state:", JSON.stringify(this.state));
		
		this.handleChange = () => {
			this.setState({
				...exportStore()
			});
		};
		
		if (process && process.browser) {
			events.on("change", this.handleChange);
		}
	}
	
	componentWillUnmount () {
		events.off("change", this.handleChange);
	}
	
	render () {
		log.info('Rendering ProvideState with store data:', JSON.stringify(this.state));
		return (
			<Context.Provider value={this.state}>
				{this.props.children}
			</Context.Provider>
		);
	}
}

export default {
	getStore,
	setState,
	getState,
	exportStore,
	getContext,
	ProvideState,
	events
};

export {
	getStore,
	setState,
	getState,
	exportStore,
	getContext,
	ProvideState,
	events
};