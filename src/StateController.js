import Emitter from 'irrelon-emitter';
const {get: pathGet} = require('irrelon-path');

/**
 * The StateController class manages states including their data
 * and mutations.
 */
class StateController {
	constructor (data, options) {
		this._data = JSON.parse(JSON.stringify(data));
		
		if (!options) {
			return;
		}
		
		this.name(options.name);
		this.debug(options.debug);
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
			console.log(`NextState StateController :: ${this.name() || 'Unnamed'} :: ${msg}`);
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
		
		if (!Object.is(this._data, data)) {
			this.debugLog(`(update) Updating state with ${JSON.stringify(data)}`);
			
			if (typeof this._data === 'object' && typeof data === 'object') {
				// Mixin existing data
				this.debugLog(`(update) Spreading ${JSON.stringify(data)}`);
				
				this._data = {
					...this._data,
					...data
				};
			} else {
				this.debugLog(`(update) Assigning ${JSON.stringify(data)}`);
				
				this._data = data;
			}
			
			this.debugLog(`(update) Update completed, new data ${JSON.stringify(this._data)}`);
			this.debugLog(`(update) Emitting state change...`);
			
			this.emit('change');
		}
	}
	
	overwrite (data) {
		if (!Object.is(this._data, data)) {
			this._data = JSON.parse(JSON.stringify(data));
			this.emit('change');
		}
	}
	
	value () {
		return this._data;
	}
	
	find (query, options) {
		return this._data;
	}
	
	get (path) {
		return pathGet(this._data, path);
	}
}

// Give StateController's prototype the event emitter methods
// and functionality
Emitter(StateController);

export default StateController;