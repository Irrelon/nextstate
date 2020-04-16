import {join as pathJoin} from "@irrelon/path";
import {init as initLog} from "irrelon-log";

const log = initLog("State");

function State (name, initialData) {
	const _initialData = initialData;
	
	const init = function (store) {
		if (store.__initCache[name]) return;
		
		log.debug(`[${name}] Setting initial data...`);
		
		store.__initCache[name] = true;
		store.set(name, _initialData);
	};
	
	const stateInstance = function (store) {
		return store.get(name);
	};
	
	stateInstance.patch = function (store) {
		return (newVal) => {
			store.patch(name, newVal);
		};
	};
	
	stateInstance.put = function (store) {
		return (newVal) => {
			store.put(name, newVal);
		};
	};
	
	stateInstance.read = function (store) {
		return store.get(name);
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
	
	stateInstance.init = init;
	stateInstance.patch.init = init;
	stateInstance.put.init = init;
	stateInstance.get.init = init;
	stateInstance.set.init = init;
	stateInstance.read.init = init;
	
	return stateInstance;
}

export default State;
