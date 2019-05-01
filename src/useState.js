import React from "react";

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
			const stateMapKeys = Object.keys(stateMap);
			
			const ConsumedStates = stateMapKeys.reduce((PreviousComponent, stateName) => {
				return (stateRenderProps) => {
					const stateItem = stateMap[stateName];
					const Context = stateItem.context();
					
					return (<Context.Consumer>
						{(stateData) => {
							return <PreviousComponent {...stateRenderProps} {...{[stateName]: stateData}}>{stateRenderProps.children}</PreviousComponent>
						}}
					</Context.Consumer>)
				};
			}, ComponentToWrap);
			
			return <ConsumedStates {...this.props}>{this.props.children}</ConsumedStates>;
		}
	};
};

export default useState;