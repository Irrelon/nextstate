import React from "react";
import {getContext} from "./Store";
import Log from "irrelon-log";
const log = new Log("useState");

const useState = (stateMap, ComponentToWrap) => {
	return class UseStateHOC extends React.Component {
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
				{(storeData) => {
					const stateMapKeys = Object.keys(stateMap);
					const stateData = {};
					
					log.info('Mapping state keys:', JSON.stringify(stateMapKeys), JSON.stringify(storeData));
					
					stateMapKeys.forEach((stateKey) => {
						log.info(`Assigning ${stateKey} as ${storeData[stateMap[stateKey].name()]}`);
						stateData[stateKey] = storeData[stateMap[stateKey].name()];
					});
					
					log.info('Passing state data to component:', JSON.stringify(stateData));
					
					return <ComponentToWrap {...this.props} {...stateData}>{this.props.children}</ComponentToWrap>
				}}
			</Context.Consumer>);
		}
	};
};

export default useState;