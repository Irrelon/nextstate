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
			<div>{JSON.stringify(this.props.componentData.testVal)}</div>
		);
	}
}

const WrappedComponent = useProps({componentData: state}, InnerComponent, {debug: false});

let changeEventCount = 0;

state.on("change", () => {
	changeEventCount++;
});

beforeEach(() => {
	changeEventCount = 0;
});

describe('useProps', () => {
	it('WrappedComponent should render the correct boolean state data before and after state updates', () => {
		let testRenderer,
			testInstance;
		
		expect(changeEventCount).toBe(0);
		
		state.update({
			testVal: true
		});
		
		expect(changeEventCount).toBe(1);
		
		testRenderer = TestRenderer.create(
			<WrappedComponent />
		);
		testInstance = testRenderer.root;
		
		expect(testInstance.findByType(InnerComponent).props.componentData.testVal).toBe(true);
		
		// Update the state and see if the new state is reflected in the component
		state.update({
			testVal: false
		});
		
		expect(changeEventCount).toBe(2);
		
		expect(testInstance.findByType(InnerComponent).props.componentData.testVal).toBe(false);
	});
	
	it('WrappedComponent should render the correct object state data before and after state updates', () => {
		let testRenderer,
			testInstance;
		
		const stateObj = {
			testVal: {
				foo: true
			}
		};
		
		expect(changeEventCount).toBe(0);
		
		state.update(stateObj);
		
		expect(changeEventCount).toBe(1);
		
		testRenderer = TestRenderer.create(
			<WrappedComponent />
		);
		testInstance = testRenderer.root;
		
		expect(testInstance.findByType(InnerComponent).props.componentData.testVal.foo).toBe(true);
		
		// Update the state and see if the new state is reflected in the component
		stateObj.testVal.foo = false;
		state.update(stateObj);
		
		expect(changeEventCount).toBe(2);
		
		expect(testInstance.findByType(InnerComponent).props.componentData.testVal.foo).toBe(false);
	});
});