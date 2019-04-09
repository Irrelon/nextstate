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
			
			this.debugLog('(constructor) Asking to map state controller data to props...');
			this._changeHandlers = this._changeHandlers || {};
			
			this.state = {
				...mapToStateData(stateControllerMap, this.props)
			};
		}
		
		debugLog (msg) {
			if (options.debug) {
				console.log(`NextState useProps :: ${msg}`);
			}
		}
		
		componentWillMount () {
			// Only hook changes client-side
			if (!process || !process.browser) {
				this.debugLog('(componentWillMount) Event listeners not generated because we are running server-side');
				return;
			}
			
			this.debugLog('(componentWillMount) Generating state event listeners...');
			
			Object.keys(stateControllerMap).forEach((key) => {
				this._changeHandlers[key] = this.generateHandleChangeByKey(this, key, stateControllerMap[key]);
				
				stateControllerMap[key].debugLog(`(componentWillMount) Hooking state change event for prop "${key}"`);
				stateControllerMap[key].on('change', this._changeHandlers[key]);
			});
		}
		
		componentWillUnmount () {
			// Only un-hook changes client-side
			if (!process || !process.browser) {
				return;
			}
			
			Object.keys(stateControllerMap).forEach((key) => {
				stateControllerMap[key].debugLog(`(componentWillUnmount) Unhooking state change event for prop "${key}"`);
				stateControllerMap[key].off('change', this._changeHandlers[key]);
			});
		}
		
		generateHandleChangeByKey (componentInstance, key, stateController) {
			stateController.debugLog(`(generateHandleChangeByKey) Generating state change event handler for prop "${key}"`);
			
			return function changeHandler () {
				stateController.debugLog(`(changeHandler) Updating prop "${key}" to ${JSON.stringify(stateController.value())}`);
				
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