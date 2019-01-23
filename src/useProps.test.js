import React from 'react';
import StateController from './StateController';
import useProps from './useProps';
import TestRenderer from 'react-test-renderer';

// Ensure react components behave as client-side
// in our components that need to check, they check
// for process and process.browser flags
process.browser = true;

const state = new StateController({
	testVal: true
}, {
	name: 'TestState',
	debug: false
});

class InnerComponent extends React.Component {
	render () {
		return (
			<div>{this.props.componentData.testVal}</div>
		);
	}
}

const WrappedComponent = useProps({componentData: state}, InnerComponent, {debug: false});

describe('useProps', () => {
	it('WrappedComponent should render the correct state data before and after state updates', () => {
		let testRenderer,
			testInstance;
		
		testRenderer = TestRenderer.create(
			<WrappedComponent />
		);
		testInstance = testRenderer.root;
		
		expect(testInstance.findByType(InnerComponent).props.componentData.testVal).toBe(true);
		
		// Update the state and see if the new state is reflected in the component
		state.update({
			testVal: false
		});
		
		expect(testInstance.findByType(InnerComponent).props.componentData.testVal).toBe(false);
		
	});
});