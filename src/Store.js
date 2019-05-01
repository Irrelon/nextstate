import React from "react";

const Context = React.createContext(null);
const Log = require("irrelon-log");
const log = new Log("Store");
const Emitter = require("irrelon-emitter");
const events = new Emitter();

let storeObj;

const getStore = (initialData) => {
	if (!process || !process.browser) {
		// Init a new store object whenever we are on the server
		log.info("Init on server");
		storeObj = {...initialData};
		events.emit("store");
		return;
	}
	
	if (storeObj) {
		return;
	}
	
	log.info("Init on client");
	storeObj = {...initialData};
	events.emit("store");
};

const getState = (name) => {
	if (!storeObj) {
		log.info(`Ignoring store get state for "${name}" as we have no store object!`);
		return;
	}
	
	log.info(`Getting state for "${name}" as ${JSON.stringify(storeObj[name])}`);
	return storeObj[name];
};

const setState = (name, val, options = {}) => {
	if (storeObj) {
		log.info(`Setting state for "${name}" to ${JSON.stringify(val)}`);
		storeObj[name] = val;
		events.emit("change");
		return;
	}
	
	// Hook when we get a store
	if (!process || !process.browser) {
		// On server, we listen for store init every time it is emitted
		log.info(`Waiting for store to become available on server...`);
		events.on("store", () => {
			log.info(`Store became available on server`);
			setState(name, val, options);
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
		log.info(`Waiting for store to become available on client...`);
		events.once("store", () => {
			log.info(`Store became available on client`);
			setState(name, val, options);
		});
	}
};

const exportStore = () => {
	return JSON.parse(JSON.stringify(storeObj));
};

class Provider extends React.PureComponent {
	constructor (props) {
		super(props);
		
		this.state = exportStore();
		
		this.handleChange = () => {
			this.setState({
				...exportStore()
			});
		};
		
		events.on("change", this.handleChange);
	}
	
	componentWillUnmount () {
		events.off("change", this.handleChange);
	}
	
	render () {
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
	events
};

export {
	getStore,
	setState,
	getState,
	exportStore,
	events
};