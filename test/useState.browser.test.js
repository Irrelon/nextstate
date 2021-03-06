// Ensure react components behave as client-side
// in our components that need to check, they check
// for process and process.browser flags
process.browser = true;

import {getStore} from "../src/index";
import React from "react";
import App from "./App";
import InnerComponent from "./InnerComponent";
const assert = require("assert");
import { mount } from 'enzyme';
import {init as initLog, setLevel as setLogLevel} from "irrelon-log";
const log = initLog("irrelonNextState.browser.test");

setLogLevel("State=*,Store=*");

let changeEventCount = 0;
let stateStore = getStore({
	"state1": {
		"testVal": true
	},
	"state2": {
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

beforeEach(() => {
	changeEventCount = 0;
});

describe("Browser", () => {
	describe("irrelonNextState", function () {
		/*describe("getInitialProps()", () => {
			it("App should be passed the data from getInitialProps()", () => {
				let testRenderer;
				
				assert.strictEqual(changeEventCount, 0);
				
				stateStore.update("state1", true);
				assert.strictEqual(changeEventCount, 1);
				
				assert.strictEqual(stateStore.get("state1"), true, "The store data for state1 has the correct value");
				
				testRenderer = mount(
					<App stateStore={stateStore} />
				);
				testRenderer.update();
				console.log("Found", testRenderer.find("App").props());
				assert.strictEqual(testRenderer.find("App").props().pageProp, "isHere");
			});
		});*/
		
		describe("update()", () => {
			it("InnerComponent should be passed the correct boolean state data before and after state updates", function () {
				let testRenderer;
				
				assert.strictEqual(changeEventCount, 0);
				
				log.debug("CALLING PATCH");
				stateStore.update("state1", true);
				
				log.debug("SHOULD HAVE EMITTED BY NOW");
				assert.strictEqual(changeEventCount, 1);
				
				assert.strictEqual(stateStore.get("state1"), true, "The store data for state1 has the correct value");
				
				testRenderer = mount(
					<App stateStore={stateStore} />
				);
				
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1, true);
				assert.strictEqual(testRenderer.find("InnerComponent").props().someProp, "true dat");
				
				// Update the state and see if the new state is reflected in the component
				stateStore.update("state1", false);
				
				assert.strictEqual(changeEventCount, 2);
				testRenderer.update();
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1, false);
				testRenderer.unmount();
			});
			
			it("InnerComponent should be passed the correct number state data before and after state updates", function () {
				let testRenderer;
				
				assert.strictEqual(changeEventCount, 0);
				
				stateStore.update("state1", 0);
				
				assert.strictEqual(changeEventCount, 1);
				
				testRenderer = mount(
					<App stateStore={stateStore} />
				);
				
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1, 0);
				
				// Update the state and see if the new state is reflected in the component
				stateStore.update("state1", 2);
				
				assert.strictEqual(changeEventCount, 2);
				testRenderer.update();
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1, 2);
				testRenderer.unmount();
			});
			
			it("InnerComponent should be passed the correct object key/val boolean state data before and after state updates", () => {
				let testRenderer,
					testInstance;
				
				assert.strictEqual(changeEventCount, 0);
				
				stateStore.update("state1", {
					"testVal": true
				});
				stateStore.update("state2", {
					"testVal": true
				});
				
				assert.strictEqual(changeEventCount, 2);
				
				testRenderer = mount(
					<App stateStore={stateStore} />
				);
				testRenderer.update();
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal, true);
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp2.testVal, true);
				
				// Update the state and see if the new state is reflected in the component
				stateStore.update("state1", {
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
				
				stateStore.update("state1", {
					"testVal": true,
					"otherVal": 12345
				});
				
				assert.strictEqual(changeEventCount, 1);
				
				testRenderer = mount(
					<App stateStore={stateStore} />
				);
				testRenderer.update();
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal, true);
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.otherVal, 12345);
				
				// Update the state and see if the new state is reflected in the component
				stateStore.update("state1", {
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
				
				stateStore.update("state1", stateObj);
				
				assert.strictEqual(changeEventCount, 1);
				
				testRenderer = mount(
					<App stateStore={stateStore} />
				);
				
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal.foo, true);
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp2.testVal, true);
				
				// Update the state and see if the new state is reflected in the component
				stateObj.testVal.foo = false;
				stateStore.update("state1", stateObj);
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
				
				stateStore.update("state1", stateObj);
				stateStore.update("state2", {"testVal": false});
				
				assert.strictEqual(changeEventCount, 2);
				
				testRenderer = mount(
					<App stateStore={stateStore} />
				);
				
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal.foo, true);
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp2.testVal, false);
				
				// Update the state and see if the new state is reflected in the component
				stateObj.testVal.foo = false;
				stateStore.update("state1", stateObj);
				stateStore.update("state2", {"testVal": true});
				testRenderer.update();
				assert.strictEqual(changeEventCount, 4);
				
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.testVal.foo, false);
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp2.testVal, true);
			});
		});
		
		describe("push()", () => {
			it("Will correctly push data to an array", () => {
				let testRenderer;
				
				assert.strictEqual(changeEventCount, 0);
				
				stateStore.update("state1", []);
				
				assert.strictEqual(changeEventCount, 1);
				assert.strictEqual(Array.isArray(stateStore.get("state1")), true, "The store data for state1 has the correct value");
				
				testRenderer = mount(
					<App stateStore={stateStore} />
				);
				
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.length, 0);
				
				// Update the state and see if the new state is reflected in the component
				stateStore.push("state1", "foo");
				
				assert.strictEqual(changeEventCount, 2);
				testRenderer.update();
				assert.strictEqual(typeof testRenderer.find("InnerComponent").props().stateProp1, "object");
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.length, 1);
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1[0], "foo");
				testRenderer.unmount();
			});
			
			it("Will correctly pull data from an array", () => {
				let testRenderer;
				
				assert.strictEqual(changeEventCount, 0);
				
				stateStore.set("state1", [{
					"_id": "1",
					"name": "jim"
				}, {
					"_id": "2",
					"name": "brad"
				}]);
				
				assert.strictEqual(changeEventCount, 1);
				assert.strictEqual(Array.isArray(stateStore.get("state1")), true, "The store data for state1 has the correct value");
				
				testRenderer = mount(
					<App stateStore={stateStore} />
				);
				
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.length, 2);
				
				// Update the state and see if the new state is reflected in the component
				stateStore.pull("state1", {_id: "1"}, {strict: false});
				
				assert.strictEqual(changeEventCount, 2);
				testRenderer.update();
				assert.strictEqual(typeof testRenderer.find("InnerComponent").props().stateProp1, "object");
				assert.strictEqual(testRenderer.find("InnerComponent").props().stateProp1.length, 1);
				assert.deepEqual(testRenderer.find("InnerComponent").props().stateProp1[0], {
					"_id": "2",
					"name": "brad"
				});
				testRenderer.unmount();
			});
		});
	});
});
