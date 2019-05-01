import React from "react";
import TestRenderer from "react-test-renderer";
import state1 from "./state1";
import state2 from "./state2";
import App from "./App";
import InnerComponent from "./InnerComponent";
const assert = require("assert");

// Ensure react components behave as client-side
// in our components that need to check, they check
// for process and process.browser flags
process.browser = true;

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

describe("useState", function () {
	it("InnerComponent should be passed the correct boolean state data before and after state updates", function () {
		let testRenderer,
			testInstance;
		
		assert.strictEqual(changeEventCount, 0);
		
		state1.update({testVal: true});
		
		assert.strictEqual(changeEventCount, 1);
		
		testRenderer = TestRenderer.create(
			<App />
		);
		testInstance = testRenderer.root;
		console.log(testInstance.findByType(InnerComponent).props);
		assert.strictEqual(testInstance.findByType(InnerComponent).props.stateProp1.testVal, true);
		
		// Update the state and see if the new state is reflected in the component
		state1.update({testVal: false});
		
		assert.strictEqual(changeEventCount, 2);
		
		assert.strictEqual(testInstance.findByType(InnerComponent).props.stateProp1.testVal, false);
	});
	
	it("InnerComponent should be passed the correct object key/val boolean state data before and after state updates", () => {
		let testRenderer,
			testInstance;
		
		assert.strictEqual(changeEventCount, 0);
		
		state1.update({
			"testVal": true
		});
		
		assert.strictEqual(changeEventCount, 1);
		
		testRenderer = TestRenderer.create(
			<App />
		);
		testInstance = testRenderer.root;
		
		assert.strictEqual(testInstance.findByType(InnerComponent).props.stateProp1.testVal, true);
		assert.strictEqual(testInstance.findByType(InnerComponent).props.stateProp2.testVal, true);
		
		// Update the state and see if the new state is reflected in the component
		state1.update({
			"testVal": false
		});
		
		assert.strictEqual(changeEventCount, 2);
		
		assert.strictEqual(testInstance.findByType(InnerComponent).props.stateProp1.testVal, false);
		assert.strictEqual(testInstance.findByType(InnerComponent).props.stateProp2.testVal, true);
	});
	
	it("InnerComponent should be passed the correct object sub-key/val state data before and after state updates", () => {
		let testRenderer,
			testInstance;
		
		const stateObj = {
			"testVal": {
				"foo": true
			}
		};
		
		assert.strictEqual(changeEventCount, 0);
		
		state1.update(stateObj);
		
		assert.strictEqual(changeEventCount, 1);
		
		testRenderer = TestRenderer.create(
			<App />
		);
		testInstance = testRenderer.root;
		
		assert.strictEqual(testInstance.findByType(InnerComponent).props.stateProp1.testVal.foo, true);
		assert.strictEqual(testInstance.findByType(InnerComponent).props.stateProp2.testVal, true);
		
		// Update the state and see if the new state is reflected in the component
		stateObj.testVal.foo = false;
		state1.update(stateObj);
		
		assert.strictEqual(changeEventCount, 2);
		
		assert.strictEqual(testInstance.findByType(InnerComponent).props.stateProp1.testVal.foo, false);
		assert.strictEqual(testInstance.findByType(InnerComponent).props.stateProp2.testVal, true);
	});
	
	it("InnerComponent should be passed the correct object data state before and after state updates with two state updates", () => {
		let testRenderer,
			testInstance;
		
		const stateObj = {
			"testVal": {
				"foo": true
			}
		};
		
		assert.strictEqual(changeEventCount, 0);
		
		state1.update(stateObj);
		state2.update({"testVal": false});
		
		assert.strictEqual(changeEventCount, 2);
		
		testRenderer = TestRenderer.create(
			<App />
		);
		testInstance = testRenderer.root;
		
		assert.strictEqual(testInstance.findByType(InnerComponent).props.stateProp1.testVal.foo, true);
		assert.strictEqual(testInstance.findByType(InnerComponent).props.stateProp2.testVal, false);
		
		// Update the state and see if the new state is reflected in the component
		stateObj.testVal.foo = false;
		state1.update(stateObj);
		state2.update({"testVal": true});
		
		assert.strictEqual(changeEventCount, 4);
		
		assert.strictEqual(testInstance.findByType(InnerComponent).props.stateProp1.testVal.foo, false);
		assert.strictEqual(testInstance.findByType(InnerComponent).props.stateProp2.testVal, true);
	});
});