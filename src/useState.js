import React from "react";
const Log = require("irrelon-log");
const log = new Log(`useState`);

const useState = (stateMap, ComponentToWrap) => {
	return class UseStateHOC extends React.Component {
		static getInitialProps (req) {
			if (ComponentToWrap.getInitialProps) {
				return ComponentToWrap.getInitialProps(req);
			} else {
				return {};
			}
		}
		
		render () {
			const stateMapKeys = Object.keys(stateMap);
			
			const ConsumedStates = stateMapKeys.reduce((PreviousComponent, stateName) => {
				return (stateRenderProps) => {
					const stateItem = stateMap[stateName];
					const Context = stateItem.context();
					
					return (<Context.Consumer>
						{(stateData) => {
							log.info(`Consumed context data for ${stateName} as ${JSON.stringify(stateData)}`);
							return <PreviousComponent {...stateRenderProps} {...{[stateName]: stateData}}>{stateRenderProps.children}</PreviousComponent>
						}}
					</Context.Consumer>)
				};
			}, ComponentToWrap);
			
			return <ConsumedStates>{this.props.children}</ConsumedStates>;
		}
	};
};

export default useState;