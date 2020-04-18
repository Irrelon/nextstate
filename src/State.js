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
	
	const stateInstance = (store) => {
		return store.get(name);
	};
	
	stateInstance.read = (store) => {
		return store.get(name);
	};
	
	stateInstance.put = (store) => {
		return (newVal) => {
			store.put(name, newVal);
		};
	};
	
	stateInstance.patch = (store) => {
		return (newVal) => {
			store.patch(name, newVal);
		};
	};
	
	stateInstance.get = (store) => {
		return (path = "", defaultVal) => {
			store.get(pathJoin(name, path), defaultVal);
		};
	};
	
	stateInstance.set = (store) => {
		return (path = "", newVal) => {
			store.set(pathJoin(name, path), newVal);
		};
	};
	
	stateInstance.push = (store) => {
		return (path = "", newVal) => {
			store.push(pathJoin(name, path), newVal);
		};
	};
	
	stateInstance.pull = (store) => {
		return (path = "", val) => {
			store.pull(pathJoin(name, path), val, {strict: false});
		};
	};
	
	stateInstance.putByPath = (path = "") => (store) => {
		return (newVal) => {
			store.put(pathJoin(name, path), newVal);
		};
	};
	
	stateInstance.patchByPath = (path = "") => (store) => {
		return (newVal) => {
			store.patch(pathJoin(name, path), newVal);
		};
	};
	
	stateInstance.pushByPath = (path = "") => (store) => {
		return (newVal) => {
			store.push(pathJoin(name, path), newVal);
		};
	};
	
	stateInstance.pullByPath = (path = "") => (store) => {
		return (val) => {
			store.pull(pathJoin(name, path), val, {strict: false});
		};
	};
	
	stateInstance.setByPath = (path = "") => (store) => {
		return (val) => {
			log.debug("PULL----", val, {strict: false});
			store.pull(pathJoin(name, path), val, {strict: false});
		};
	};
	
	stateInstance.getByPath = (path = "") => (store) => {
		return (defaultVal) => {
			store.get(pathJoin(name, path), defaultVal);
		};
	};
	
	stateInstance.init = init;
	stateInstance.read.init = init;
	
	stateInstance.put.init = init;
	stateInstance.patch.init = init;
	stateInstance.get.init = init;
	stateInstance.set.init = init;
	stateInstance.push.init = init;
	stateInstance.pull.init = init;
	
	stateInstance.putByPath.init = init;
	stateInstance.patchByPath.init = init;
	stateInstance.getByPath.init = init;
	stateInstance.setByPath.init = init;
	stateInstance.pushByPath.init = init;
	stateInstance.pullByPath.init = init;
	
	return stateInstance;
}

export default State;
