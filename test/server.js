// Tell process we are on node
process.browser = false;

const {init: initLog} = require("irrelon-log");
const request = require("request");
const express = require("express");
const assert = require("assert");
const Emitter = require("@irrelon/emitter");
const {getStore} = require("../dist/index");

const events = new Emitter();
const app = express();
const log = initLog("Server parallel tests");

app.get("/", (req, res) => {
	try {
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
		
		const randomTimeout = Math.floor(Math.random() * 1000);
		
		setTimeout(() => {
			// Update a state, the store should then have the updated state
			store2.update("testState", {
				"testVal2": "bar"
			});
			
			// Check that the new store does not have the updated state
			assert.strictEqual(typeof store2.get("testState"), "object", "Test state in store is an object");
			assert.strictEqual(store2.get("testState").testVal1, true, "The testVal1 value in the store is correct");
			assert.strictEqual(store2.get("testState").testVal2, "bar", "The testVal2 value in the store is correct");
			assert.strictEqual(Object.keys(store2.exportData()).length, 1, "The number of state items in the store is correct");
			
			res.end();
		}, randomTimeout);
	} catch (e) {
		console.log(e);
		res.status(500).send(e);
	}
});

const server = app.listen();
const port = server.address().port;
const numTests = 300;
let completeCount = 0;

events.on("completed", () => {
	completeCount++;
	
	if (completeCount === numTests) {
		log.info(`Ran ${numTests} requests, none failed`);
		server.close();
	}
});

for (let i = 0; i < numTests; i++) {
	request(`http://localhost:${port}`, () => {
		events.emit("completed");
	});
}
