"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "setLogLevel", {
  enumerable: true,
  get: function get() {
    return _irrelonLog.setLevel;
  }
});
exports.getContext = exports.exportData = exports.value = exports.patch = exports.set = exports.get = exports.getStore = exports["default"] = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _react = _interopRequireDefault(require("react"));

var _emitter = _interopRequireDefault(require("@irrelon/emitter"));

var _path = require("@irrelon/path");

var _irrelonLog = require("irrelon-log");

var log = (0, _irrelonLog.init)("Store");

var _context = _react["default"].createContext(null);

var decouple = function decouple(obj) {
  if ((0, _typeof2["default"])(obj) !== "object") {
    return obj;
  }

  if (obj.__isNextStateStore === true) {
    log.error("Attempting to decouple a primary store object!");
  }

  return JSON.parse(JSON.stringify(obj));
};

var getContext = function getContext() {
  return _context;
};

exports.getContext = getContext;

var getStore = function getStore(initialData) {
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

exports.getStore = getStore;

var get = function get(store, path, defaultVal, options) {
  if (!store || !store.__isNextStateStore) {
    throw new Error("Cannot get() without passing a store retrieved with getStore()!");
  }

  if (path === undefined) {
    throw new Error("Cannot get() without state name or state path in path argument!");
  }

  return (0, _path.get)(store._data, path, defaultVal);
};

exports.get = get;

var set = function set(store, path, newState) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (!store || !store.__isNextStateStore) {
    throw new Error("Cannot call set() without passing a store retrieved with getStore()!");
  }

  if (path === undefined) {
    throw new Error("Cannot set() without state name or state path in path argument!");
  } // Check if new state is same as old


  var currentState = (0, _path.get)(store._data, path);
  var diff = (0, _path.diff)(currentState, newState);
  store._data = (0, _path.setImmutable)(store._data, path, newState);

  if (!diff) {
    log.debug("[".concat(path, "] Diff was the same so no change event"));
    return store;
  }

  store.events.emitId("change", path, newState);
  return store;
};

exports.set = set;

var patch = function patch(store, path, newState) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (!store || !store.__isNextStateStore) {
    throw new Error("Cannot patch() without passing a store retrieved with getStore()!");
  }

  var currentState = get(store, path);

  if (typeof newState === "function") {
    // Call the function to get the patch data
    return patch(newState(store, path, currentState, options));
  }

  if ((0, _typeof2["default"])(currentState) === "object" && (0, _typeof2["default"])(newState) === "object") {
    // Spread the current state and the new data
    // TODO: Can we use setImmutable from @irrelon/path here instead?
    if (Array.isArray(currentState)) {
      if (Array.isArray(newState)) {
        return set(store, path, [].concat((0, _toConsumableArray2["default"])(currentState), (0, _toConsumableArray2["default"])((0, _path.decouple)(newState, {
          immutable: true
        }))), options);
      }

      return set(store, path, (0, _objectSpread2["default"])({}, (0, _path.decouple)(newState, {
        immutable: true
      })), options);
    } else {
      if (Array.isArray(newState)) {
        return set(store, path, (0, _toConsumableArray2["default"])((0, _path.decouple)(newState, {
          immutable: true
        })), options);
      }
    }

    return set(store, path, (0, _objectSpread2["default"])({}, currentState, (0, _path.decouple)(newState, {
      immutable: true
    })), options);
  } // We're not setting an object, we are setting a primitive so
  // simply overwrite the existing data


  return set(store, path, newState, options);
};

exports.patch = patch;

var put = function put(store, path, newState) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (!store || !store.__isNextStateStore) {
    throw new Error("Cannot patch() without passing a store retrieved with getStore()!");
  }

  var currentState = get(store, path);

  if (typeof newState === "function") {
    // Call the function to get the patch data
    return put(newState(store, path, currentState, options));
  } // We're not setting an object, we are setting a primitive so
  // simply overwrite the existing data


  return set(store, path, newState, options);
};

var push = function push(store, path, newVal) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (!store || !store.__isNextStateStore) {
    throw new Error("Cannot patch() without passing a store retrieved with getStore()!");
  }

  var currentState = get(store, path);
  var newState = (0, _path.pushValImmutable)(currentState, "", newVal);
  return set(store, path, newState, options);
};

var pull = function pull(store, path, val) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
    strict: false
  };

  if (!store || !store.__isNextStateStore) {
    throw new Error("Cannot patch() without passing a store retrieved with getStore()!");
  }

  var currentState = get(store, path);
  var newState = (0, _path.pullValImmutable)(currentState, "", val, options);
  return set(store, path, newState, options);
};

var value = function value(store, key) {
  if (!store || !store.__isNextStateStore) {
    throw new Error("Cannot call value() without passing a store retrieved with getStore()!");
  }

  if (!key) {
    throw new Error("Cannot call value() without passing a key to retrieve!");
  }

  return store._data[key];
};

exports.value = value;

var exportData = function exportData(store) {
  if (!store || !store.__isNextStateStore) {
    throw new Error("Cannot exportData() without passing a store retrieved with getStore()!");
  }

  return decouple(store._data);
};

exports.exportData = exportData;

var create = function create(initialData) {
  log.debug("Creating new store with initialData:", JSON.stringify(initialData));
  var newStoreData = (0, _objectSpread2["default"])({}, initialData);
  var storeObj = {
    _data: newStoreData,
    events: new _emitter["default"](),
    __isNextStateStore: true,
    __storeCreated: new Date().toISOString(),
    __initCache: {}
  }; // Add shortcut methods to the store object

  storeObj.get = function (path, defaultVal, options) {
    return get(storeObj, path, defaultVal, options);
  };

  storeObj.set = function (path, newState, options) {
    return set(storeObj, path, newState, options);
  };

  storeObj.patch = function (path, newState, options) {
    return patch(storeObj, path, newState, options);
  };

  storeObj.put = function (path, newState, options) {
    return put(storeObj, path, newState, options);
  };

  storeObj.push = function (path, newVal, options) {
    return push(storeObj, path, newVal, options);
  };

  storeObj.pull = function (path, val, options) {
    return pull(storeObj, path, val, options);
  };

  storeObj.value = function (path) {
    return value(storeObj, path);
  };

  storeObj.exportData = function () {
    return exportData(storeObj);
  };

  storeObj.getContext = function () {
    return getContext();
  };

  return storeObj;
};

var _default = {
  getStore: getStore,
  get: get,
  set: set,
  patch: patch,
  value: value,
  exportData: exportData,
  getContext: getContext,
  setLogLevel: _irrelonLog.setLevel
};
exports["default"] = _default;