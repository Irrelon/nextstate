import React from "react";
import {mapToStateData, getDisplayName} from "./utils";

/**
 * Wraps the given component in a HOC that controls the props for the wrapped
 * component based on the stateControllerMap object passed in.
 * @param {Object} stateControllerMap The object containing the key value pairs
 * used to create props on the wrapped component. Each key becomes the prop name
 * used to access the value (state controller) data.
 * @param {React.Component} ComponentToWrap The react component to wrap in this
 * HOC so that it will receive new props when state data changes.
 * @param {Object=} options An options object used to set flags like debug.
 * @returns {React.PureComponent} The new HOC.
 */
const useProps = (stateControllerMap, ComponentToWrap, options = {debug: false}) => {
	class IrrelonNextStateHOC extends React.PureComponent {
		static getInitialProps (ctx) {
			if (ComponentToWrap.getInitialProps) {
				return ComponentToWrap.getInitialProps(ctx)
					.then((dataProps) => {
						if (options.debug) {
							console.log(`NextState useProps :: (getInitialProps) Asking to map state controller data to props...`);
						}
						
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
			
			this.debugLog(`(constructor) *${this.props.debugTag || this.constructor.displayName}* Asking to map state controller data to props...`);
			this._changeHandlers = this._changeHandlers || {};
			
			this.state = {
				...mapToStateData(stateControllerMap, this.props)
			};
			
			// Only hook changes client-side
			if (!process || !process.browser) {
				this.debugLog(`(constructor) *${this.props.debugTag || this.constructor.displayName}* Event listeners not generated because we are running server-side`);
				return;
			}
			
			this.debugLog(`(constructor) *${this.props.debugTag || this.constructor.displayName}* Generating state event listeners...`);
			
			Object.keys(stateControllerMap).forEach((key) => {
				const stateController = stateControllerMap[key];
				this._changeHandlers[key] = this.generateHandleChangeByKey(this, key, stateController);
				
				stateController.debugLog(`(constructor) *${this.props.debugTag || this.constructor.displayName}* Hooking state change event for prop "${key}" in "${stateController.name()}"`);
				stateController.on('change', this._changeHandlers[key]);
			});
		}
		
		debugLog (msg) {
			if (options.debug) {
				console.log(`NextState useProps :: ${msg}`);
			}
		}
		
		componentWillUnmount () {
			// Only un-hook changes client-side
			if (!process || !process.browser) {
				return;
			}
			
			Object.keys(stateControllerMap).forEach((key) => {
				const changeHandler = this._changeHandlers[key];
				const stateController = stateControllerMap[key];
				
				stateControllerMap[key].debugLog(`(componentWillUnmount) *${this.props.debugTag || this.constructor.displayName}* Unhooking state change event for prop "${key}" in "${stateController.name()}"`);
				stateControllerMap[key].off('change', changeHandler);
			});
		}
		
		generateHandleChangeByKey (componentInstance, key, stateController) {
			stateController.debugLog(`(generateHandleChangeByKey) *${componentInstance.props.debugTag || componentInstance.constructor.displayName}* Generating state change event handler for prop "${key} in "${stateController.name()}"`);
			
			return function changeHandler () {
				stateController.debugLog(`(changeHandler) *${componentInstance.props.debugTag || componentInstance.constructor.displayName}* Updating prop "${key}" to ${JSON.stringify(stateController.value())}`);
				
				componentInstance.setState({
					[key]: stateController.value()
				});
			};
		}
		
		render () {
			const {forwardedRef, ...otherProps} = this.props;
			
			return (
				<ComponentToWrap
					ref={forwardedRef}
					{...otherProps}
					{...this.state}
				/>
			);
		}
	}
	
	IrrelonNextStateHOC.displayName = `IrrelonNextStateHOC(${getDisplayName(ComponentToWrap)})`;
	
	return IrrelonNextStateHOC;
};

export default useProps;