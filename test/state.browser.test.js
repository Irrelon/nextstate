// Ensure react components behave as client-side
// in our components that need to check, they check
// for process and process.browser flags
process.browser = true;

import {getStore} from "../dist/index";
import {State} from "../dist/index";

const testState = new State("testState", {
	"testVal": true
});

const assert = require("assert");

beforeEach(() => {
	getStore();
});

describe("State", () => {
	it("Can use get() to find a value at a path", () => {
		testState.update({
			my: {
				test: {
					data: {
						foo: true
					}
				}
			}
		});
		
		assert.strictEqual(testState.get("my.test.data.foo"), true, "The value at the given path returned correctly");
	});
	
	it("Can use get() to find a value at a path and pass a default value to return when the path value is undefined", () => {
		testState.update({
			my: {
				test: {
					data: {
						foo: true
					}
				}
			}
		});
		
		assert.strictEqual(testState.get("my.test.data.bar", "MyDefaultVal"), "MyDefaultVal", "The value at the given path returned correctly");
	});
	
	it("Can use value() to get the current state in entirety", () => {
		testState.update({
			my: {
				test: {
					data: {
						foo: true
					}
				}
			}
		});
		
		assert.strictEqual(typeof testState.value(), "object", "The value at the given path returned correctly");
		assert.strictEqual(typeof testState.value().my, "object", "The value at the given path returned correctly");
		assert.strictEqual(typeof testState.value().my.test, "object", "The value at the given path returned correctly");
		assert.strictEqual(typeof testState.value().my.test.data, "object", "The value at the given path returned correctly");
		assert.strictEqual(typeof testState.value().my.test.data.foo, "boolean", "The value at the given path returned correctly");
	});
});