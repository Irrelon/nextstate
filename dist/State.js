"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

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
  // This function checks if this is the first time a function has been
  // called on this State instance. If so, we first initialise the state
  // with any initial data we were given. We wait for the first call to
  // a function to do this because until a call is made, we are not aware
  // of what the `store` object will be, so setting initial data before
  // that point is impossible.

  var init = function init(store) {
    if (store.__initCache[name]) {
      return;
    }

    log.debug("[".concat(name, "] Setting initial data..."));
    store.__initCache[name] = true;

    if (store.get(name) === undefined) {
      store.set(name, _initialData);
    }
  }; // This flag is used and applied to every function that needs to have
  // the init() function called on it when state is being updated.
  // By setting this flag we indicate the function is a state-based
  // function that might rely on some initial data to be populated in
  // the store via the init() function before we operate. It is primarily
  // used in the resolveMapping() function in irrelonNextState.js
  // IS VERY IMPORTANT AS WITHOUT THIS FLAG, THE FUNCTION WILL *NOT* BE
  // PASSED THE `store` INSTANCE!!!


  init.__isNextStateStoreFunction = true; // These functions all have to be non-arrow functions as
  // we utilise them as objects and apply a .init() function
  // to each one

  var stateInstance = function stateInstance(store) {
    throw new Error("Please use one of the state methods!");
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
      return store.get(name, defaultVal);
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
      return function (newVal, options) {
        log.debug("[".concat(name, "] set() called..."));
        return store.set(name, newVal, options);
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
      return function (newVal, options) {
        log.debug("[".concat(name, "] push() called..."), {
          newVal: newVal,
          options: options
        });
        return store.push(name, newVal, options);
      };
    };

    push.init = init;
    push.__isNextStateStoreFunction = true;
    return push;
  };

  stateInstance.pull = function () {
    var pull = function pull(store) {
      /**
       * Pulls a single item matching the passed query from the state array.
       * If the state is not an array an error will occur.
       * @param {*} val The query to match.
       * @param {PullOptions} [options] Options object.
       */
      return function (val, options) {
        log.debug("[".concat(name, "] pull() called..."), {
          val: val,
          options: options
        });
        return store.pull(name, val, (0, _objectSpread2["default"])({
          strict: false
        }, options));
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
      return function (newVal, options) {
        log.debug("[".concat(name, "] update() called..."), {
          newVal: newVal,
          options: options
        });
        return store.update(name, newVal, options);
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
        var options = arguments.length > 1 ? arguments[1] : undefined;
        log.debug("[".concat(name, "] find() called..."), {
          query: query,
          options: options
        });
        return store.find(name, query, options);
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
        var options = arguments.length > 1 ? arguments[1] : undefined;
        log.debug("[".concat(name, "] findOne() called..."), {
          query: query,
          options: options
        });
        return store.findOne(name, query, options);
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
        var options = arguments.length > 2 ? arguments[2] : undefined;
        log.debug("[".concat(name, "] findAndUpdate() called..."), {
          query: query,
          update: update,
          options: options
        });
        return store.findAndUpdate(name, query, update, options);
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
        var options = arguments.length > 2 ? arguments[2] : undefined;
        log.debug("[".concat(name, "] findOneAndUpdate() called..."), {
          query: query,
          update: update,
          options: options
        });
        return store.findOneAndUpdate(name, query, update, options);
      };
    };

    findOneAndUpdate.init = init;
    findOneAndUpdate.__isNextStateStoreFunction = true;
    return findOneAndUpdate;
  };

  stateInstance.findByPath = function (path) {
    var findByPath = function findByPath(store) {
      return function () {
        var query;
        var options;

        if (arguments.length === 3) {
          path = arguments[0];
          query = arguments[1] || {};
          options = arguments[2];
        } else {
          query = arguments[0] || {};
          options = arguments[1];
        }

        log.debug("[".concat(name, "] findByPath() called..."), {
          path: path,
          query: query,
          options: options
        });
        return store.find((0, _path.join)(name, path), query, options);
      };
    };

    findByPath.init = init;
    findByPath.__isNextStateStoreFunction = true;
    return findByPath;
  };

  stateInstance.findOneByPath = function (path) {
    var findOneByPath = function findOneByPath(store) {
      return function () {
        var query;
        var options;

        if (arguments.length === 3) {
          path = arguments[0];
          query = arguments[1] || {};
          options = arguments[2];
        } else {
          query = arguments[0] || {};
          options = arguments[1];
        }

        log.debug("[".concat(name, "] findOneByPath() called..."), {
          path: path,
          query: query,
          options: options
        });
        return store.findOne((0, _path.join)(name, path), query, options);
      };
    };

    findOneByPath.init = init;
    findOneByPath.__isNextStateStoreFunction = true;
    return findOneByPath;
  };

  stateInstance.findAndUpdateByPath = function (path) {
    var findAndUpdateByPath = function findAndUpdateByPath(store) {
      return function () {
        var query;
        var update;
        var options;

        if (arguments.length === 4) {
          path = arguments[0];
          query = arguments[1] || {};
          update = arguments[2] || {};
          options = arguments[3];
        } else {
          query = arguments[0] || {};
          update = arguments[1] || {};
          options = arguments[2];
        }

        log.debug("[".concat(name, "] findAndUpdateByPath() called..."), {
          path: path,
          query: query,
          update: update,
          options: options
        });
        return store.findAndUpdate((0, _path.join)(name, path), query, update, options);
      };
    };

    findAndUpdateByPath.init = init;
    findAndUpdateByPath.__isNextStateStoreFunction = true;
    return findAndUpdateByPath;
  };

  stateInstance.findOneAndUpdateByPath = function (path) {
    var findOneAndUpdateByPath = function findOneAndUpdateByPath(store) {
      return function () {
        var query;
        var update;
        var options;

        if (arguments.length === 4) {
          path = arguments[0];
          query = arguments[1] || {};
          update = arguments[2] || {};
          options = arguments[3];
        } else {
          query = arguments[0] || {};
          update = arguments[1] || {};
          options = arguments[2];
        }

        log.debug("[".concat(name, "] findOneAndUpdateByPath() called..."), {
          path: path,
          query: query,
          update: update,
          options: options
        });
        return store.findOneAndUpdate((0, _path.join)(name, path), query, update, options);
      };
    };

    findOneAndUpdateByPath.init = init;
    findOneAndUpdateByPath.__isNextStateStoreFunction = true;
    return findOneAndUpdateByPath;
  };

  stateInstance.updateByPath = function (path) {
    var updateByPath = function updateByPath(store) {
      return function () {
        var newVal;
        var options;

        if (arguments.length === 3) {
          path = arguments[0];
          newVal = arguments[1];
          options = arguments[2];
        } else {
          newVal = arguments[0];
          options = arguments[1];
        }

        log.debug("[".concat(name, "] updateByPath() called..."), {
          path: path,
          newVal: newVal,
          options: options
        });
        return store.update((0, _path.join)(name, path), newVal, options);
      };
    };

    updateByPath.init = init;
    updateByPath.__isNextStateStoreFunction = true;
    return updateByPath;
  };

  stateInstance.pushByPath = function (path) {
    var pushByPath = function pushByPath(store) {
      return function () {
        var newVal;
        var options;

        if (arguments.length === 3) {
          path = arguments[0];
          newVal = arguments[1];
          options = arguments[2];
        } else {
          newVal = arguments[0];
          options = arguments[1];
        }

        log.debug("[".concat(name, "] pushByPath() called..."), {
          path: path,
          newVal: newVal,
          options: options
        });
        return store.push((0, _path.join)(name, path), newVal, options);
      };
    };

    pushByPath.init = init;
    pushByPath.__isNextStateStoreFunction = true;
    return pushByPath;
  };

  stateInstance.pullByPath = function (path) {
    var pullByPath = function pullByPath(store) {
      return function () {
        var val;
        var options;

        if (arguments.length === 3) {
          path = arguments[0];
          val = arguments[1];
          options = arguments[2];
        } else {
          val = arguments[0];
          options = arguments[1];
        }

        log.debug("[".concat(name, "] pullByPath() called..."), {
          path: path,
          val: val,
          options: options
        });
        return store.pull((0, _path.join)(name, path), val, (0, _objectSpread2["default"])({
          strict: false
        }, options));
      };
    };

    pullByPath.init = init;
    pullByPath.__isNextStateStoreFunction = true;
    return pullByPath;
  };

  stateInstance.getByPath = function (path, defaultVal, options) {
    var getByPath = function getByPath(store) {
      if (path === undefined) {
        return function (path, defaultVal, options) {
          log.debug("[".concat(name, "] getByPath() called..."), {
            path: path
          });
          return store.get((0, _path.join)(name, path), defaultVal, options);
        };
      }

      log.debug("[".concat(name, "] getByPath() called..."), {
        path: path
      });
      return store.get((0, _path.join)(name, path), defaultVal, options);
    };

    getByPath.init = init;
    getByPath.__isNextStateStoreFunction = true;
    return getByPath;
  };

  stateInstance.setByPath = function (path) {
    var setByPath = function setByPath(store) {
      return function () {
        var newVal;
        var options;

        if (arguments.length === 3) {
          path = arguments[0];
          newVal = arguments[1];
          options = arguments[2];
        } else {
          newVal = arguments[0];
          options = arguments[1];
        }

        log.debug("[".concat(name, "] setByPath() called..."), {
          path: path,
          newVal: newVal,
          options: options
        });
        return store.set((0, _path.join)(name, path), newVal, options);
      };
    };

    setByPath.init = init;
    setByPath.__isNextStateStoreFunction = true;
    return setByPath;
  };

  var functionArr = ["update", "get", "set", "push", "pull", "find", "findOne", "findAndUpdate", "findOneAndUpdate", "findByPath", "findOneByPath", "findAndUpdateByPath", "findOneAndUpdateByPath", "updateByPath", "pushByPath", "pullByPath", "getByPath", "setByPath"];
  functionArr.forEach(function (funcName) {
    stateInstance[funcName].init = init;
    stateInstance[funcName].__isNextStateStoreFunction = true;
  });
  return stateInstance;
}

var _default = State;
exports["default"] = _default;