import Emitter from "irrelon-emitter";
import {decouple} from "./utils";
import React from "react";
const {"get": pathGet} = require("irrelon-path");
const stateStore = require("./stateStore");

// The current implementation of the state system doesn't allow for new contexts to be created
// for each server request which is why we limit it to working client-side at the moment but
// the best thing to do is allow the system to signal to us that we are dealing with a new
// request server-side and to create a new context of some time that is short lived and only
// exists as a reference for the life of the individual request currently running

// Need to work out how to do that. At the moment we export singletons from the state folder
// and those singletons will be long lived and apply to every request instead of only relating
// to an individual request only.

/**
 * The StateController class manages states including their data
 * and mutations.
 */
class StateController {
	constructor (data, options) {
		if (!options) {
			throw new Error("You must provide a unique name for each state controller you instantiate!");
		}
		
		if (typeof options === "string") {
			// User passed the name directly rather than as an object
			options = {
				"name": options
			};
		}
		
		this.name(options.name);
		this.debug(options.debug);
		this.context(React.createContext(data));
		
		stateStore.registerStateController(options.name, this);
		stateStore.setState(options.name, decouple(data));
	}
	
	context (val) {
		if (val !== undefined) {
			this._context = val;
			return this;
		}
		
		return this._context;
	}
	
	name (val) {
		if (val !== undefined) {
			this._name = val;
			return this;
		}
		
		return this._name;
	}
	
	debugLog (msg) {
		if (this._debug) {
			console.log(`NextState StateController :: ${this.name() || "Unnamed"} :: ${msg}`);
		}
	}
	
	debug (val) {
		if (val !== undefined) {
			this._debug = val;
			return this;
		}
		
		return this._debug;
	}
	
	update (data) {
		this.debugLog(`(update) Asking to update state with ${JSON.stringify(data)}`);
		
		const name = this.name();
		const currentState = stateStore.getState(name);
		
		if (Object.is(currentState, data)) {
			return;
		}
		
		this.debugLog(`(update) Updating state with ${JSON.stringify(data)}`);
		
		if (typeof currentState === "object" && typeof data === "object") {
			// Mixin existing data
			this.debugLog(`(update) Spreading ${JSON.stringify(data)}`);
			
			stateStore.setState(name, {
				...currentState,
				...decouple(data)
			});
		} else {
			this.debugLog(`(update) Assigning ${JSON.stringify(data)}`);
			
			stateStore.setState(name, data);
		}
		
		this.debugLog(`(update) Update completed, new data ${JSON.stringify(this._data)}`);
		this.debugLog(`(update) Emitting state change...`);
		
		this.emit("change");
	}
	
	overwrite (data) {
		const name = this.name();
		const currentState = stateStore.getState(name);
		
		if (Object.is(currentState, data)) {
			return;
		}
		
		if (typeof data === "object") {
			stateStore.setState(name, {
				...decouple(data)
			});
		} else {
			stateStore.setState(name, data);
		}
		
		this.emit("change");
	}
	
	value () {
		return stateStore.getState(this.name());
	}
	
	find (query, options) {
		return stateStore.getState(this.name());
	}
	
	get (path) {
		const currentState = stateStore.getState(this.name());
		return pathGet(currentState, path);
	}
}

// Give StateController's prototype the event emitter methods
// and functionality
Emitter(StateController);

export default StateController;