import React from "react";

const Emitter = require("irrelon-emitter");
import {
	getState as storeGetState,
	setState as storeSetState
} from "./Store";
import Provider from "./Provider";

class State {
	constructor (name, initialData, options) {
		const Log = require("irrelon-log");
		const log = new Log(`State :: ${name}`);
		
		this._Context = React.createContext(initialData);
		this._name = name;
		
		storeSetState(name, initialData, options);
		
		this.name = () => {
			return this._name;
		};
		
		this.update = (data) => {
			if (typeof data === "function") {
				// Call the function to get the update data
				log.info("Asking function for new state data value...");
				const newData = data(storeGetState(name));
				
				log.info("Asking store to update state value");
				storeSetState(name, newData, options);
				this.emit("change");
				return;
			}
			
			log.info("Asking store to update state value");
			storeSetState(name, data, options);
			this.emit("change");
		};
		
		this.value = () => {
			//log.info("Asking store for existing state value");
			return storeGetState(name);
		};
		
		this.context = () => {
			return this._Context;
		};
		
		this.Provider = (props) => {
			log.info("Rendering state provider");
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