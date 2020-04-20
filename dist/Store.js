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
exports.getContext = exports.exportData = exports.value = exports.update = exports.set = exports.get = exports.getStore = exports["default"] = void 0;

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
    throw new Error("Cannot call get() without passing a store retrieved with getStore()!");
  }

  if (path === undefined) {
    throw new Error("Cannot call get() without state name or state path in path argument!");
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
    throw new Error("Cannot call set() without state name or state path in path argument!");
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

var push = function push(store, path, newVal) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (!store || !store.__isNextStateStore) {
    throw new Error("Cannot call push() without passing a store retrieved with getStore()!");
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
    throw new Error("Cannot call pull() without passing a store retrieved with getStore()!");
  }

  var currentState = get(store, path);
  var newState = (0, _path.pullValImmutable)(currentState, "", val, options);
  return set(store, path, newState, options);
};

var update = function update(store, path, newState) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (!store || !store.__isNextStateStore) {
    throw new Error("Cannot call update() without passing a store retrieved with getStore()!");
  }

  var currentState = get(store, path);

  if (typeof newState === "function") {
    // Call the function to get the update data
    return update(newState(store, path, currentState, options));
  }

  if ((0, _typeof2["default"])(currentState) === "object" && (0, _typeof2["default"])(newState) === "object") {
    // Spread the current state and the new data
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

exports.update = update;

var find = function find(store, path, query) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (!store || !store.__isNextStateStore) {
    throw new Error("Cannot call find() without passing a store retrieved with getStore()!");
  }

  var maxDepth = Infinity;

  if (query === undefined || (0, _typeof2["default"])(query) === "object" && !Object.keys(query).length) {
    maxDepth = 1;
  }

  options = (0, _objectSpread2["default"])({
    strict: false,
    maxDepth: maxDepth,
    includeRoot: false
  }, options);
  var currentState = get(store, path);
  var matchResult = (0, _path.findPath)(currentState, query, options);

  if (matchResult.match) {
    return matchResult.path.map(function (path) {
      return (0, _path.get)(currentState, path);
    });
  } else {
    return [];
  }
};

var findOne = function findOne(store, path, query) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
    strict: false
  };

  if (!store || !store.__isNextStateStore) {
    throw new Error("Cannot call findOne() without passing a store retrieved with getStore()!");
  }

  var maxDepth = Infinity;

  if (query === undefined || (0, _typeof2["default"])(query) === "object" && !Object.keys(query).length) {
    maxDepth = 1;
  }

  options = (0, _objectSpread2["default"])({
    strict: false,
    maxDepth: maxDepth,
    includeRoot: false
  }, options);
  var currentState = get(store, path);
  var matchResult = (0, _path.findOnePath)(currentState, query, options);

  if (matchResult.match) {
    return (0, _path.get)(currentState, matchResult.path);
  } else {
    return undefined;
  }
};

var findAndUpdate = function findAndUpdate(store, path, query, updateData) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
    strict: false
  };

  if (!store || !store.__isNextStateStore) {
    throw new Error("Cannot call findAndUpdate() without passing a store retrieved with getStore()!");
  }

  var currentState = get(store, path);
  var matchResult = (0, _path.findPath)(currentState, query);

  if (matchResult.match) {
    return matchResult.path.map(function (matchResultPath) {
      var updatePath = (0, _path.join)(path, matchResultPath);
      var finalUpdateData = updateData; // Check if the updateData is a function

      if (typeof updateData === "function") {
        // Get the new update data for this item
        // from the function
        finalUpdateData = updateData((0, _path.get)(currentState, matchResultPath));
      } // Update the record


      update(store, updatePath, finalUpdateData); // Return the updated record

      return get(store, updatePath);
    });
  } else {
    return [];
  }
};

var findOneAndUpdate = function findOneAndUpdate(store, path, query, updateData) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
    strict: false
  };

  if (!store || !store.__isNextStateStore) {
    throw new Error("Cannot call findOne() without passing a store retrieved with getStore()!");
  }

  var currentState = get(store, path);
  var matchResult = (0, _path.findOnePath)(currentState, query);

  if (matchResult.match) {
    var updatePath = (0, _path.join)(path, matchResult.path);
    var finalUpdateData = updateData; // Check if the updateData is a function

    if (typeof updateData === "function") {
      // Get the new update data for this item
      // from the function
      finalUpdateData = updateData((0, _path.get)(currentState, matchResult.path));
    } // Update the record


    update(store, updatePath, finalUpdateData); // Return the updated record

    return get(store, updatePath);
  } else {
    return undefined;
  }
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
    throw new Error("Cannot call exportData() without passing a store retrieved with getStore()!");
  }

  return decouple(store._data);
};

exports.exportData = exportData;

var create = function create(initialData) {
  //log.debug("Creating new store with initialData:", JSON.stringify(initialData));
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

  storeObj.push = function (path, newVal, options) {
    return push(storeObj, path, newVal, options);
  };

  storeObj.pull = function (path, val, options) {
    return pull(storeObj, path, val, options);
  };

  storeObj.update = function (path, newState, options) {
    return update(storeObj, path, newState, options);
  };

  storeObj.find = function (path, query, options) {
    return find(storeObj, path, query, options);
  };

  storeObj.findOne = function (path, query, options) {
    return findOne(storeObj, path, query, options);
  };

  storeObj.findAndUpdate = function (path, query, options) {
    return findAndUpdate(storeObj, path, query, options);
  };

  storeObj.findOneAndUpdate = function (path, query, options) {
    return findOneAndUpdate(storeObj, path, query, options);
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
  update: update,
  value: value,
  exportData: exportData,
  getContext: getContext,
  setLogLevel: _irrelonLog.setLevel
};
exports["default"] = _default;