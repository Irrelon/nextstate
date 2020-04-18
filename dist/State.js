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

    if (store.get(name) === undefined) {
      store.set(name, _initialData);
    }
  }; // These functions all have to be non-arrow functions as
  // we utilise them as objects and apply a .init() function
  // to each one


  var stateInstance = function stateInstance(store) {
    return store.get(name);
  };

  stateInstance.read = function (store) {
    return store.get(name);
  };

  stateInstance.put = function (store) {
    return function (newVal) {
      store.put(name, newVal);
    };
  };

  stateInstance.patch = function (store) {
    return function (newVal) {
      store.patch(name, newVal);
    };
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

  stateInstance.push = function (store) {
    return function () {
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var newVal = arguments.length > 1 ? arguments[1] : undefined;
      store.push((0, _path.join)(name, path), newVal);
    };
  };

  stateInstance.pull = function (store) {
    return function () {
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var val = arguments.length > 1 ? arguments[1] : undefined;
      store.pull((0, _path.join)(name, path), val, {
        strict: false
      });
    };
  };

  stateInstance.find = function (store) {
    return function (query) {
      store.find((0, _path.join)(name), query, {
        strict: false
      });
    };
  };

  stateInstance.putByPath = function () {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    var putByPath = function putByPath(store) {
      return function (newVal) {
        store.put((0, _path.join)(name, path), newVal);
      };
    };

    putByPath.init = init;
    return putByPath;
  };

  stateInstance.patchByPath = function () {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    var patchByPath = function patchByPath(store) {
      return function (newVal) {
        store.patch((0, _path.join)(name, path), newVal);
      };
    };

    patchByPath.init = init;
    return patchByPath;
  };

  stateInstance.pushByPath = function () {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    var pushByPath = function pushByPath(store) {
      return function (newVal) {
        store.push((0, _path.join)(name, path), newVal);
      };
    };

    pushByPath.init = init;
    return pushByPath;
  };

  stateInstance.pullByPath = function () {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    var pullByPath = function pullByPath(store) {
      return function (val) {
        store.pull((0, _path.join)(name, path), val, {
          strict: false
        });
      };
    };

    pullByPath.init = init;
    return pullByPath;
  };

  stateInstance.setByPath = function () {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    var setByPath = function setByPath(store) {
      return function (val) {
        store.pull((0, _path.join)(name, path), val, {
          strict: false
        });
      };
    };

    setByPath.init = init;
    return setByPath;
  };

  stateInstance.getByPath = function () {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var defaultVal = arguments.length > 1 ? arguments[1] : undefined;

    var getByPath = function getByPath(store) {
      return store.get((0, _path.join)(name, path), defaultVal);
    };

    getByPath.init = init;
    return getByPath;
  };

  stateInstance.init = init;
  stateInstance.read.init = init;
  stateInstance.put.init = init;
  stateInstance.patch.init = init;
  stateInstance.get.init = init;
  stateInstance.set.init = init;
  stateInstance.push.init = init;
  stateInstance.pull.init = init;
  stateInstance.find.init = init;
  return stateInstance;
}

var _default = State;
exports["default"] = _default;