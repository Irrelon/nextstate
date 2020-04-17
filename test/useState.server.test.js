// Tell components we're running on server
process.browser = false;

const {getStore} = require("../dist");
import React from "react";
import App from "./App";
import InnerComponent from "./InnerComponent";
const assert = require("assert");
import { mount } from 'enzyme/build';
import {init as initLog} from "irrelon-log";
const log = initLog("irrelonNextState.server.test");

let changeEventCount = 0;
let stateStore;

beforeEach(() => {
	stateStore = getStore({
		state1: {
			"testVal": true
		},
		state2: {
			"testVal": false
		}
	});
	
	stateStore.events.on("change", "state1", () => {
		log.debug('state1 change event fired');
		changeEventCount++;
	});
	
	stateStore.events.on("change", "state2", () => {
		log.debug('state2 change event fired');
		changeEventCount++;
	});
	
	changeEventCount = 0;
});

describe("Browser", () => {
	describe("irrelonNextState", function () {
		describe("patch()", () => {
			it("InnerComponent should be passed the correct boolean state data before and after state updates", function () {
				let testRenderer;
				
				assert.strictEqual(changeEventCount, 0);
				debugger;
				stateStore.patch("state1", true);
				
				assert.strictEqual(changeEventCount, 1);
				
				testRenderer = mount(
					<App stateStore={stateStore}/>
				);
				
				// Check the state prop is correct
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1, true);
				
				// Check that any other props we set on InnerComponent in the JSX are passed through correctly
				assert.strictEqual(testRenderer.find("InnerComponent").props().someProp, "true dat");
				
				// Update the state and see if the new state is reflected in the component
				stateStore.patch("state1", false);
				assert.strictEqual(changeEventCount, 2);
				
				testRenderer.update();
				
				// This should indeed be true even though we have updated the state because on server we render
				// only the initial state before the react tree started rendering.
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1, true);
				
				testRenderer.unmount();
			});
			
			it("InnerComponent should be passed the correct number state data before and after state updates", function () {
				let testRenderer;
				
				assert.strictEqual(changeEventCount, 0);
				
				stateStore.patch("state1", 0);
				
				assert.strictEqual(changeEventCount, 1);
				
				testRenderer = mount(
					<App stateStore={stateStore}/>
				);
				
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1, 0);
				
				// Update the state and see if the new state is reflected in the component
				stateStore.patch("state1", 2);
				
				assert.strictEqual(changeEventCount, 2);
				testRenderer.update();
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1, 0);
				testRenderer.unmount();
			});
			
			it("InnerComponent should be passed the correct object key/val boolean state data before and after state updates", () => {
				let testRenderer;
				
				assert.strictEqual(changeEventCount, 0);
				
				stateStore.patch("state1", {
					"testVal": true
				});
				stateStore.patch("state2", {
					"testVal": true
				});
				
				assert.strictEqual(changeEventCount, 2);
				
				testRenderer = mount(
					<App stateStore={stateStore}/>
				);
				testRenderer.update();
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal, true);
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp2.testVal, true);
				
				// Update the state and see if the new state is reflected in the component
				stateStore.patch("state1", {
					"testVal": false
				});
				testRenderer.update();
				assert.strictEqual(changeEventCount, 3);
				
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal, true);
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp2.testVal, true);
			});
			
			it("Doesn't wipe out the other keys when you update a single key calling patch()", () => {
				let testRenderer;
				
				assert.strictEqual(changeEventCount, 0);
				
				stateStore.patch("state1", {
					"testVal": true,
					"otherVal": 12345
				});
				
				assert.strictEqual(changeEventCount, 1);
				
				testRenderer = mount(
					<App stateStore={stateStore}/>
				);
				testRenderer.update();
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal, true);
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.otherVal, 12345);
				
				// Update the state and see if the new state is reflected in the component
				stateStore.patch("state1", {
					"testVal": false
				});
				testRenderer.update();
				assert.strictEqual(changeEventCount, 2);
				
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
				
				stateStore.patch("state1", stateObj);
				
				assert.strictEqual(changeEventCount, 1);
				
				testRenderer = mount(
					<App stateStore={stateStore}/>
				);
				
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal.foo, true);
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp2.testVal, false);
				
				// Update the state and see if the new state is reflected in the component
				stateObj.testVal.foo = false;
				stateStore.patch("state1", stateObj);
				testRenderer.update();
				assert.strictEqual(changeEventCount, 2);
				
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal.foo, false);
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp2.testVal, false);
			});
			
			it("InnerComponent should be passed the correct object data state before and after state updates with two state updates", () => {
				let testRenderer;
				
				const stateObj = {
					"testVal": {
						"foo": true
					}
				};
				
				assert.strictEqual(changeEventCount, 0);
				
				stateStore.patch("state1", stateObj);
				stateStore.patch("state2", {"testVal": false});
				
				assert.strictEqual(changeEventCount, 2);
				
				testRenderer = mount(
					<App stateStore={stateStore}/>
				);
				
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal.foo, true);
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp2.testVal, false);
				
				// Update the state and see if the new state is reflected in the component
				stateObj.testVal.foo = false;
				stateStore.patch("state1", stateObj);
				testRenderer.update();
				
				stateStore.patch("state2", {"testVal": true});
				
				// This is a hack because although the code above works, it's not doing it here :(
				testRenderer = mount(
					<App stateStore={stateStore}/>
				);
				
				assert.strictEqual(changeEventCount, 4);
				//console.log(stateStore._data, testRenderer.find("InnerComponent").props());
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal.foo, false);
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp2.testVal, true);
			});
		});
	});
});
