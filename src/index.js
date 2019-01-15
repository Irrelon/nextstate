/**
 * Irrelon Nextstate - A high performance very lightweight react-based state management library.
 * MIT license.
 */
import Emitter from 'irrelon-emitter';
import Path from 'irrelon-path';
import React from "react";

const pathSolver = new Path();

/**
 * The StateController class manages states including their data
 * and mutations.
 */
class StateController {
	constructor (data) {
		this._data = data;
	}
	
	debugLog (msg) {
		if (this._debug) {
			console.log(`NextState Debug :: ${msg}`);
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
		this.debugLog(`Asking to update state with ${JSON.stringify(data)}`);
		
		if (!Object.is(this._data, data)) {
			this.debugLog(`Updating state with ${JSON.stringify(data)}`);
			
			if (typeof this._data === 'object' && typeof data === 'object') {
				// Mixin existing data
				this.debugLog(`Mixing in ${JSON.stringify(data)}`);
				
				this._data = {
					...this._data,
					...data
				};
			} else {
				this.debugLog(`Assigning ${JSON.stringify(data)}`);
				
				this._data = data;
			}
			
			this.debugLog(`Update completed, new data ${JSON.stringify(this._data)}`);
			this.debugLog(`Emitting state change...`);
			
			this.emit('change');
		}
	}
	
	overwrite (data) {
		if (!Object.is(this._data, data)) {
			this._data = data;
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
		return pathSolver.get(this._data, path);
	}
}

// Give StateController's prototype the event emitter methods
// and functionality
Emitter(StateController);

const mapToStateData = (obj, overrides = {}) => {
	return Object.keys(obj).reduce((acc, key) => {
		acc[key] = overrides[key] || obj[key].value();
		
		return acc;
	}, {});
};

/**
 * Wraps the given component in a HOC that controls the props for the wrapped
 * component based on the stateControllerMap object passed in.
 * @param {Object} stateControllerMap The object containing the key value pairs
 * used to create props on the wrapped component. Each key becomes the prop name
 * used to access the value (state controller) data.
 * @param {React.Component} ComponentToWrap The react component to wrap in this
 * HOC so that it will receive new props when state data changes.
 * @returns {Class<React.Component>} The new HOC.
 */
const useProps = (stateControllerMap, ComponentToWrap) => {
	return class IrrelonNextStateHOC extends React.Component {
		static getInitialProps (ctx) {
			if (ComponentToWrap.getInitialProps) {
				return ComponentToWrap.getInitialProps(ctx)
					.then((dataProps) => {
						return {
							...dataProps,
							...mapToStateData(stateControllerMap)
						};
					});
			} else {
				return mapToStateData(stateControllerMap);
			}
		}
		
		constructor (props) {
			super(props);
			this._changeHandlers = {};
			
			this.state = {
				...mapToStateData(stateControllerMap, props)
			};
		}
		
		componentDidMount () {
			Object.keys(stateControllerMap).forEach((key) => {
				this._changeHandlers[key] = this.generateHandleChangeByKey(this, key, stateControllerMap[key]);
				
				stateControllerMap[key].debugLog(`Hooking state change event for prop "${key}"`);
				stateControllerMap[key].on('change', this._changeHandlers[key]);
			});
		}
		
		componentWillUnmount () {
			Object.keys(stateControllerMap).forEach((key) => {
				stateControllerMap[key].debugLog(`Unhooking state change event for prop "${key}"`);
				stateControllerMap[key].off('change', this._changeHandlers[key]);
			});
		}
		
		generateHandleChangeByKey (componentInstance, key, stateController) {
			stateController.debugLog(`Generating state change event handler for prop "${key}"`);
			
			return function () {
				stateController.debugLog(`Updating prop "${key}" to ${JSON.stringify(stateController.value())}`);
				
				componentInstance.setState({
					[key]: stateController.value()
				});
			};
		}
		
		render () {
			return (
				<ComponentToWrap
					{...this.props}
					{...this.state}
				/>
			);
		}
	};
};

export {
	StateController,
	useProps,
	mapToStateData
};