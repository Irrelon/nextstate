// Tell process we are on node
process.browser = false;

const assert = require("assert");
const {getStore} = require("../dist");

describe("Store", () => {
	describe("getStore", () => {
		it("Should return a new store object whenever it is called server-side", () => {
			// Get a store
			const store1 = getStore({
				"testState": {
					"testVal1": true
				}
			});
			
			// Update a state, the store should then have the updated state
			store1.update("testState", {
				"testVal2": "foo"
			});
			
			assert.strictEqual(typeof store1.get("testState"), "object", "Test state in store is an object");
			assert.strictEqual(store1.get("testState").testVal1, true, "The testVal1 value in the store is correct");
			assert.strictEqual(store1.get("testState").testVal2, "foo", "The testVal2 value in the store is correct");
			assert.strictEqual(Object.keys(store1.exportData()).length, 1, "The number of state items in the store is correct");
			
			// Get a new store
			const store2 = getStore({
				"testState": {
					"testVal1": true
				}
			});
			
			// Check that the new store does not have the updated state
			assert.strictEqual(typeof store2.get("testState"), "object", "Test state in store is an object");
			assert.strictEqual(store2.get("testState").testVal1, true, "The testVal1 value in the store is correct");
			assert.strictEqual(store2.get("testState").testVal2, undefined, "The testVal2 value in the store is correct");
			assert.strictEqual(Object.keys(store2.exportData()).length, 1, "The number of state items in the store is correct");
		});
	});
});
