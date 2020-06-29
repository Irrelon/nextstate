import React from "react";
import Emitter from "@irrelon/emitter";
import {
	get as pathGet,
	setImmutable as pathSet,
	pushValImmutable as pathPush,
	pullValImmutable as pathPull,
	findPath as pathFindPath,
	findOnePath as pathFindOnePath,
	diff as pathDiff,
	decouple as pathDecouple,
	join as pathJoin,
	up as pathUp
} from "@irrelon/path";
import {init as initLog, setLevel as setLogLevel} from "irrelon-log";

const log = initLog("Store");
const _context = React.createContext(null);

/**
 * @typedef {object} UpdateOptions An update operation options object.
 * @property {boolean} [strict=false] If set to true, only updates exact
 * object matches.
 * @property {boolean} [dataFunction=true] If set to true, treats any
 * function passed in the update argument of an update() call to be a
 * function that returns the update data, rather than itself being the
 * actual data to set.
 */

const decouple = (obj) => {
	if (typeof obj !== "object") {
		return obj;
	}
	
	if (obj.__isNextStateStore === true) {
		log.error("Attempting to decouple a primary store object!");
	}
	
	return JSON.parse(JSON.stringify(obj));
};

const getContext = () => {
	return _context;
};

const getStore = (initialData) => {
	if (!process || !process.browser) {
		// Init a new store object whenever we are on the server
		return create(initialData);
	}
	
	if (window._nextStateStore) {
		log.debug("Already have a store, using existing one");
		return window._nextStateStore;
	}
	
	window._nextStateStore = create(initialData);
	return window._nextStateStore;
};

const get = (store, path, defaultVal, options) => {
	if (!store || !store.__isNextStateStore) {
		throw new Error("Cannot call get() without passing a store retrieved with getStore()!");
	}
	
	if (path === undefined) {
		throw new Error("Cannot call get() without state name or state path in path argument!");
	}
	
	return pathGet(store._data, path, defaultVal);
};

const set = (store, path, newState, options = {}) => {
	if (!store || !store.__isNextStateStore) {
		throw new Error("Cannot call set() without passing a store retrieved with getStore()!");
	}
	
	if (path === undefined) {
		throw new Error("Cannot call set() without state name or state path in path argument!");
	}
	
	// Check if new state is same as old
	const currentState = pathGet(store._data, path);
	const diff = pathDiff(currentState, newState);
	
	store._data = pathSet(store._data, path, newState);
	
	if (!diff) {
		log.debug(`[${path}] Diff was the same so no change event`);
		return store;
	}
	
	log.debug(`[${path}] Diff was different so emitting change event`, diff);
	store.events.emitId("change", path, newState);
	
	return store;
};

const push = (store, path, newVal, options = {}) => {
	if (!store || !store.__isNextStateStore) {
		throw new Error("Cannot call push() without passing a store retrieved with getStore()!");
	}
	
	const currentState = get(store, path);
	const newState = pathPush(currentState, "", newVal);
	
	return set(store, path, newState, options);
};

const pull = (store, path, val, options = {strict: false}) => {
	if (!store || !store.__isNextStateStore) {
		throw new Error("Cannot call pull() without passing a store retrieved with getStore()!");
	}
	
	const currentState = get(store, path);
	const newState = pathPull(currentState, "", val, options);
	
	return set(store, path, newState, options);
};

/**
 * Update the store at a given path with new data.
 * @param {Store} store The store to operate on.
 * @param {String} path The path to the data to operate on.
 * @param {*|Function} newState The new data to update to,
 * or a function that returns the new data to update to. If
 * you wish to pass a function so that you can return data
 * dynamically based on other factors, ensure you have set
 * the options.dataFunction to true, otherwise the update
 * will set the passed function as the new data rather than
 * calling it to get new data.
 * @param {UpdateOptions} [options={}] The update options object.
 * @returns {*}
 */
