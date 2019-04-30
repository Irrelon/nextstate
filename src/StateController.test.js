const assert = require("assert");
import StateController from "./StateController";

describe("StateController", () => {
	it("Should instantiate", () => {
		const state = new StateController({}, {
			"name": "TestState"
		});
		
		assert.strictEqual(state instanceof StateController, true, "Is correct type");
	});
	
	it("Should not pass by reference any object set as the initial value", () => {
		const myObj = {
			"my": {
				"data": true
			}
		};
		
		const state = new StateController(myObj, {
			"name": "TestState"
		});
		
		assert.notStrictEqual(state.value(), myObj, "Object is not passed by reference");
	});
	
	it("Should not pass by reference any object set as the value when calling overwrite()", () => {
		const myObj = {
			"my": {
				"data": true
			}
		};
		
		const state = new StateController({}, {
			"name": "TestState"
		});
		
		state.overwrite(myObj);
		
		assert.notStrictEqual(state.value(), myObj, "Object is not passed by reference");
	});
	
	it("Should have emitter methods", () => {
		const state = new StateController({}, {
			"name": "TestState"
		});
		
		assert.strictEqual(typeof state.emit, "function", "Has emit function");
		assert.strictEqual(typeof state.on, "function", "Has on function");
		assert.strictEqual(typeof state.once, "function", "Has once function");
		assert.strictEqual(typeof state.emitStatic, "function", "Has emitStatic function");
		assert.strictEqual(typeof state.off, "function", "Has off function");
		assert.strictEqual(typeof state.cancelStatic, "function", "Has cancelStatic function");
	});
	
	it("Should emit a change event when state updates", () => {
		const state = new StateController({}, {
			"name": "TestState"
		});
		
		let emitted = false;
		
		state.on("change", () => {
			emitted = true;
		});
		
		state.update({"foo": "bar"});
		
		assert.ok(emitted, "Change emitted");
	});
	
	it("Should get data based on path string from get()", () => {
		const state = new StateController({
			"my": {
				"data": true
			}
		}, {
			"name": "TestState"
		});
		
		assert.strictEqual(state.get("my.data"), true, "Data get worked");
	});
	
	it("Should get all data from value()", () => {
		const state = new StateController({
			"my": {
				"data": true
			}
		}, {
			"name": "TestState"
		});
		
		assert.strictEqual(typeof state.value(), "object", "Data is correct type");
		assert.strictEqual(typeof state.value().my, "object", "Data is correct type");
		assert.strictEqual(typeof state.value().my.data, "boolean", "Data is correct type");
	});
	
	it("Should replace all data when calling overwrite()", () => {
		const state = new StateController({
			"my": {
				"data": true
			}
		}, {
			"name": "TestState"
		});
		
		assert.strictEqual(typeof state.value(), "object", "Data is correct type");
		assert.strictEqual(typeof state.value().my, "object", "Data is correct type");
		assert.strictEqual(typeof state.value().my.data, "boolean", "Data is correct type");
		
		state.overwrite({
			"foo": "bar"
		});
		
		assert.strictEqual(typeof state.value(), "object", "Data is correct type");
		assert.strictEqual(typeof state.value().my, "undefined", "Data is correct type");
		assert.strictEqual(typeof state.value().foo, "string", "Data is correct type");
		assert.strictEqual(state.value().foo, "bar", "Data is correct value");
	});
});