"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getContext = exports.exportData = exports.value = exports.update = exports.set = exports.get = exports.getStore = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _irrelonEmitter = _interopRequireDefault(require("irrelon-emitter"));

var _irrelonPath = require("irrelon-path");

var _irrelonLog = require("irrelon-log");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var log = (0, _irrelonLog.init)("Store");

var _context = _react["default"].createContext(null);

var decouple = function decouple(obj) {
  if (_typeof(obj) !== "object") {
    return obj;
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

var get = function get(store, path) {
  if (!store || !store.__isNextStateStore) {
    throw new Error("Cannot get() without passing a store retrieved with getStore()!");
  }

  if (!path) {
    throw new Error("Cannot get() without state name or state path in path argument!");
  }

  return (0, _irrelonPath.get)(store._data, path);
};

exports.get = get;

var set = function set(store, path, newState) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (!store || !store.__isNextStateStore) {
    throw new Error("Cannot call set() without passing a store retrieved with getStore()!");
  }

  if (!path) {
    throw new Error("Cannot set() without state name or state path in path argument!");
  }

  log.debug("[".concat(path, "] Setting state:"), JSON.stringify(newState));
  (0, _irrelonPath.set)(store._data, path, newState);
  store.events.emitId("change", path, newState);
};

exports.set = set;

var update = function update(store, path, newState) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (!store || !store.__isNextStateStore) {
    throw new Error("Cannot update() without passing a store retrieved with getStore()!");
  }

  var currentState = get(store, path);

  if (typeof newState === "function") {
    // Call the function to get the update data
    return update(newState(store, path, currentState, options));
  }

  if (_typeof(currentState) === "object" && _typeof(newState) === "object") {
    // Spread the current state and the new data
    return set(store, path, _objectSpread({}, currentState, decouple(newState)), options);
  } // We're not setting an object, we are setting a primitive so
  // simply overwrite the existing data


  return set(store, path, newState, options);
};

exports.update = update;

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

  var newStoreData = _objectSpread({}, initialData);

  var storeObj = {
    _data: newStoreData,
    events: new _irrelonEmitter["default"](),
    __isNextStateStore: true
  }; // Add shortcut methods to the store object

  storeObj.get = function (path, options) {
    return get(storeObj, path, options);
  };

  storeObj.set = function (path, newState, options) {
    return set(storeObj, path, newState, options);
  };

  storeObj.update = function (path, newState, options) {
    return update(storeObj, path, newState, options);
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
  getContext: getContext
};
exports["default"] = _default;