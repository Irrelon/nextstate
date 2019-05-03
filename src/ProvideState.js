import React from "react";

const ProvideState = (props) => {
	const ProvidedStates = props.stateArr.reduce((PreviousComponent, stateArrItem) => {
		if (PreviousComponent === null) {
			return (stateRenderProps) => <stateArrItem.Provider>{stateRenderProps.children}</stateArrItem.Provider>;
		}
		
		return (stateRenderProps) => <stateArrItem.Provider><PreviousComponent>{stateRenderProps.children}</PreviousComponent></stateArrItem.Provider>;
	}, null);
	
	return <ProvidedStates>{props.children}</ProvidedStates>;
};

const provideState = (stateArr, ComponentToWrap) => {
	return class ProvideStateHOC extends React.Component {
		static getInitialProps (ctx) {
			if (ComponentToWrap.getInitialProps) {
				return ComponentToWrap.getInitialProps(ctx);
			} else {
				return {};
			}
		}
		
		render () {
			return <ProvideState stateArr={stateArr}>
				<ComponentToWrap {...this.props}>{this.props.children}</ComponentToWrap>
			</ProvideState>;
		}
	};
};

export {
	ProvideState,
	provideState
};