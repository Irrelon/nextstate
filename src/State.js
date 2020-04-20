import {join as pathJoin} from "@irrelon/path";
import {init as initLog} from "irrelon-log";

const log = initLog("State");

/**
 * @typedef {object} PullOptions The pull operation options.
 * @property {boolean} [strict=true] Determines if the matching
 * system should expect every field in the source (state) object
 * to match every field in the query object exactly (strict) or
 * if the source only needs to match the fields defined in the
 * query object (non-strict).
 */

function State (name, initialData) {
	const _initialData = initialData;
	
	// Has to be a non-arrow function
	const init = function (store) {
		if (store.__initCache[name]) return;
		
		log.debug(`[${name}] Setting initial data...`);
		
		store.__initCache[name] = true;
		if (store.get(name) === undefined) {
			store.set(name, _initialData);
		}
	};
	
	init.__isNextStateStoreFunction = true;
	
	// These functions all have to be non-arrow functions as
	// we utilise them as objects and apply a .init() function
	// to each one
	const stateInstance = function (store) {
		return store.read(name);
	};
	
	stateInstance.init = init;
	
	stateInstance.update = function (store) {
		/**
		 * Updates (patches) the state, spreading the new value over
		 * the existing value if they are both objects or replacing
		 * outright if either is a primitive.
		 * value with.
		 * @param {*} newVal The new value to update the existing
		 */
		return (newVal) => {
			return store.update(name, newVal);
		};
	};
	
	stateInstance.get = function (store) {
		/**
		 * Gets the state value or the default value if the state value
		 * is currently undefined.
		 * @param {*} defaultVal The value to return if the current state
		 * is undefined.
		 * */
		return (defaultVal) => {
			return store.get(pathJoin(name), defaultVal);
		};
	};
	
	stateInstance.set = function (store) {
		/**
		 * Replaces the existing state value with the one passed.
		 * @param {*} newVal The new value to replace the existing
		 * value with.
		 */
		return (newVal) => {
			return store.set(pathJoin(name), newVal);
		};
	};
	
	stateInstance.push = function (store) {
		/**
		 * Pushes the passed value to the state array. If the state
		 * is not an array an error will occur.
		 * @param {*} newVal The new value to push to the state array.
		 */
		return (newVal) => {
			return store.push(pathJoin(name), newVal);
		};
	};
	
	stateInstance.pull = function (store) {
		/**
		 * Pulls the passed value to the state array. If the state
		 * is not an array an error will occur.
		 * @param {*} newVal The query value to pull from the state array.
		 * @param {PullOptions} [options] Options object.
		 */
		return (val, options = {strict: false}) => {
			return store.pull(pathJoin(name), val, options);
		};
	};
	
	stateInstance.find = function (store) {
		return (query = {}, options = {}) => {
			return store.find(pathJoin(name), query, options);
		};
	};
	
	stateInstance.findOne = function (store) {
		return (query = {}, options = {}) => {
			return store.findOne(pathJoin(name), query, options);
		};
	};
	
	stateInstance.findAndUpdate = function (store) {
		return (query = {}, update = {}, options = {}) => {
			return store.findAndUpdate(pathJoin(name), query, update, options);
		};
	};
	
	stateInstance.findOneAndUpdate = function (store) {
		return (query = {}, update = {}, options = {}) => {
			return store.findOneAndUpdate(pathJoin(name), query, update, options);
		};
	};
	
	stateInstance.findByPath = function (path = "") {
		return function (store) {
			return (query = {}, options = {}) => {
				return store.find(pathJoin(name, path), query, options);
			};
		}
	};
	
	stateInstance.findOneByPath = function (path = "") {
		return function (store) {
			return (query = {}, options = {}) => {
				return store.findOne(pathJoin(name, path), query, options);
			};
		}
	};
	
	stateInstance.findAndUpdateByPath = function (path = "") {
		return function (store) {
			return (query = {}, update = {}, options = {}) => {
				return store.findAndUpdate(pathJoin(name, path), query, update, options);
			};
		}
	};
	
	stateInstance.findOneAndUpdateByPath = function (path = "") {
		return function (store) {
			return (query = {}, update = {}, options = {}) => {
				return store.findOneAndUpdate(pathJoin(name, path), query, update, options);
			};
		}
	};
	
	stateInstance.updateByPath = function (path = "") {
		const updateByPath = function (store) {
			return (newVal) => store.update(pathJoin(name, path), newVal);
		};
		
		updateByPath.init = init;
		updateByPath.__isNextStateStoreFunction = true;
		
		return updateByPath;
	};
	
	stateInstance.pushByPath = function (path = "") {
		const pushByPath = function (store) {
			return (newVal) => store.push(pathJoin(name, path), newVal);
		};
		
		pushByPath.init = init;
		pushByPath.__isNextStateStoreFunction = true;
		
		return pushByPath;
	};
	
	stateInstance.pullByPath = function (path = "") {
		const pullByPath = function (store) {
			return (val) => store.pull(pathJoin(name, path), val, {strict: false});
		};
		
		pullByPath.init = init;
		pullByPath.__isNextStateStoreFunction = true;
		
		return pullByPath;
	};
	
	stateInstance.getByPath = function (path = "", defaultVal) {
		const getByPath = function (store) {
			return store.get(pathJoin(name, path), defaultVal);
		};
		
		getByPath.init = init;
		getByPath.__isNextStateStoreFunction = true;
		
		return getByPath;
	};
	
	stateInstance.setByPath = function (path = "") {
		const setByPath = function (store) {
			return (newVal) => store.set(pathJoin(name, path), newVal);
		};
		
		setByPath.init = init;
		setByPath.__isNextStateStoreFunction = true;
		
		return setByPath;
	};
	
	const functionArr = [
		"update",
		"get",
		"set",
		"push",
		"pull",
		"find",
		"findOne",
		"findAndUpdate",
		"findOneAndUpdate"
	];
	
	functionArr.forEach((funcName) => {
		stateInstance[funcName].init = init;
		stateInstance[funcName].__isNextStateStoreFunction = true;
	});
	
	return stateInstance;
}

export default State;
