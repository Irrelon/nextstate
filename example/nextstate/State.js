import {init as initLog, setLevel as setLogLevel} from "irrelon-log";

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
	
	stateInstance.init = init;
	
	stateInstance.update = function (store) {
		return (newVal) => {
			store.update(name, newVal);
		};
	};
	
	stateInstance.update.init = init;
	
	return stateInstance;
}

export default State;