const update = (store, path, newState, options = {strict: false, dataFunction: true}) => {
	if (!store || !store.__isNextStateStore) {
		throw new Error("Cannot call update() without passing a store retrieved with getStore()!");
	}
	
	const currentState = get(store, path);
	
	if (typeof newState === "function" && options.dataFunction === true) {
		// Call the function to get the update data
		return update(newState(currentState, path));
	}
	
	if (typeof currentState === "object" && typeof newState === "object") {
		// Spread the current state and the new data
		if (Array.isArray(currentState)) {
			if (Array.isArray(newState)) {
				return set(store, path, [
					...currentState,
					...pathDecouple(newState, {immutable: true})
				], options);
			}
			
			return set(store, path, {
				...pathDecouple(newState, {immutable: true})
			}, options);
		} else {
			if (Array.isArray(newState)) {
				return set(store, path, [
					...pathDecouple(newState, {immutable: true})
				], options);
			}
		}
		
		return set(store, path, {
			...currentState,
			...pathDecouple(newState, {immutable: true})
		}, options);
	}
	
	// We're not setting an object, we are setting a primitive so
	// simply overwrite the existing data
	return set(store, path, newState, options);
};

const find = (store, path, query, options = {}) => {
	if (!store || !store.__isNextStateStore) {
		throw new Error("Cannot call find() without passing a store retrieved with getStore()!");
	}
	
	let maxDepth = Infinity;
	
	if (query === undefined || (typeof query === "object" && !Object.keys(query).length)) {
		maxDepth = 1;
	}
	
	options = {strict: false, maxDepth, includeRoot: false, ...options};
	
	const currentState = get(store, path);
	const matchResult = pathFindPath(currentState, query, options);
	
	if (matchResult.match) {
		return matchResult.path.map((path) => pathGet(currentState, path));
	} else {
		return [];
	}
};

const findOne = (store, path, query, options = {strict: false}) => {
	if (!store || !store.__isNextStateStore) {
		throw new Error("Cannot call findOne() without passing a store retrieved with getStore()!");
	}
	
	let maxDepth = Infinity;
	
	if (query === undefined || (typeof query === "object" && !Object.keys(query).length)) {
		maxDepth = 1;
	}
	
	options = {strict: false, maxDepth, includeRoot: false, ...options};
	
	const currentState = get(store, path);
	const matchResult = pathFindOnePath(currentState, query, options);
	
	if (matchResult.match) {
		return pathGet(currentState, matchResult.path);
	} else {
		return undefined;
	}
};

const findAndUpdate = (store, path, query, updateData, options = {strict: false, dataFunction: true}) => {
	if (!store || !store.__isNextStateStore) {
		throw new Error("Cannot call findAndUpdate() without passing a store retrieved with getStore()!");
	}
	
	const currentState = get(store, path);
	const matchResult = pathFindPath(currentState, query);
	
	if (matchResult.match) {
		return matchResult.path.map((matchResultPath) => {
			const updatePath = pathJoin(path, matchResultPath);
			let finalUpdateData = updateData;
			
			// Check if the updateData is a function
			if (typeof updateData === "function") {
				// Get the new update data for this item
				// from the function
				finalUpdateData = updateData(pathGet(currentState, matchResultPath), matchResultPath);
			}
			
			// Update the record
			update(store, updatePath, finalUpdateData, options);
			
			// Return the updated record
			return get(store, updatePath);
		});
	} else {
		return [];
	}
};

const findOneAndUpdate = (store, path, query, updateData, options = {strict: false, dataFunction: true}) => {
	if (!store || !store.__isNextStateStore) {
		throw new Error("Cannot call findOne() without passing a store retrieved with getStore()!");
	}
	
	const currentState = get(store, path);
	const matchResult = pathFindOnePath(currentState, query);
	
	if (matchResult.match) {
		const updatePath = pathJoin(path, matchResult.path);
		let finalUpdateData = updateData;
		
		// Check if the updateData is a function
		if (typeof updateData === "function" && options.dataFunction === true) {
			// Get the new update data for this item
			// from the function
			finalUpdateData = updateData(pathGet(currentState, matchResult.path), matchResult.path);
		}
		
		// Update the record
		update(store, updatePath, finalUpdateData, options);
		
		// Return the updated record
		return get(store, updatePath);
	} else {
		return undefined;
	}
};

