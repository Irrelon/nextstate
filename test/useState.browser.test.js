// Ensure react components behave as client-side
// in our components that need to check, they check
// for process and process.browser flags
process.browser = true;

import {getStore} from "../dist/index";
import React from "react";
import state1 from "./state1";
import state2 from "./state2";
import App from "./App";
import InnerComponent from "./InnerComponent";
const assert = require("assert");
import { mount, shallow } from 'enzyme';
import Log from "irrelon-log";
const log = new Log("useState.browser.test");

let changeEventCount = 0;

state1.on("change", () => {
	log.info('state1 change event fired');
	changeEventCount++;
});

state2.on("change", () => {
	log.info('state2 change event fired');
	changeEventCount++;
});

beforeEach(() => {
	log.info("Getting store...");
	getStore();
	changeEventCount = 0;
});

describe("useState", function () {
	it("InnerComponent should be passed the correct boolean state data before and after state updates", function () {
		let testRenderer;
		
		assert.strictEqual(changeEventCount, 0);
		
		log.info("CALLING UPDATE");
		state1.update(true);
		
		log.info("SHOULD HAVE EMITTED BY NOW");
		assert.strictEqual(changeEventCount, 1);
		
		testRenderer = mount(
			<App />
		);
		
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1, true);
		assert.strictEqual(testRenderer.find("InnerComponent").props().someProp, "true dat");
		
		// Update the state and see if the new state is reflected in the component
		state1.update(false);
		
		assert.strictEqual(changeEventCount, 2);
		testRenderer.update();
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1, false);
		testRenderer.unmount();
	});
	
	it("InnerComponent should be passed the correct number state data before and after state updates", function () {
		let testRenderer;
		
		assert.strictEqual(changeEventCount, 0);
		
		state1.update(0);
		
		assert.strictEqual(changeEventCount, 1);
		
		testRenderer = mount(
			<App />
		);
		
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1, 0);
		
		// Update the state and see if the new state is reflected in the component
		state1.update(2);
		
		assert.strictEqual(changeEventCount, 2);
		testRenderer.update();
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1, 2);
		testRenderer.unmount();
	});
	
	it("InnerComponent should be passed the correct object key/val boolean state data before and after state updates", () => {
		let testRenderer,
			testInstance;
		
		assert.strictEqual(changeEventCount, 0);
		
		state1.update({
			"testVal": true
		});
		state2.update({
			"testVal": true
		});
		
		assert.strictEqual(changeEventCount, 2);
		
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
		assert.strictEqual(changeEventCount, 3);
		
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal, false);
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp2.testVal, true);
	});
	
	it("Doesn't wipe out the other keys when you update a single key calling update()", () => {
		let testRenderer;
		
		assert.strictEqual(changeEventCount, 0);
		
		state1.update({
			"testVal": true,
			"otherVal": 12345
		});
		
		assert.strictEqual(changeEventCount, 1);
		
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
		assert.strictEqual(changeEventCount, 2);
		
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal, false);
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.otherVal, 12345);
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
		
		testRenderer = mount(
			<App />
		);
		
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal.foo, true);
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp2.testVal, true);
		
		// Update the state and see if the new state is reflected in the component
		stateObj.testVal.foo = false;
		state1.update(stateObj);
		testRenderer.update();
		assert.strictEqual(changeEventCount, 2);
		
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal.foo, false);
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp2.testVal, true);
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
		assert.strictEqual(changeEventCount, 4);
		
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal.foo, false);
		assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp2.testVal, true);
	});
});