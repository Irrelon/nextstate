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

export default ProvideState;