const findOneAndPull = (store, path, query, options = {strict: false}) => {
	if (!store || !store.__isNextStateStore) {
		throw new Error("Cannot call findOne() without passing a store retrieved with getStore()!");
	}

	const currentState = get(store, path);
	const matchResult = pathFindOnePath(currentState, query);

	if (matchResult.match) {
		const pullPath = pathJoin(path, matchResult.path);
		const recordToPull = get(store, pullPath);

		// Pull the record
		pull(store, pathUp(pullPath), recordToPull, options);

		// Return the pulled record
		return recordToPull;
	} else {
		return undefined;
	}
};

const findOneAndPushToPath = (store, path, query, pushPath, pushVal, options = {strict: false}) => {
	if (!store || !store.__isNextStateStore) {
		throw new Error("Cannot call findOne() without passing a store retrieved with getStore()!");
	}

	const currentState = get(store, path);
	const matchResult = pathFindOnePath(currentState, query);

	if (matchResult.match) {
		const finalPushPath = pathJoin(path, matchResult.path, pushPath);

		// Pull the record
		push(store, finalPushPath, pushVal, options);

		// Return the array the data was pushed to
		return get(store, finalPushPath);
	} else {
		return undefined;
	}
};

const value = (store, key) => {
	if (!store || !store.__isNextStateStore) {
		throw new Error("Cannot call value() without passing a store retrieved with getStore()!");
	}
	
	if (!key) {
		throw new Error("Cannot call value() without passing a key to retrieve!");
	}
	
	return store._data[key];
};

const exportData = (store) => {
	if (!store || !store.__isNextStateStore) {
		throw new Error("Cannot call exportData() without passing a store retrieved with getStore()!");
	}
	
	return decouple(store._data);
};

const create = (initialData) => {
	//log.debug("Creating new store with initialData:", JSON.stringify(initialData));
	
	const newStoreData = {...initialData};
	const storeObj = {_data: newStoreData,
		events: new Emitter(),
		__isNextStateStore: true,
		__storeCreated: new Date().toISOString(),
		__initCache: {}
	};
	
	// Add shortcut methods to the store object
	storeObj.get = (path, defaultVal, options) => {
		return get(storeObj, path, defaultVal, options);
	};
	
	storeObj.set = (path, newState, options) => {
		return set(storeObj, path, newState, options);
	};
	
	storeObj.push = (path, newVal, options) => {
		return push(storeObj, path, newVal, options);
	};
	
	storeObj.pull = (path, val, options) => {
		return pull(storeObj, path, val, options);
	};
	
	storeObj.update = (path, newState, options) => {
		return update(storeObj, path, newState, options);
	};
	
	storeObj.find = (path, query, options) => {
		return find(storeObj, path, query, options);
	};
	
	storeObj.findOne = (path, query, options) => {
		return findOne(storeObj, path, query, options);
	};
	
	storeObj.findAndUpdate = (path, query, update, options) => {
		return findAndUpdate(storeObj, path, query, update, options);
	};
	
	storeObj.findOneAndUpdate = (path, query, update, options) => {
		return findOneAndUpdate(storeObj, path, query, update, options);
	};

	storeObj.findOneAndPull = (path, query, update, options) => {
		return findOneAndPull(storeObj, path, query, update, options);
	};

	storeObj.findOneAndPushToPath = (path, query, pushPath, pushVal, options) => {
		return findOneAndPushToPath(storeObj, path, query, pushPath, pushVal, options);
	};
	
	storeObj.value = (path) => {
		return value(storeObj, path);
	};
	
	storeObj.exportData = () => {
		return exportData(storeObj);
	};
	
	storeObj.getContext = () => {
		return getContext();
	};
	
	return storeObj;
};

export default {
	getStore,
	get,
	set,
	update,
	value,
	exportData,
	getContext,
	setLogLevel
};

export {
	getStore,
	get,
	set,
	update,
	value,
	exportData,
	getContext,
	setLogLevel
};
