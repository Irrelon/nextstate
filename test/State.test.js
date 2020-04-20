const assert = require("assert");
const {getStore, State} = require("../src/index");

describe("State", () => {
	describe("get()", () => {
		it("Will get data in state", () => {
			const stateInstance = new State("data", {
				"foo": true
			});
			
			const store = getStore();
			stateInstance.init(store);
			
			const result = stateInstance.get()(store)();
			
			assert.strictEqual(typeof result, "object", "Value is correct");
			assert.strictEqual(result.foo, true, "Value is correct");
		});
	});
	
	describe("set()", () => {
		it("Will set data in state", () => {
			const stateInstance = new State("data", {
				"foo": true
			});
			
			const store = getStore();
			stateInstance.init(store);
			
			const result1 = stateInstance.get()(store)();
			
			assert.strictEqual(typeof result1, "object", "Value is correct");
			assert.strictEqual(result1.foo, true, "Value is correct");
			
			stateInstance.set()(store)({
				"foo": false
			});
			
			const result2 = stateInstance.get()(store)();
			
			assert.strictEqual(typeof result2, "object", "Value is correct");
			assert.strictEqual(result2.foo, false, "Value is correct");
		});
	});
	
	describe("push()", () => {
		it("Will push and pull data in state", () => {
			const stateInstance = new State("data", []);
			const store = getStore();
			stateInstance.init(store);
			
			stateInstance.push()(store)("foo");
			stateInstance.push()(store)("bar");
			
			const result1 = stateInstance.get()(store)();
			
			assert.strictEqual(typeof result1, "object", "Value is correct");
			assert.strictEqual(result1.length, 2, "Value is correct");
			assert.strictEqual(result1[0], "foo", "Value is correct");
		});
		
		it("Will push data in state at a path", () => {
			const stateInstance = new State("data", {"item": {"items": []}});
			const store = getStore();
			stateInstance.init(store);
			
			stateInstance.pushByPath("item.items")(store)("foo");
			stateInstance.pushByPath("item.items")(store)("bar");
			const result1 = stateInstance.getByPath("item.items")(store);
			
			assert.strictEqual(typeof result1, "object", "Value is correct");
			assert.strictEqual(result1.length, 2, "Value is correct");
			assert.strictEqual(result1[0], "foo", "Value is correct");
		})
	});
	
	describe("pull()", () => {
		it("Will pull data in state", () => {
			const stateInstance = new State("data", ["foo", "bar"]);
			const store = getStore();
			stateInstance.init(store);
			
			const result1 = stateInstance.get()(store)();
			
			assert.strictEqual(typeof result1, "object", "Value is correct");
			assert.strictEqual(result1.length, 2, "Value is correct");
			assert.strictEqual(result1[0], "foo", "Value is correct");
			
			stateInstance.pull()(store)("foo");
			const result2 = stateInstance.get()(store)();
			
			assert.strictEqual(typeof result2, "object", "Value is correct");
			assert.strictEqual(result2.length, 1, "Value is correct");
			assert.strictEqual(result2[0], "bar", "Value is correct");
		});
		
		it("Will pull data in state at a path", () => {
			const stateInstance = new State("data", {"item": {"items": ["foo", "bar"]}});
			const store = getStore();
			stateInstance.init(store);
			
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
	});
	
	describe("update()", () => {
		it("Will update data in state", () => {
			const stateInstance = new State("data", {"foo": {"bar": "ram"}});
			const store = getStore();
			stateInstance.init(store);
			
			const result1 = stateInstance.get()(store)();
			
			assert.strictEqual(typeof result1, "object", "Value is correct");
			assert.strictEqual(result1.foo.bar, "ram", "Value is correct");
			
			stateInstance.update()(store)({"foo": {"bar": "boo"}});
			const result2 = stateInstance.get()(store)();
			
			assert.strictEqual(typeof result2, "object", "Value is correct");
			assert.strictEqual(result2.foo.bar, "boo", "Value is correct");
		});
	});
	
	describe("find()", () => {
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
			
			const result = stateInstance.find()(store)();
			assert.strictEqual(Array.isArray(result), true, "Value is correct");
			assert.strictEqual(result.length, 3, "Value is correct");
			assert.strictEqual(result[0]._id, "1", "Value is correct");
			assert.strictEqual(result[1]._id, "2", "Value is correct");
			assert.strictEqual(result[2]._id, "3", "Value is correct");
		});
	});
	
	describe("findOne()", () => {
		it("Will find one item of data in state", () => {
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
			
			const result = stateInstance.findOne()(store)();
			assert.strictEqual(Array.isArray(result), false, "Value is correct");
			assert.strictEqual(result._id, "1", "Value is correct");
		});
	});
	
	describe("findAndUpdate()", () => {
		it("Will find items of data in state and update them with an update function", () => {
			const stateInstance = new State("data", [{
				"_id": "1",
				"category": "a",
				"enabled": true
			}, {
				"_id": "2",
				"category": "a",
				"enabled": true
			}, {
				"_id": "3",
				"category": "b",
				"enabled": true
			}]);
			
			const store = getStore();
			stateInstance.init(store);
			
			const result1 = stateInstance.find()(store)();
			assert.strictEqual(Array.isArray(result1), true, "Value is correct");
			assert.strictEqual(result1.length, 3, "Value is correct");
			assert.strictEqual(result1[0]._id, "1", "Value is correct");
			assert.strictEqual(result1[1]._id, "2", "Value is correct");
			assert.strictEqual(result1[2]._id, "3", "Value is correct");
			
			const result2 = stateInstance.findAndUpdate()(store)({
				"category": "a"
			}, (item) => {
				item.category = "c";
				return item;
			});
			
			assert.strictEqual(Array.isArray(result2), true, "Value is correct");
			assert.strictEqual(result2[0]._id, "1", "Value is correct");
			assert.strictEqual(result2[0].category, "c", "Value is correct");
			assert.strictEqual(result2[1]._id, "2", "Value is correct");
			assert.strictEqual(result2[1].category, "c", "Value is correct");
		});
		
		it("Will find items of data in state and update them with an update object", () => {
			const stateInstance = new State("data", [{
				"_id": "1",
				"category": "a",
				"enabled": true
			}, {
				"_id": "2",
				"category": "a",
				"enabled": true
			}, {
				"_id": "3",
				"category": "b",
				"enabled": true
			}]);
			
			const store = getStore();
			stateInstance.init(store);
			
			const result1 = stateInstance.find()(store)();
			assert.strictEqual(Array.isArray(result1), true, "Value is correct");
			assert.strictEqual(result1.length, 3, "Value is correct");
			assert.strictEqual(result1[0]._id, "1", "Value is correct");
			assert.strictEqual(result1[1]._id, "2", "Value is correct");
			assert.strictEqual(result1[2]._id, "3", "Value is correct");
			
			const result2 = stateInstance.findAndUpdate()(store)({
				"category": "a"
			}, {
				"category": "c"
			});
			
			assert.strictEqual(Array.isArray(result2), true, "Value is correct");
			assert.strictEqual(result2[0]._id, "1", "Value is correct");
			assert.strictEqual(result2[0].category, "c", "Value is correct");
			assert.strictEqual(result2[1]._id, "2", "Value is correct");
			assert.strictEqual(result2[1].category, "c", "Value is correct");
		});
	});
	
	describe("findOneAndUpdate()", () => {
		it("Will find one item of data in state and update them with an update function", () => {
			const stateInstance = new State("data", [{
				"_id": "1",
				"category": "a",
				"enabled": true
			}, {
				"_id": "2",
				"category": "a",
				"enabled": true
			}, {
				"_id": "3",
				"category": "b",
				"enabled": true
			}]);
			
			const store = getStore();
			stateInstance.init(store);
			
			const result1 = stateInstance.find()(store)();
			assert.strictEqual(Array.isArray(result1), true, "Value is correct");
			assert.strictEqual(result1.length, 3, "Value is correct");
			assert.strictEqual(result1[0]._id, "1", "Value is correct");
			assert.strictEqual(result1[1]._id, "2", "Value is correct");
			assert.strictEqual(result1[2]._id, "3", "Value is correct");
			
			const result2 = stateInstance.findOneAndUpdate()(store)({
				"category": "a"
			}, (item) => {
				item.category = "c";
				return item;
			});
			
			assert.strictEqual(Array.isArray(result2), false, "Value is correct");
			assert.strictEqual(result2._id, "1", "Value is correct");
			assert.strictEqual(result2.category, "c", "Value is correct");
		});
		
		it("Will find one item of data in state and update them with an update object", () => {
			const stateInstance = new State("data", [{
				"_id": "1",
				"category": "a",
				"enabled": true
			}, {
				"_id": "2",
				"category": "a",
				"enabled": true
			}, {
				"_id": "3",
				"category": "b",
				"enabled": true
			}]);
			
			const store = getStore();
			stateInstance.init(store);
			
			const result1 = stateInstance.find()(store)();
			assert.strictEqual(Array.isArray(result1), true, "Value is correct");
			assert.strictEqual(result1.length, 3, "Value is correct");
			assert.strictEqual(result1[0]._id, "1", "Value is correct");
			assert.strictEqual(result1[1]._id, "2", "Value is correct");
			assert.strictEqual(result1[2]._id, "3", "Value is correct");
			
			const result2 = stateInstance.findOneAndUpdate()(store)({
				"category": "a"
			}, {
				"category": "c"
			});
			
			assert.strictEqual(Array.isArray(result2), false, "Value is correct");
			assert.strictEqual(result2._id, "1", "Value is correct");
			assert.strictEqual(result2.category, "c", "Value is correct");
		});
	});
	
	describe("findByPath()", () => {
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
	
	describe("findOneByPath()", () => {
		it("Will find one item of data in state by path", () => {
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
			
			const result = stateInstance.findOneByPath("items")(store)();
			assert.strictEqual(Array.isArray(result), false, "Value is correct");
			assert.strictEqual(result._id, "1", "Value is correct");
		});
	});
	
	describe("findAndUpdateByPath()", () => {
		it("Will find items of data in state and update them with an update function", () => {
			const stateInstance = new State("data", {items:[{
				"_id": "1",
				"category": "a",
				"enabled": true
			}, {
				"_id": "2",
				"category": "a",
				"enabled": true
			}, {
				"_id": "3",
				"category": "b",
				"enabled": true
			}]});
			
			const store = getStore();
			stateInstance.init(store);
			
			const result1 = stateInstance.findByPath("items")(store)();
			assert.strictEqual(Array.isArray(result1), true, "Value is correct");
			assert.strictEqual(result1.length, 3, "Value is correct");
			assert.strictEqual(result1[0]._id, "1", "Value is correct");
			assert.strictEqual(result1[1]._id, "2", "Value is correct");
			assert.strictEqual(result1[2]._id, "3", "Value is correct");
			
			const result2 = stateInstance.findAndUpdateByPath("items")(store)({
				"category": "a"
			}, (item) => {
				item.category = "c";
				return item;
			});
			
			assert.strictEqual(Array.isArray(result2), true, "Value is correct");
			assert.strictEqual(result2[0]._id, "1", "Value is correct");
			assert.strictEqual(result2[0].category, "c", "Value is correct");
			assert.strictEqual(result2[1]._id, "2", "Value is correct");
			assert.strictEqual(result2[1].category, "c", "Value is correct");
		});
		
		it("Will find items of data in state and update them with an update object", () => {
			const stateInstance = new State("data", {items:[{
				"_id": "1",
				"category": "a",
				"enabled": true
			}, {
				"_id": "2",
				"category": "a",
				"enabled": true
			}, {
				"_id": "3",
				"category": "b",
				"enabled": true
			}]});
			
			const store = getStore();
			stateInstance.init(store);
			
			const result1 = stateInstance.findByPath("items")(store)();
			assert.strictEqual(Array.isArray(result1), true, "Value is correct");
			assert.strictEqual(result1.length, 3, "Value is correct");
			assert.strictEqual(result1[0]._id, "1", "Value is correct");
			assert.strictEqual(result1[1]._id, "2", "Value is correct");
			assert.strictEqual(result1[2]._id, "3", "Value is correct");
			
			const result2 = stateInstance.findAndUpdateByPath("items")(store)({
				"category": "a"
			}, {
				"category": "c"
			});
			
			assert.strictEqual(Array.isArray(result2), true, "Value is correct");
			assert.strictEqual(result2[0]._id, "1", "Value is correct");
			assert.strictEqual(result2[0].category, "c", "Value is correct");
			assert.strictEqual(result2[1]._id, "2", "Value is correct");
			assert.strictEqual(result2[1].category, "c", "Value is correct");
		});
	});
	
	describe("findOneAndUpdateByPath()", () => {
		it("Will find one item of data in state and update them with an update function", () => {
			const stateInstance = new State("data", {items:[{
				"_id": "1",
				"category": "a",
				"enabled": true
			}, {
				"_id": "2",
				"category": "a",
				"enabled": true
			}, {
				"_id": "3",
				"category": "b",
				"enabled": true
			}]});
			
			const store = getStore();
			stateInstance.init(store);
			
			const result1 = stateInstance.findByPath("items")(store)();
			assert.strictEqual(Array.isArray(result1), true, "Value is correct");
			assert.strictEqual(result1.length, 3, "Value is correct");
			assert.strictEqual(result1[0]._id, "1", "Value is correct");
			assert.strictEqual(result1[1]._id, "2", "Value is correct");
			assert.strictEqual(result1[2]._id, "3", "Value is correct");
			
			const result2 = stateInstance.findOneAndUpdateByPath("items")(store)({
				"category": "a"
			}, (item) => {
				item.category = "c";
				return item;
			});
			
			assert.strictEqual(Array.isArray(result2), false, "Value is correct");
			assert.strictEqual(result2._id, "1", "Value is correct");
			assert.strictEqual(result2.category, "c", "Value is correct");
		});
		
		it("Will find one item of data in state and update them with an update object", () => {
			const stateInstance = new State("data", {items:[{
				"_id": "1",
				"category": "a",
				"enabled": true
			}, {
				"_id": "2",
				"category": "a",
				"enabled": true
			}, {
				"_id": "3",
				"category": "b",
				"enabled": true
			}]});
			
			const store = getStore();
			stateInstance.init(store);
			
			const result1 = stateInstance.findByPath("items")(store)();
			assert.strictEqual(Array.isArray(result1), true, "Value is correct");
			assert.strictEqual(result1.length, 3, "Value is correct");
			assert.strictEqual(result1[0]._id, "1", "Value is correct");
			assert.strictEqual(result1[1]._id, "2", "Value is correct");
			assert.strictEqual(result1[2]._id, "3", "Value is correct");
			
			const result2 = stateInstance.findOneAndUpdateByPath("items")(store)({
				"category": "a"
			}, {
				"category": "c"
			});
			
			assert.strictEqual(Array.isArray(result2), false, "Value is correct");
			assert.strictEqual(result2._id, "1", "Value is correct");
			assert.strictEqual(result2.category, "c", "Value is correct");
		});
	});
	
	describe("updateByPath()", () => {
		it("Will update data in state by path", () => {
			const stateInstance = new State("data", {"foo": {"bar": "ram"}});
			const store = getStore();
			stateInstance.init(store);
			
			const result1 = stateInstance.get()(store)();
			
			assert.strictEqual(typeof result1, "object", "Value is correct");
			assert.strictEqual(result1.foo.bar, "ram", "Value is correct");
			
			stateInstance.updateByPath("foo.bar")(store)("boo");
			const result2 = stateInstance.get()(store)();
			
			assert.strictEqual(typeof result2, "object", "Value is correct");
			assert.strictEqual(result2.foo.bar, "boo", "Value is correct");
		});
	});
	
	describe("pushByPath()", () => {
		it("Will push data in state at a path", () => {
			const stateInstance = new State("data", {"item": {"items": []}});
			const store = getStore();
			stateInstance.init(store);
			
			stateInstance.pushByPath("item.items")(store)("foo");
			stateInstance.pushByPath("item.items")(store)("bar");
			const result1 = stateInstance.getByPath("item.items")(store);
			
			assert.strictEqual(typeof result1, "object", "Value is correct");
			assert.strictEqual(result1.length, 2, "Value is correct");
			assert.strictEqual(result1[0], "foo", "Value is correct");
		});
	});
	
	describe("pullByPath()", () => {
		it("Will pull data in state at a path", () => {
			const stateInstance = new State("data", {"item": {"items": ["foo", "bar"]}});
			const store = getStore();
			stateInstance.init(store);
			
			const result1 = stateInstance.getByPath("item.items")(store);
			
			assert.strictEqual(typeof result1, "object", "Value is correct");
			assert.strictEqual(result1.length, 2, "Value is correct");
			assert.strictEqual(result1[0], "foo", "Value is correct");
			
			stateInstance.pullByPath("item.items")(store)("foo");
			const result2 = stateInstance.getByPath("item.items")(store);
			
			assert.strictEqual(typeof result2, "object", "Value is correct");
			assert.strictEqual(result2.length, 1, "Value is correct");
			assert.strictEqual(result2[0], "bar", "Value is correct");
		});
	});
	
	describe("getByPath()", () => {
		it("Will get data in state", () => {
			const stateInstance = new State("data", {myData: {yourData: {
						"foo": true
					}}});
			
			const store = getStore();
			stateInstance.init(store);
			
			const result = stateInstance.getByPath("myData.yourData")(store);
			
			assert.strictEqual(typeof result, "object", "Value is correct");
			assert.strictEqual(result.foo, true, "Value is correct");
		});
	});
	
	describe("setByPath()", () => {
		it("Will set data in state by path", () => {
			const stateInstance = new State("data", {myData: {yourData: {
						"foo": true
					}}});
			
			const store = getStore();
			stateInstance.init(store);
			
			const result1 = stateInstance.get()(store)();
			
			assert.strictEqual(typeof result1, "object", "Value is correct");
			assert.strictEqual(result1.myData.yourData.foo, true, "Value is correct");
			
			stateInstance.setByPath("myData.yourData.foo")(store)(false);
			
			const result2 = stateInstance.get()(store)();
			
			assert.strictEqual(typeof result2, "object", "Value is correct");
			assert.strictEqual(result2.myData.yourData.foo, false, "Value is correct");
		});
	});
});
