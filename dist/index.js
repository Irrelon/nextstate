"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "State", {
  enumerable: true,
  get: function get() {
    return _State["default"];
  }
});
Object.defineProperty(exports, "ProvideState", {
  enumerable: true,
  get: function get() {
    return _ProvideState["default"];
  }
});
Object.defineProperty(exports, "getStore", {
  enumerable: true,
  get: function get() {
    return _Store.getStore;
  }
});
Object.defineProperty(exports, "get", {
  enumerable: true,
  get: function get() {
    return _Store.get;
  }
});
Object.defineProperty(exports, "set", {
  enumerable: true,
  get: function get() {
    return _Store.set;
  }
});
Object.defineProperty(exports, "value", {
  enumerable: true,
  get: function get() {
    return _Store.value;
  }
});
Object.defineProperty(exports, "update", {
  enumerable: true,
  get: function get() {
    return _Store.update;
  }
});
Object.defineProperty(exports, "exportData", {
  enumerable: true,
  get: function get() {
    return _Store.exportData;
  }
});
Object.defineProperty(exports, "setLogLevel", {
  enumerable: true,
  get: function get() {
    return _Store.setLogLevel;
  }
});
Object.defineProperty(exports, "useState", {
  enumerable: true,
  get: function get() {
    return _useState["default"];
  }
});
exports["default"] = void 0;

var _State = _interopRequireDefault(require("./State"));

var _ProvideState = _interopRequireDefault(require("./ProvideState"));

var _Store = require("./Store");

var _useState = _interopRequireDefault(require("./useState"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  getStore: _Store.getStore,
  get: _Store.get,
  set: _Store.set,
  update: _Store.update,
  value: _Store.value,
  useState: _useState["default"],
  exportData: _Store.exportData,
  setLogLevel: _Store.setLogLevel,
  ProvideState: _ProvideState["default"],
  State: _State["default"]
};
exports["default"] = _default;