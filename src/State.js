import {join as pathJoin} from "@irrelon/path";
import {init as initLog} from "irrelon-log";

const log = initLog("State");

function State (name, initialData) {
	const _initialData = initialData;
	
	const init = (store) => {
		if (store.__initCache[name]) return;
		
		log.debug(`[${name}] Setting initial data...`);
		
		store.__initCache[name] = true;
		if (store.get(name) === undefined) {
			store.set(name, _initialData);
		}
	};
	
	// These functions all have to be non-arrow functions as
	// we utilise them as objects and apply a .init() function
	// to each one
	const stateInstance = function (store) {
		return store.get(name);
	};
	
	stateInstance.read = function (store) {
		return store.get(name);
	};
	
	stateInstance.put = function (store) {
		return (newVal) => {
			store.put(name, newVal);
		};
	};
	
	stateInstance.patch = function (store) {
		return (newVal) => {
			store.patch(name, newVal);
		};
	};
	
	stateInstance.get = function (store) {
		return (path = "", defaultVal) => {
			store.get(pathJoin(name, path), defaultVal);
		};
	};
	
	stateInstance.set = function (store) {
		return (path = "", newVal) => {
			store.set(pathJoin(name, path), newVal);
		};
	};
	
	stateInstance.push = function (store) {
		return (path = "", newVal) => {
			store.push(pathJoin(name, path), newVal);
		};
	};
	
	stateInstance.pull = function (store) {
		return (path = "", val) => {
			store.pull(pathJoin(name, path), val, {strict: false});
		};
	};
	
	stateInstance.putByPath = function (path = "") {
		const putByPath = function (store) {
			return (newVal) => {
				store.put(pathJoin(name, path), newVal);
			};
		};
		
		putByPath.init = init;
	}
	
	stateInstance.patchByPath = function (path = "") {
		const patchByPath = function (store) {
			return (newVal) => {
				store.patch(pathJoin(name, path), newVal);
			};
		};
		
		patchByPath.init = init;
	};
	
	stateInstance.pushByPath = function (path = "") {
		const pushByPath = function (store) {
			return (newVal) => {
				store.push(pathJoin(name, path), newVal);
			};
		};
		
		pushByPath.init = init;
	};
	
	stateInstance.pullByPath = function (path = "") {
		const pullByPath = function (store) {
			return (val) => {
				store.pull(pathJoin(name, path), val, {strict: false});
			};
		};
		
		pullByPath.init = init;
	};
	
	stateInstance.setByPath = function (path = "") {
		const setByPath = function (store) {
			return (val) => {
				log.debug("PULL----", val, {strict: false});
				store.pull(pathJoin(name, path), val, {strict: false});
			};
		};
		
		setByPath.init = init;
	};
	
	stateInstance.getByPath = function (path = "") {
		const getByPath = function (store) {
			return (defaultVal) => {
				store.get(pathJoin(name, path), defaultVal);
			};
		};
		
		getByPath.init = init;
	};
	
	stateInstance.init = init;
	stateInstance.read.init = init;
	
	stateInstance.put.init = init;
	stateInstance.patch.init = init;
	stateInstance.get.init = init;
	stateInstance.set.init = init;
	stateInstance.push.init = init;
	stateInstance.pull.init = init;
	
	return stateInstance;
}

export default State;
