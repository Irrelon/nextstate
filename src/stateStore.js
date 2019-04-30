import Emitter from "irrelon-emitter";
import {decouple} from "./utils";

const isServer = typeof window === "undefined";
const controllers = {};

class Store {
	constructor (initialState) {
		this._state = initialState;
	}
	
	getState () {
		return this._state;
	}
	
	getNamedState (name) {
		return this._state[name];
	}
	
	setState (newState) {
		this._state = newState;
		this.emit("change");
	}
	
	updateNamedState (name, val) {
		this.setState({
			...this._state,
			[name]: val
		});
	}
}

Emitter(Store);

let store;

const getStore = (initialState) => {
	if (isServer) {
		console.log("On server, init new store");
		// On the server we always want to return a brand new store object
		// otherwise we end up sharing and interfering with other server
		// requests and that would be very bad!
		store = new Store(initialState !== undefined ? decouple(initialState) : {});
		
		return store;
	}
	
	console.log("On client, use existing store");
	
	store = store || new Store(initialState);
	
	return store;
};

const registerStateController = (stateName, controllerInstance) => {
	console.log("Registered state controller", stateName);
	controllers[stateName] = controllerInstance;
};

const getState = (name) => {
	return store.getNamedState(name);
};

const setState = (name, val) => {
	store.updateNamedState(name, val);
};

export {
	getStore,
	getState,
	setState,
	registerStateController
};

export default {
	getStore,
	getState,
	setState,
	registerStateController
};