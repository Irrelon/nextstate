import React from "react";
import Emitter from "irrelon-emitter";

class StateController2 {
	constructor (initialData, options) {
		this._context = React.createContext(initialData);
	}
	
	update (data) {
	
	}
	
	value () {
		return {};
	}
	
	context () {
		return this._context;
	}
}

Emitter(StateController2);

export default StateController2;