"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = require("@irrelon/path");

var _irrelonLog = require("irrelon-log");

var log = (0, _irrelonLog.init)("State");

function State(name, initialData) {
  var _initialData = initialData;

  var init = function init(store) {
    if (store.__initCache[name]) return;
    log.debug("[".concat(name, "] Setting initial data..."));
    store.__initCache[name] = true;
    store.set(name, _initialData);
  };

  var stateInstance = function stateInstance(store) {
    return store.get(name);
  };

  stateInstance.patch = function (store) {
    return function (newVal) {
      store.patch(name, newVal);
    };
  };

  stateInstance.put = function (store) {
    return function (newVal) {
      store.put(name, newVal);
    };
  };

  stateInstance.read = function (store) {
    return store.get(name);
  };

  stateInstance.get = function (store) {
    return function () {
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var defaultVal = arguments.length > 1 ? arguments[1] : undefined;
      store.get((0, _path.join)(name, path), defaultVal);
    };
  };

  stateInstance.set = function (store) {
    return function () {
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var newVal = arguments.length > 1 ? arguments[1] : undefined;
      store.set((0, _path.join)(name, path), newVal);
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

var _default = State;
exports["default"] = _default;