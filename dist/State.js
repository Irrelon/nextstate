"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = require("@irrelon/path");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var State =
/*#__PURE__*/
function () {
  function State(name) {
    _classCallCheck(this, State);

    this.name(name);
  }

  _createClass(State, [{
    key: "name",
    value: function name(newName) {
      if (newName === undefined) {
        return this._name;
      }

      this._name = newName;
      return this;
    }
  }, {
    key: "get",
    value: function get(store, path, options) {
      if (!store || !store.__isNextStateStore) {
        throw new Error("Cannot get() without passing a store retrieved with getStore()!");
      }

      if (path === undefined) {
        throw new Error("Cannot get() without passing a path argument!");
      }

      return store.get((0, _path.join)(this._name, path), options);
    }
  }, {
    key: "set",
    value: function set(store, path, newVal, options) {
      if (!store || !store.__isNextStateStore) {
        throw new Error("Cannot set() without passing a store retrieved with getStore()!");
      }

      if (path === undefined) {
        throw new Error("Cannot set() without passing a path argument!");
      }

      return store.value(store.set((0, _path.join)(this._name, path), newVal, options));
    }
  }, {
    key: "update",
    value: function update(store, newVal, options) {
      if (!store || !store.__isNextStateStore) {
        throw new Error("Cannot update() without passing a store retrieved with getStore()!");
      }

      return store.update(this._name, newVal, options);
    }
  }, {
    key: "overwrite",
    value: function overwrite(store, newVal, options) {
      if (!store || !store.__isNextStateStore) {
        throw new Error("Cannot overwrite() without passing a store retrieved with getStore()!");
      }

      return store.set(this._name, newVal, options);
    }
  }, {
    key: "value",
    value: function value(store, options) {
      if (!store || !store.__isNextStateStore) {
        throw new Error("Cannot value() without passing a store retrieved with getStore()!");
      }

      return store.value(this._name, options);
    }
  }]);

  return State;
}();

var _default = State;
exports["default"] = _default;