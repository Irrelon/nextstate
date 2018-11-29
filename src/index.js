/**
 * Irrelon Nextstate - A high performance very lightweight react-based state management library.
 * MIT license.
 */
import Emitter from 'irrelon-emitter';
import React from "react";

/**
 * The StateController class manages states including their data
 * and mutations.
 */
class StateController {
	constructor (data) {
		this._data = data;
	}
	
	update (data) {
		if (!Object.is(this._data, data)) {
			if (typeof this._data === 'object' && typeof data === 'object') {
				// Mixin existing data
				this._data = {
					...this._data,
					...data
				};
			} else {
				this._data = data;
			}
			
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
}

// Give StateController's prototype the event emitter methods
// and functionality
Emitter(StateController);

const mapToStateData = (obj, overrides = {}) => {
	return Object.keys(obj).reduce((acc, key) => {
		acc[key] = overrides[key] || obj[key].find();
		
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
				stateControllerMap[key].on('change', this._changeHandlers[key]);
			});
		}
		
		componentWillUnmount () {
			Object.keys(stateControllerMap).forEach((key) => {
				stateControllerMap[key].off('change', this._changeHandlers[key]);
			});
		}
		
		generateHandleChangeByKey (componentInstance, key, stateController) {
			return function () {
				componentInstance.setState({
					[key]: stateController.find()
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