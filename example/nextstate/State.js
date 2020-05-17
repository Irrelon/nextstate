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
		if (store.__initCache[name]) {
			return;
		}
		
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
			return (newVal) => {
				log.debug(`[${name}] set() called...`);
				return store.set(name, newVal);
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
			return (newVal) => {
				log.debug(`[${name}] push() called...`, {newVal});
				
				return store.push(name, newVal);
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
			return (val, options = {strict: false}) => {
				log.debug(`[${name}] pull() called...`, {val});
				
				return store.pull(name, val, options);
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
			return (newVal) => {
				log.debug(`[${name}] update() called...`, {newVal});
				return store.update(name, newVal);
			};
		}
		
		update.init = init;
		update.__isNextStateStoreFunction = true;
		
		return update;
	};
	
	stateInstance.find = function () {
		const find = function (store) {
			return (query = {}, options = {}) => {
				log.debug(`[${name}] find() called...`, {query});
				return store.find(name, query, options);
			};
		};
		
		find.init = init;
		find.__isNextStateStoreFunction = true;
		
		return find;
	};
	
	stateInstance.findOne = function () {
		const findOne = function (store) {
			return (query = {}, options = {}) => {
				log.debug(`[${name}] findOne() called...`, {query});
				return store.findOne(name, query, options);
			};
		};
		
		findOne.init = init;
		findOne.__isNextStateStoreFunction = true;
		
		return findOne;
	};
	
	stateInstance.findAndUpdate = function () {
		const findAndUpdate = function (store) {
			return (query = {}, update = {}, options = {}) => {
				log.debug(`[${name}] findAndUpdate() called...`, {query, update});
				return store.findAndUpdate(name, query, update, options);
			};
		};
		
		findAndUpdate.init = init;
		findAndUpdate.__isNextStateStoreFunction = true;
		
		return findAndUpdate;
	};
	
	stateInstance.findOneAndUpdate = function () {
		const findOneAndUpdate = function (store) {
			return (query = {}, update = {}, options = {}) => {
				log.debug(`[${name}] findOneAndUpdate() called...`, {query, update});
				return store.findOneAndUpdate(name, query, update, options);
			};
		};
		
		findOneAndUpdate.init = init;
		findOneAndUpdate.__isNextStateStoreFunction = true;
		
		return findOneAndUpdate;
	};
	
	stateInstance.findByPath = function (path = "") {
		return function (store) {
			return (query = {}, options = {}) => {
				log.debug(`[${name}] findByPath() called...`, {path, query});
				return store.find(pathJoin(name, path), query, options);
			};
		};
	};
	
	stateInstance.findOneByPath = function (path = "") {
		return function (store) {
			return (query = {}, options = {}) => {
				log.debug(`[${name}] findOneByPath() called...`, {path, query});
				return store.findOne(pathJoin(name, path), query, options);
			};
		};
	};
	
	stateInstance.findAndUpdateByPath = function (path = "") {
		return function (store) {
			return (query = {}, update = {}, options = {}) => {
				log.debug(`[${name}] findAndUpdateByPath() called...`, {path, query, update});
				return store.findAndUpdate(pathJoin(name, path), query, update, options);
			};
		};
	};
	
	stateInstance.findOneAndUpdateByPath = function (path = "") {
		return function (store) {
			return (query = {}, update = {}, options = {}) => {
				log.debug(`[${name}] findOneAndUpdateByPath() called...`, {path, query, update});
				return store.findOneAndUpdate(pathJoin(name, path), query, update, options);
			};
		};
	};
	
	stateInstance.updateByPath = function (path = "") {
		const updateByPath = function (store) {
			return (newVal) => {
				log.debug(`[${name}] updateByPath() called...`, {path, newVal});
				return store.update(pathJoin(name, path), newVal);
			}
		};
		
		updateByPath.init = init;
		updateByPath.__isNextStateStoreFunction = true;
		
		return updateByPath;
	};
	
	stateInstance.pushByPath = function (path = "") {
		const pushByPath = function (store) {
			return (newVal) => {
				log.debug(`[${name}] pushByPath() called...`, {path, newVal});
				return store.push(pathJoin(name, path), newVal);
			}
		};
		
		pushByPath.init = init;
		pushByPath.__isNextStateStoreFunction = true;
		
		return pushByPath;
	};
	
	stateInstance.pullByPath = function (path = "") {
		const pullByPath = function (store) {
			return (val) => {
				log.debug(`[${name}] pullByPath() called...`, {path, val});
				return store.pull(pathJoin(name, path), val, {strict: false});
			}
		};
		
		pullByPath.init = init;
		pullByPath.__isNextStateStoreFunction = true;
		
		return pullByPath;
	};
	
	stateInstance.getByPath = function (path = "", defaultVal) {
		const getByPath = function (store) {
			log.debug(`[${name}] getByPath() called...`, {path});
			return store.get(pathJoin(name, path), defaultVal);
		};
		
		getByPath.init = init;
		getByPath.__isNextStateStoreFunction = true;
		
		return getByPath;
	};
	
	stateInstance.setByPath = function (path = "") {
		const setByPath = function (store) {
			return (newVal) => {
				log.debug(`[${name}] setByPath() called...`, {path, newVal});
				return store.set(pathJoin(name, path), newVal);
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
		"findOneAndUpdate"
	];
	
	functionArr.forEach((funcName) => {
		stateInstance[funcName].init = init;
		stateInstance[funcName].__isNextStateStoreFunction = true;
	});
	
	return stateInstance;
}

export default State;
