// Tell components we're running on server
process.browser = false;

import {getStore} from "../dist/index";
import React from "react";
import state1 from "./state1";
import state2 from "./state2";
import App from "./App";
import InnerComponent from "./InnerComponent";
const assert = require("assert");
import { mount, shallow } from 'enzyme';

getStore();

let changeEventCount = 0;

beforeEach(() => {
	changeEventCount = 0;
});

describe("useState", function () {
	it("InnerComponent should be passed the correct boolean state data before and after state updates", function () {
		let testRenderer;
		
		assert.strictEqual(changeEventCount, 0);
		
		state1.update(true);
		
		assert.strictEqual(changeEventCount, 0);
		
		testRenderer = mount(
			<App />
		);
		
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1, true);
		assert.strictEqual(testRenderer.find("InnerComponent").props().someProp, "true dat");
		
		// Update the state and see if the new state is reflected in the component
		state1.update(false);
		
		assert.strictEqual(changeEventCount, 0);
		testRenderer.update();
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1, true);
		testRenderer.unmount();
	});
	
	it("InnerComponent should be passed the correct number state data before and after state updates", function () {
		let testRenderer;
		
		assert.strictEqual(changeEventCount, 0);
		
		state1.update(0);
		
		assert.strictEqual(changeEventCount, 0);
		
		testRenderer = mount(
			<App />
		);
		
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1, 0);
		
		// Update the state and see if the new state is reflected in the component
		state1.update(2);
		
		assert.strictEqual(changeEventCount, 0);
		testRenderer.update();
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1, 0);
		testRenderer.unmount();
	});
	
	it("InnerComponent should be passed the correct object key/val boolean state data before and after state updates", () => {
		let testRenderer;
		
		assert.strictEqual(changeEventCount, 0);
		
		state1.update({
			"testVal": true
		});
		state2.update({
			"testVal": true
		});
		
		assert.strictEqual(changeEventCount, 0);
		
		testRenderer = mount(
			<App />
		);
		testRenderer.update();
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal, true);
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp2.testVal, true);
		
		// Update the state and see if the new state is reflected in the component
		state1.update({
			"testVal": false
		});
		testRenderer.update();
		assert.strictEqual(changeEventCount, 0);
		
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal, true);
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp2.testVal, true);
	});
	
	it("Doesn't wipe out the other keys when you update a single key calling update()", () => {
		let testRenderer;
		
		assert.strictEqual(changeEventCount, 0);
		
		state1.update({
			"testVal": true,
			"otherVal": 12345
		});
		
		assert.strictEqual(changeEventCount, 0);
		
		testRenderer = mount(
			<App />
		);
		testRenderer.update();
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal, true);
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.otherVal, 12345);
		
		// Update the state and see if the new state is reflected in the component
		state1.update({
			"testVal": false
		});
		testRenderer.update();
		assert.strictEqual(changeEventCount, 0);
		
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal, true);
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.otherVal, 12345);
	});
	
	it("InnerComponent should be passed the correct object sub-key/val state data before and after state updates", () => {
		let testRenderer;
		
		const stateObj = {
			"testVal": {
				"foo": true
			}
		};
		
		assert.strictEqual(changeEventCount, 0);
		
		state1.update(stateObj);
		
		assert.strictEqual(changeEventCount, 0);
		
		testRenderer = mount(
			<App />
		);
		
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal.foo, true);
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp2, undefined);
		
		// Update the state and see if the new state is reflected in the component
		stateObj.testVal.foo = false;
		state1.update(stateObj);
		testRenderer.update();
		assert.strictEqual(changeEventCount, 0);
		
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal.foo, true);
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp2, undefined);
	});
	
	it("InnerComponent should be passed the correct object data state before and after state updates with two state updates", () => {
		let testRenderer;
		
		const stateObj = {
			"testVal": {
				"foo": true
			}
		};
		
		assert.strictEqual(changeEventCount, 0);
		
		state1.update(stateObj);
		state2.update({"testVal": false});
		
		assert.strictEqual(changeEventCount, 0);
		
		testRenderer = mount(
			<App />
		);
		
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal.foo, true);
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp2.testVal, false);
		
		// Update the state and see if the new state is reflected in the component
		stateObj.testVal.foo = false;
		state1.update(stateObj);
		state2.update({"testVal": true});
		testRenderer.update();
		assert.strictEqual(changeEventCount, 0);
		
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal.foo, true);
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp2.testVal, false);
	});
});