class State {
	constructor (name) {
		this.name(name);
	}
	
	name (newName) {
		if (newName === undefined) {
			return this._name;
		}
		
		this._name = newName;
		return this;
	}
	
	get (store, path, options) {
		if (!store || !store.__isNextStateStore) {
			throw new Error("Cannot get() without passing a store retrieved with getStore()!");
		}
		
		if (!path) {
			throw new Error("Cannot get() without passing a path argument!");
		}
		
		return store.get(`${this._name}.${path}`, options);
	}
	
	set (store, path, newVal, options) {
		if (!store || !store.__isNextStateStore) {
			throw new Error("Cannot set() without passing a store retrieved with getStore()!");
		}
		
		if (!path) {
			throw new Error("Cannot set() without passing a path argument!");
		}
		
		return store.set(`${this._name}.${path}`, newVal, options);
	}
	
	update (store, newVal, options) {
		if (!store || !store.__isNextStateStore) {
			throw new Error("Cannot update() without passing a store retrieved with getStore()!");
		}
		
		return store.update(this._name, newVal, options);
	}
	
	overwrite (store, newVal, options) {
		if (!store || !store.__isNextStateStore) {
			throw new Error("Cannot overwrite() without passing a store retrieved with getStore()!");
		}
		
		return store.set(this._name, newVal, options);
	}
	
	value (store, options) {
		if (!store || !store.__isNextStateStore) {
			throw new Error("Cannot value() without passing a store retrieved with getStore()!");
		}
		
		return store.value(this._name, options);
	}
}

export default State;
