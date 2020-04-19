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
	decouple as pathDecouple
} from "@irrelon/path";
import {init as initLog, setLevel as setLogLevel} from "irrelon-log";

const log = initLog("Store");
const _context = React.createContext(null);

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
	
	store.events.emitId("change", path, newState);
	
	return store;
};

const update = (store, path, newState, options = {}) => {
	if (!store || !store.__isNextStateStore) {
		throw new Error("Cannot call update() without passing a store retrieved with getStore()!");
	}
	
	const currentState = get(store, path);
	
	if (typeof newState === "function") {
		// Call the function to get the update data
		return update(newState(store, path, currentState, options));
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

const find = (store, path, query, options = {strict: false}) => {
	if (!store || !store.__isNextStateStore) {
		throw new Error("Cannot call find() without passing a store retrieved with getStore()!");
	}
	
	const currentState = get(store, path);
	const matchResult = pathFindPath(currentState, query);
	
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
	
	const currentState = get(store, path);
	const matchResult = pathFindOnePath(currentState, query);
	
	if (matchResult.match) {
		return pathGet(currentState, matchResult.path);
	} else {
		return undefined;
	}
};

const findAndUpdate = (store, path, query, updateData, options = {strict: false}) => {
	if (!store || !store.__isNextStateStore) {
		throw new Error("Cannot call findAndUpdate() without passing a store retrieved with getStore()!");
	}
	
	const currentState = get(store, path);
	const matchResult = pathFindPath(currentState, query);
	
	if (matchResult.match) {
		return matchResult.path.map((matchResultPath) => {
			// Update the record
			update(store, matchResultPath, updateData);
			
			// Return the updateed record
			return pathGet(currentState, matchResultPath)
		});
	} else {
		return [];
	}
};

const findOneAndUpdate = (store, path, query, updateData, options = {strict: false}) => {
	if (!store || !store.__isNextStateStore) {
		throw new Error("Cannot call findOne() without passing a store retrieved with getStore()!");
	}
	
	const currentState = get(store, path);
	const matchResult = pathFindOnePath(currentState, query);
	
	if (matchResult.match) {
		// Update the record
		update(store, matchResult.path, updateData);
		
		// Return the updateed record
		return pathGet(currentState, matchResult.path);
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
	
	storeObj.update = (path, newState, options) => {
		return update(storeObj, path, newState, options);
	};
	
	storeObj.push = (path, newVal, options) => {
		return push(storeObj, path, newVal, options);
	};
	
	storeObj.pull = (path, val, options) => {
		return pull(storeObj, path, val, options);
	};
	
	storeObj.find = (path, query, options) => {
		return find(storeObj, path, query, options);
	};
	
	storeObj.findOne = (path, query, options) => {
		return findOne(storeObj, path, query, options);
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
