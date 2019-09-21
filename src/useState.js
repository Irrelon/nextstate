import React from "react";
import {getContext} from "./Store";
import {init as initLog} from "irrelon-log";
const log = initLog("useState");

const useState = (stateMap, ComponentToWrap) => {
	return class UseStateHOC extends React.PureComponent {
		static getInitialProps (ctx) {
			if (ComponentToWrap.getInitialProps) {
				return ComponentToWrap.getInitialProps(ctx);
			} else {
				return {};
			}
		}
		
		render () {
			const Context = getContext();
			
			if (!Context) {
				log.warn("Attempted to use state but no ProvideState was found in the upper tree nodes!");
				return <ComponentToWrap {...this.props} />
			}
			
			return (<Context.Consumer>
				{(storeContainer) => {
					if (!storeContainer || !storeContainer.stateStore) {
						return <ComponentToWrap {...this.props}>{this.props.children}</ComponentToWrap>
					}
					
					const store = storeContainer.stateStore;
					const stateMapKeys = Object.keys(stateMap);
					const stateData = {};
					
					log.debug('Mapping state keys:', JSON.stringify(stateMapKeys));
					
					stateMapKeys.forEach((propName) => {
						const stateName = stateMap[propName];
						
						if (typeof stateName !== "string") {
							throw new Error("Cannot map a state object to a prop name that is not a string!");
						}
						
						log.debug(`Assigning state ${stateName} to prop ${propName}`);
						stateData[propName] = store.get(stateName);
					});
					
					// Add the store to the prop "stateStore"
					stateData.stateStore = store;
					
					log.debug('Passing state data to component:', JSON.stringify(stateData));
					
					return <ComponentToWrap {...this.props} {...stateData}>{this.props.children}</ComponentToWrap>
				}}
			</Context.Consumer>);
		}
	};
};

export default useState;