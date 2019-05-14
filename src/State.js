import React from "react";
import Log from "irrelon-log";
const log = new Log("State");

const Emitter = require("irrelon-emitter");
import {
	getState as storeGetState,
	setState as storeSetState
} from "./Store";
import Provider from "./Provider";
import {get as pathGet} from "irrelon-path";

class State {
	constructor (name, initialData, options) {
		this._Context = React.createContext(initialData);
		this._name = name;
		
		storeSetState(name, initialData, options);
		
		this.name = () => {
			return this._name;
		};
		
		this.update = (data) => {
			const currentState = storeGetState(name);
			
			if (typeof data === "function") {
				// Call the function to get the update data
				const newData = data(currentState);
				this.update(newData);
				return;
			}
			
			if (typeof currentState === "object" && typeof data === "object") {
				// Spread the current state and the new data
				this.overwrite({
					...currentState,
					...data
				});
				
				return;
			}
			
			// We're not setting an object, we are setting a primitive so
			// simply overwrite the existing data
			this.overwrite(data);
		};
		
		this.overwrite = (data) => {
			if (typeof data === "function") {
				// Call the function to get the update data
				const currentState = storeGetState(name);
				const newData = data(currentState);
				
				storeSetState(name, newData, options);
				this.emit("change");
				return;
			}
			
			log.info(`[${this.name()}]`, "Overwriting state to:", JSON.stringify(data));
			storeSetState(name, data, options);
			this.emit("change");
		};
		
		this.get = (path, defaultVal) => {
			const val = this.value();
			return pathGet(val, path, defaultVal);
		};
		
		this.value = () => {
			return storeGetState(name);
		};
		
		this.context = () => {
			return this._Context;
		};
		
		this.Provider = (props) => {
			return (
				<Provider state={this}>
					{props.children}
				</Provider>
			);
		};
	}
}

Emitter(State);

export default State;