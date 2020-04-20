const assert = require("assert");
const {getStore, State} = require("../src/index");

describe("State", () => {
	describe("get()", () => {
		it("Will set and get data in state", () => {
			const stateInstance = new State("data", {
				"foo": true
			});
			const store = getStore();
			stateInstance.init(store);
			
			const result = stateInstance.get(store)();
			
			assert.strictEqual(typeof result, "object", "Value is correct");
			assert.strictEqual(result.foo, true, "Value is correct");
		});
		
		it("Will push and pull data in state", () => {
			const stateInstance = new State("data", []);
			const store = getStore();
			stateInstance.init(store);
			
			stateInstance.push(store)("foo");
			stateInstance.push(store)("bar");
			const result1 = stateInstance.get(store)();
			
			assert.strictEqual(typeof result1, "object", "Value is correct");
			assert.strictEqual(result1.length, 2, "Value is correct");
			assert.strictEqual(result1[0], "foo", "Value is correct");
			
			stateInstance.pull(store)("foo");
			const result2 = stateInstance.get(store)();
			
			assert.strictEqual(typeof result2, "object", "Value is correct");
			assert.strictEqual(result2.length, 1, "Value is correct");
			assert.strictEqual(result2[0], "bar", "Value is correct");
		});
		
		it("Will push and pull data in state at a path", () => {
			const stateInstance = new State("data", {"item": {"items": []}});
			const store = getStore();
			stateInstance.init(store);
			
			stateInstance.pushByPath("item.items")(store)("foo");
			stateInstance.pushByPath("item.items")(store)("bar");
			const result1 = stateInstance.getByPath("item.items")(store);
			
			assert.strictEqual(typeof result1, "object", "Value is correct");
			assert.strictEqual(result1.length, 2, "Value is correct");
			assert.strictEqual(result1[0], "foo", "Value is correct");
			
			stateInstance.pullByPath("item.items")(store)("foo");
			const result2 = stateInstance.getByPath("item.items")(store);
			
			assert.strictEqual(typeof result2, "object", "Value is correct");
			assert.strictEqual(result2.length, 1, "Value is correct");
			assert.strictEqual(result2[0], "bar", "Value is correct");
		})
		
		it("Will find data in state", () => {
			const stateInstance = new State("data", [{
				"_id": "1",
				"category": "a"
			}, {
				"_id": "2",
				"category": "a"
			}, {
				"_id": "3",
				"category": "b"
			}]);
			
			const store = getStore();
			stateInstance.init(store);
			
			debugger;
			const result = stateInstance.find(store)();
			assert.strictEqual(Array.isArray(result), true, "Value is correct");
			assert.strictEqual(result.length, 3, "Value is correct");
			assert.strictEqual(result[0]._id, "1", "Value is correct");
			assert.strictEqual(result[1]._id, "2", "Value is correct");
			assert.strictEqual(result[2]._id, "3", "Value is correct");
		});
		
		it("Will find data in state by path with empty query", () => {
			const stateInstance = new State("data", {items:[{
					"_id": "1",
					"category": "a"
				}, {
					"_id": "2",
					"category": "a"
				}, {
					"_id": "3",
					"category": "b"
				}]});
			
			const store = getStore();
			stateInstance.init(store);
			
			const result = stateInstance.findByPath("items")(store)();
			
			assert.strictEqual(Array.isArray(result), true, "Value is correct");
			assert.strictEqual(result.length, 3, "Value is correct");
			assert.strictEqual(result[0]._id, "1", "Value is correct");
			assert.strictEqual(result[1]._id, "2", "Value is correct");
			assert.strictEqual(result[2]._id, "3", "Value is correct");
		});
		
		it("Will find data in state by path with non-empty query", () => {
			const stateInstance = new State("data", {items:[{
					"_id": "1",
					"category": "a"
				}, {
					"_id": "2",
					"category": "a"
				}, {
					"_id": "3",
					"category": "b"
				}]});
			
			const store = getStore();
			stateInstance.init(store);
			
			const result = stateInstance.findByPath("items")(store)({
				category: "a"
			});
			
			assert.strictEqual(Array.isArray(result), true, "Value is correct");
			assert.strictEqual(result.length, 2, "Value is correct");
			assert.strictEqual(result[0]._id, "1", "Value is correct");
			assert.strictEqual(result[1]._id, "2", "Value is correct");
		});
		
		it("Will find data in state by path with non-empty query and custom options", () => {
			const stateInstance = new State("data", {items:[{
					"_id": "1",
					"category": "a"
				}, {
					"_id": "2",
					"category": "a"
				}, {
					"_id": "3",
					"category": "b"
				}]});
			
			const store = getStore();
			stateInstance.init(store);
			
			const result = stateInstance.findByPath("items.0")(store)({
				category: "a"
			}, {includeRoot: true});
			
			assert.strictEqual(Array.isArray(result), true, "Value is correct");
			assert.strictEqual(result.length, 1, "Value is correct");
			assert.strictEqual(result[0]._id, "1", "Value is correct");
		});
	});
});
