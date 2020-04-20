"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = require("@irrelon/path");

var _irrelonLog = require("irrelon-log");

var log = (0, _irrelonLog.init)("State");
/**
 * @typedef {object} PullOptions The pull operation options.
 * @property {boolean} [strict=true] Determines if the matching
 * system should expect every field in the source (state) object
 * to match every field in the query object exactly (strict) or
 * if the source only needs to match the fields defined in the
 * query object (non-strict).
 */

function State(name, initialData) {
  var _initialData = initialData; // Has to be a non-arrow function

  var init = function init(store) {
    if (store.__initCache[name]) {
      return;
    }

    log.debug("[".concat(name, "] Setting initial data..."));
    store.__initCache[name] = true;

    if (store.get(name) === undefined) {
      store.set(name, _initialData);
    }
  };

  init.__isNextStateStoreFunction = true; // These functions all have to be non-arrow functions as
  // we utilise them as objects and apply a .init() function
  // to each one

  var stateInstance = function stateInstance(store) {
    return store.read(name);
  };

  stateInstance.init = init;
  /**
   * Gets the state value or the default value if the state value
   * is currently undefined.
   * @param {*} defaultVal The value to return if the current state
   * is undefined.
   * */

  stateInstance.get = function (defaultVal) {
    var get = function get(store) {
      return store.get((0, _path.join)(name), defaultVal);
    };

    get.init = init;
    get.__isNextStateStoreFunction = true;
    return get;
  };

  stateInstance.set = function () {
    var set = function set(store) {
      /**
       * Replaces the existing state value with the one passed.
       * @param {*} newVal The new value to replace the existing
       * value with.
       */
      return function (newVal) {
        return store.set((0, _path.join)(name), newVal);
      };
    };

    set.init = init;
    set.__isNextStateStoreFunction = true;
    return set;
  };

  stateInstance.push = function () {
    var push = function push(store) {
      /**
       * Pushes the passed value to the state array. If the state
       * is not an array an error will occur.
       * @param {*} newVal The new value to push to the state array.
       */
      return function (newVal) {
        return store.push((0, _path.join)(name), newVal);
      };
    };

    push.init = init;
    push.__isNextStateStoreFunction = true;
    return push;
  };

  stateInstance.pull = function () {
    var pull = function pull(store) {
      /**
       * Pulls the passed value to the state array. If the state
       * is not an array an error will occur.
       * @param {*} newVal The query value to pull from the state array.
       * @param {PullOptions} [options] Options object.
       */
      return function (val) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
          strict: false
        };
        return store.pull((0, _path.join)(name), val, options);
      };
    };

    pull.init = init;
    pull.__isNextStateStoreFunction = true;
    return pull;
  };

  stateInstance.update = function () {
    var update = function update(store) {
      /**
       * Updates (patches) the state, spreading the new value over
       * the existing value if they are both objects or replacing
       * outright if either is a primitive.
       * value with.
       * @param {*} newVal The new value to update the existing
       */
      return function (newVal) {
        return store.update(name, newVal);
      };
    };

    update.init = init;
    update.__isNextStateStoreFunction = true;
    return update;
  };

  stateInstance.find = function () {
    var find = function find(store) {
      return function () {
        var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return store.find((0, _path.join)(name), query, options);
      };
    };

    find.init = init;
    find.__isNextStateStoreFunction = true;
    return find;
  };

  stateInstance.findOne = function () {
    var findOne = function findOne(store) {
      return function () {
        var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return store.findOne((0, _path.join)(name), query, options);
      };
    };

    findOne.init = init;
    findOne.__isNextStateStoreFunction = true;
    return findOne;
  };

  stateInstance.findAndUpdate = function () {
    var findAndUpdate = function findAndUpdate(store) {
      return function () {
        var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var update = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return store.findAndUpdate((0, _path.join)(name), query, update, options);
      };
    };

    findAndUpdate.init = init;
    findAndUpdate.__isNextStateStoreFunction = true;
    return findAndUpdate;
  };

  stateInstance.findOneAndUpdate = function () {
    var findOneAndUpdate = function findOneAndUpdate(store) {
      return function () {
        var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var update = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return store.findOneAndUpdate((0, _path.join)(name), query, update, options);
      };
    };

    findOneAndUpdate.init = init;
    findOneAndUpdate.__isNextStateStoreFunction = true;
    return findOneAndUpdate;
  };

  stateInstance.findByPath = function () {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    return function (store) {
      return function () {
        var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return store.find((0, _path.join)(name, path), query, options);
      };
    };
  };

  stateInstance.findOneByPath = function () {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    return function (store) {
      return function () {
        var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return store.findOne((0, _path.join)(name, path), query, options);
      };
    };
  };

  stateInstance.findAndUpdateByPath = function () {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    return function (store) {
      return function () {
        var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var update = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return store.findAndUpdate((0, _path.join)(name, path), query, update, options);
      };
    };
  };

  stateInstance.findOneAndUpdateByPath = function () {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    return function (store) {
      return function () {
        var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var update = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return store.findOneAndUpdate((0, _path.join)(name, path), query, update, options);
      };
    };
  };

  stateInstance.updateByPath = function () {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    var updateByPath = function updateByPath(store) {
      return function (newVal) {
        return store.update((0, _path.join)(name, path), newVal);
      };
    };

    updateByPath.init = init;
    updateByPath.__isNextStateStoreFunction = true;
    return updateByPath;
  };

  stateInstance.pushByPath = function () {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    var pushByPath = function pushByPath(store) {
      return function (newVal) {
        return store.push((0, _path.join)(name, path), newVal);
      };
    };

    pushByPath.init = init;
    pushByPath.__isNextStateStoreFunction = true;
    return pushByPath;
  };

  stateInstance.pullByPath = function () {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    var pullByPath = function pullByPath(store) {
      return function (val) {
        return store.pull((0, _path.join)(name, path), val, {
          strict: false
        });
      };
    };

    pullByPath.init = init;
    pullByPath.__isNextStateStoreFunction = true;
    return pullByPath;
  };

  stateInstance.getByPath = function () {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var defaultVal = arguments.length > 1 ? arguments[1] : undefined;

    var getByPath = function getByPath(store) {
      return store.get((0, _path.join)(name, path), defaultVal);
    };

    getByPath.init = init;
    getByPath.__isNextStateStoreFunction = true;
    return getByPath;
  };

  stateInstance.setByPath = function () {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    var setByPath = function setByPath(store) {
      return function (newVal) {
        return store.set((0, _path.join)(name, path), newVal);
      };
    };

    setByPath.init = init;
    setByPath.__isNextStateStoreFunction = true;
    return setByPath;
  };

  var functionArr = ["update", "get", "set", "push", "pull", "find", "findOne", "findAndUpdate", "findOneAndUpdate"];
  functionArr.forEach(function (funcName) {
    stateInstance[funcName].init = init;
    stateInstance[funcName].__isNextStateStoreFunction = true;
  });
  return stateInstance;
}

var _default = State;
exports["default"] = _default;