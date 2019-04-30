import React from "react";
import StateController from "./StateController";
import useProps from "./useProps";
import TestRenderer from "react-test-renderer";

// Ensure react components behave as client-side
// in our components that need to check, they check
// for process and process.browser flags
process.browser = true;

const state1 = new StateController({
	"testVal": true
}, {
	"name": "TestState1",
	"debug": false
});

const state2 = new StateController({
	"testVal": true
}, {
	"name": "TestState2",
	"debug": false
});

class InnerComponent extends React.Component {
	render () {
		return (
			<div>{JSON.stringify(this.props.stateProp1.testVal)} {JSON.stringify(this.props.stateProp2.testVal)}</div>
		);
	}
}

const ComponentWrappedInUseProps = useProps({
	"stateProp1": state1,
	"stateProp2": state2
}, InnerComponent, {
	"debug": false
});

let changeEventCount = 0;

state1.on("change", () => {
	changeEventCount++;
});

state2.on("change", () => {
	changeEventCount++;
});

beforeEach(() => {
	changeEventCount = 0;
});

describe("useProps", () => {
	it("ComponentWrappedInUseProps should be passed the correct boolean state data before and after state updates", () => {
		let testRenderer,
			testInstance;
		
		expect(changeEventCount).toBe(0);
		
		state1.update(true);
		
		expect(changeEventCount).toBe(1);
		
		testRenderer = TestRenderer.create(
			<ComponentWrappedInUseProps />
		);
		testInstance = testRenderer.root;
		
		expect(testInstance.findByType(InnerComponent).props.stateProp1).toBe(true);
		
		// Update the state and see if the new state is reflected in the component
		state1.update(false);
		
		expect(changeEventCount).toBe(2);
		
		expect(testInstance.findByType(InnerComponent).props.stateProp1).toBe(false);
	});
	
	it("ComponentWrappedInUseProps should be passed the correct object key/val boolean state data before and after state updates", () => {
		let testRenderer,
			testInstance;
		
		expect(changeEventCount).toBe(0);
		
		state1.update({
			"testVal": true
		});
		
		expect(changeEventCount).toBe(1);
		
		testRenderer = TestRenderer.create(
			<ComponentWrappedInUseProps />
		);
		testInstance = testRenderer.root;
		
		expect(testInstance.findByType(InnerComponent).props.stateProp1.testVal).toBe(true);
		expect(testInstance.findByType(InnerComponent).props.stateProp2.testVal).toBe(true);
		
		// Update the state and see if the new state is reflected in the component
		state1.update({
			"testVal": false
		});
		
		expect(changeEventCount).toBe(2);
		
		expect(testInstance.findByType(InnerComponent).props.stateProp1.testVal).toBe(false);
		expect(testInstance.findByType(InnerComponent).props.stateProp2.testVal).toBe(true);
	});
	
	it("ComponentWrappedInUseProps should be passed the correct object sub-key/val state data before and after state updates", () => {
		let testRenderer,
			testInstance;
		
		const stateObj = {
			"testVal": {
				"foo": true
			}
		};
		
		expect(changeEventCount).toBe(0);
		
		state1.update(stateObj);
		
		expect(changeEventCount).toBe(1);
		
		testRenderer = TestRenderer.create(
			<ComponentWrappedInUseProps />
		);
		testInstance = testRenderer.root;
		
		expect(testInstance.findByType(InnerComponent).props.stateProp1.testVal.foo).toBe(true);
		expect(testInstance.findByType(InnerComponent).props.stateProp2.testVal).toBe(true);
		
		// Update the state and see if the new state is reflected in the component
		stateObj.testVal.foo = false;
		state1.update(stateObj);
		
		expect(changeEventCount).toBe(2);
		
		expect(testInstance.findByType(InnerComponent).props.stateProp1.testVal.foo).toBe(false);
		expect(testInstance.findByType(InnerComponent).props.stateProp2.testVal).toBe(true);
	});
	
	it("ComponentWrappedInUseProps should be passed the correct object data state before and after state updates with two state updates", () => {
		let testRenderer,
			testInstance;
		
		const stateObj = {
			"testVal": {
				"foo": true
			}
		};
		
		expect(changeEventCount).toBe(0);
		
		state1.update(stateObj);
		state2.update({"testVal": false});
		
		expect(changeEventCount).toBe(2);
		
		testRenderer = TestRenderer.create(
			<ComponentWrappedInUseProps />
		);
		testInstance = testRenderer.root;
		
		expect(testInstance.findByType(InnerComponent).props.stateProp1.testVal.foo).toBe(true);
		expect(testInstance.findByType(InnerComponent).props.stateProp2.testVal).toBe(false);
		
		// Update the state and see if the new state is reflected in the component
		stateObj.testVal.foo = false;
		state1.update(stateObj);
		state2.update({"testVal": true});
		
		expect(changeEventCount).toBe(4);
		
		expect(testInstance.findByType(InnerComponent).props.stateProp1.testVal.foo).toBe(false);
		expect(testInstance.findByType(InnerComponent).props.stateProp2.testVal).toBe(true);
	});
});