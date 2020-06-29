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
	// This function checks if this is the first time a function has been
	// called on this State instance. If so, we first initialise the state
	// with any initial data we were given. We wait for the first call to
	// a function to do this because until a call is made, we are not aware
	// of what the `store` object will be, so setting initial data before
	// that point is impossible.
	const init = function (store) {
		if (store.__initCache[name]) {
			return;
		}
		
		log.debug(`[${name}] Setting initial data...`);
		
		store.__initCache[name] = true;
		if (store.get(name) === undefined) {
			store.set(name, _initialData);
		}
	};
	
	// This flag is used and applied to every function that needs to have
	// the init() function called on it when state is being updated.
	// By setting this flag we indicate the function is a state-based
	// function that might rely on some initial data to be populated in
	// the store via the init() function before we operate. It is primarily
	// used in the resolveMapping() function in irrelonNextState.js
	// IS VERY IMPORTANT AS WITHOUT THIS FLAG, THE FUNCTION WILL *NOT* BE
	// PASSED THE `store` INSTANCE!!!
	init.__isNextStateStoreFunction = true;
	
	// These functions all have to be non-arrow functions as
	// we utilise them as objects and apply a .init() function
	// to each one
	const stateInstance = function (store) {
		throw new Error("Please use one of the state methods!");
	};
	
	stateInstance.init = init;
	/**
	 * Gets the state value or the default value if the state value
	 * is currently undefined.
	 * @param {*} defaultVal The value to return if the current state
	 * is undefined.
	 * */
	stateInstance.get = function (defaultVal) {
		const get = function (store) {
			return store.get(name, defaultVal);
		};
		
		get.init = init;
		get.__isNextStateStoreFunction = true;
		
		return get;
	};
	
	stateInstance.set = function () {
		const set = function (store) {
			/**
			 * Replaces the existing state value with the one passed.
			 * @param {*} newVal The new value to replace the existing
			 * value with.
			 */
			return (newVal, options) => {
				log.debug(`[${name}] set() called...`);
				return store.set(name, newVal, options);
			};
		};
		
		set.init = init;
		set.__isNextStateStoreFunction = true;
		
		return set;
	};
	
	stateInstance.push = function () {
		const push = function (store) {
			/**
			 * Pushes the passed value to the state array. If the state
			 * is not an array an error will occur.
			 * @param {*} newVal The new value to push to the state array.
			 */
			return (newVal, options) => {
				log.debug(`[${name}] push() called...`, {newVal, options});
				
				return store.push(name, newVal, options);
			};
		};
		
		push.init = init;
		push.__isNextStateStoreFunction = true;
		
		return push;
	};
	
	stateInstance.pull = function () {
		const pull = function (store) {
			/**
			 * Pulls a single item matching the passed query from the state array.
			 * If the state is not an array an error will occur.
			 * @param {*} val The query to match.
			 * @param {PullOptions} [options] Options object.
			 */
			return (val, options) => {
				log.debug(`[${name}] pull() called...`, {val, options});
				
				return store.pull(name, val, {strict: false, ...options});
			};
		};
		
		pull.init = init;
		pull.__isNextStateStoreFunction = true;
		
		return pull;
	};
	
	stateInstance.update = function () {
		const update = function (store) {
			/**
			 * Updates (patches) the state, spreading the new value over
			 * the existing value if they are both objects or replacing
			 * outright if either is a primitive.
			 * value with.
			 * @param {*} newVal The new value to update the existing
			 */
			return (newVal, options) => {
				log.debug(`[${name}] update() called...`, {newVal, options});
				return store.update(name, newVal, options);
			};
		}
		
		update.init = init;
		update.__isNextStateStoreFunction = true;
		
		return update;
	};
	
	stateInstance.find = function () {
		const find = function (store) {
			return (query = {}, options) => {
				log.debug(`[${name}] find() called...`, {query, options});
				return store.find(name, query, options);
			};
		};
		
		find.init = init;
		find.__isNextStateStoreFunction = true;
		
		return find;
	};
	
	stateInstance.findOne = function () {
		const findOne = function (store) {
			return (query = {}, options) => {
				log.debug(`[${name}] findOne() called...`, {query, options});
				return store.findOne(name, query, options);
			};
		};
		
		findOne.init = init;
		findOne.__isNextStateStoreFunction = true;
		
		return findOne;
	};
	
	stateInstance.findAndUpdate = function () {
		const findAndUpdate = function (store) {
			return (query = {}, update = {}, options) => {
				log.debug(`[${name}] findAndUpdate() called...`, {query, update, options});
				return store.findAndUpdate(name, query, update, options);
			};
		};
		
		findAndUpdate.init = init;
		findAndUpdate.__isNextStateStoreFunction = true;
		
		return findAndUpdate;
	};
	
	stateInstance.findOneAndUpdate = function () {
		const findOneAndUpdate = function (store) {
			return (query = {}, update = {}, options) => {
				log.debug(`[${name}] findOneAndUpdate() called...`, {query, update, options});
				return store.findOneAndUpdate(name, query, update, options);
			};
		};
		
		findOneAndUpdate.init = init;
		findOneAndUpdate.__isNextStateStoreFunction = true;
		
		return findOneAndUpdate;
	};
	
	stateInstance.findByPath = function (initialPath) {
		const findByPath = function (store) {
			return function () {
				let path;
				let query;
				let options;
				
				if (arguments.length === 3) {
					path = pathJoin(initialPath, arguments[0]);
					query = arguments[1] || {};
					options = arguments[2];
				} else {
					path = initialPath;
					query = arguments[0] || {};
					options = arguments[1];
				}
				
				log.debug(`[${name}] findByPath() called...`, {path, query, options});
				return store.find(pathJoin(name, path), query, options);
			};
		};
		
		findByPath.init = init;
		findByPath.__isNextStateStoreFunction = true;
		
		return findByPath;
	};
	
	stateInstance.findOneByPath = function (initialPath) {
		const findOneByPath = function (store) {
			return function () {
				let path;
				let query;
				let options;
				
				if (arguments.length === 3) {
					path = pathJoin(initialPath, arguments[0]);
					query = arguments[1] || {};
					options = arguments[2];
				} else {
					path = initialPath;
					query = arguments[0] || {};
					options = arguments[1];
				}
				
				log.debug(`[${name}] findOneByPath() called...`, {path, query, options});
				return store.findOne(pathJoin(name, path), query, options);
			};
		};
		
		findOneByPath.init = init;
		findOneByPath.__isNextStateStoreFunction = true;
		
		return findOneByPath;
	};
	
	stateInstance.findAndUpdateByPath = function (initialPath) {
		const findAndUpdateByPath = function (store) {
			return function () {
				let path;
				let query;
				let update;
				let options;
				
				if (arguments.length === 4) {
					path = pathJoin(initialPath, arguments[0]);
					query = arguments[1] || {};
					update = arguments[2] || {};
					options = arguments[3];
				} else {
					path = initialPath;
					query = arguments[0] || {};
					update = arguments[1] || {};
					options = arguments[2];
				}
				
				log.debug(`[${name}] findAndUpdateByPath() called...`, {path, query, update, options});
				return store.findAndUpdate(pathJoin(name, path), query, update, options);
			};
		};
		
		findAndUpdateByPath.init = init;
		findAndUpdateByPath.__isNextStateStoreFunction = true;
		
		return findAndUpdateByPath;
	};
	
	stateInstance.findOneAndUpdateByPath = function (initialPath) {
		const findOneAndUpdateByPath = function (store) {
			return function () {
				let path;
				let query;
				let update;
				let options;
				
				if (arguments.length === 4) {
					path = pathJoin(initialPath, arguments[0]);
					query = arguments[1] || {};
					update = arguments[2] || {};
					options = arguments[3];
				} else {
					path = initialPath;
					query = arguments[0] || {};
					update = arguments[1] || {};
					options = arguments[2];
				}
				
				log.debug(`[${name}] findOneAndUpdateByPath() called...`, {path, query, update, options});
				return store.findOneAndUpdate(pathJoin(name, path), query, update, options);
			};
		};
		
		findOneAndUpdateByPath.init = init;
		findOneAndUpdateByPath.__isNextStateStoreFunction = true;
		
		return findOneAndUpdateByPath;
	};
	
	stateInstance.updateByPath = function (initialPath) {
		const updateByPath = function (store) {
			return function () {
				let path;
				let newVal;
				let options;
				
				if (arguments.length === 3) {
					path = pathJoin(initialPath, arguments[0]);
					newVal = arguments[1];
					options = arguments[2];
				} else {
					path = initialPath;
					newVal = arguments[0];
					options = arguments[1];
				}
				
				log.debug(`[${name}] updateByPath() called...`, {path, newVal, options});
				return store.update(pathJoin(name, path), newVal, options);
			}
		};
		
		updateByPath.init = init;
		updateByPath.__isNextStateStoreFunction = true;
		
		return updateByPath;
	};
	
	stateInstance.pushByPath = function (initialPath) {
		const pushByPath = function (store) {
			return function () {
				let path;
				let newVal;
				let options;
				
				if (arguments.length === 3 || (arguments.length === 2 && typeof arguments[0] === "string")) {
					path = pathJoin(initialPath, arguments[0]);
					newVal = arguments[1];
					options = arguments[2];
				} else {
					path = initialPath;
					newVal = arguments[0];
					options = arguments[1];
				}
				
				log.debug(`[${name}] pushByPath() called...`, {path, newVal, options});
				return store.push(pathJoin(name, path), newVal, options);
			};
		};
		
		pushByPath.init = init;
		pushByPath.__isNextStateStoreFunction = true;
		
		return pushByPath;
	};
	
	stateInstance.pullByPath = function (initialPath) {
		const pullByPath = function (store) {
			return function () {
				let path;
				let val;
				let options;
				
				if (arguments.length === 3 || (arguments.length === 2 && typeof arguments[0] === "string")) {
					path = pathJoin(initialPath, arguments[0]);
					val = arguments[1];
					options = arguments[2];
				} else {
					path = initialPath;
					val = arguments[0];
					options = arguments[1];
				}
				
				log.debug(`[${name}] pullByPath() called...`, {path, val, options});
				return store.pull(pathJoin(name, path), val, {strict: false, ...options});
			};
		};
		
		pullByPath.init = init;
		pullByPath.__isNextStateStoreFunction = true;
		
		return pullByPath;
	};
	
	stateInstance.getByPath = function (initialPath, defaultVal, options) {
		const getByPath = function (store) {
			if (initialPath === undefined) {
				return (path, defaultVal, options) => {
					log.debug(`[${name}] getByPath() called...`, {path});
					return store.get(pathJoin(name, path), defaultVal, options);
				};
			}
			
			const path = initialPath;
			
			log.debug(`[${name}] getByPath() called...`, {path});
			return store.get(pathJoin(name, path), defaultVal, options);
		};
		
		getByPath.init = init;
		getByPath.__isNextStateStoreFunction = true;
		
		return getByPath;
	};
	
	stateInstance.setByPath = function (initialPath) {
		const setByPath = function (store) {
			return function () {
				let path;
				let newVal;
				let options;
				
				if (arguments.length === 3) {
					path = pathJoin(initialPath, arguments[0]);
					newVal = arguments[1];
					options = arguments[2];
				} else {
					path = initialPath;
					newVal = arguments[0];
					options = arguments[1];
				}
				
				log.debug(`[${name}] setByPath() called...`, {path, newVal, options});
				return store.set(pathJoin(name, path), newVal, options);
			}
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
		"findOneAndUpdate",
		"findByPath",
		"findOneByPath",
		"findAndUpdateByPath",
		"findOneAndUpdateByPath",
		"updateByPath",
		"pushByPath",
		"pullByPath",
		"getByPath",
		"setByPath"
	];
	
	functionArr.forEach((funcName) => {
		stateInstance[funcName].init = init;
		stateInstance[funcName].__isNextStateStoreFunction = true;
	});
	
	return stateInstance;
}

export default State;
