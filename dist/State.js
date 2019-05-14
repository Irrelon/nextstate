"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _irrelonLog = _interopRequireDefault(require("irrelon-log"));

var _Store = require("./Store");

var _Provider = _interopRequireDefault(require("./Provider"));

var _irrelonPath = require("irrelon-path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var log = new _irrelonLog["default"]("State");

var Emitter = require("irrelon-emitter");

var State = function State(name, initialData, options) {
  var _this = this;

  _classCallCheck(this, State);

  this._Context = _react["default"].createContext(initialData);
  this._name = name;
  log.info("[".concat(name, "] State constructor with initialData"), initialData);
  (0, _Store.setState)(name, initialData, options);

  this.name = function () {
    return _this._name;
  };

  this.update = function (data) {
    var currentState = (0, _Store.getState)(name);

    if (typeof data === "function") {
      // Call the function to get the update data
      return _this.update(data(currentState));
    }

    if (_typeof(currentState) === "object" && _typeof(data) === "object") {
      // Spread the current state and the new data
      return _this.overwrite(_objectSpread({}, currentState, data));
    } // We're not setting an object, we are setting a primitive so
    // simply overwrite the existing data


    return _this.overwrite(data);
  };

  this.overwrite = function (data) {
    if (typeof data === "function") {
      // Call the function to get the update data
      var currentState = (0, _Store.getState)(name);
      var newData = data(currentState);
      return _this.overwrite(newData);
    }

    log.info("[".concat(_this.name(), "]"), "Overwriting state to:", JSON.stringify(data));
    (0, _Store.setState)(name, data, _objectSpread({}, options, {
      stateInstance: _this
    }));
  };

  this.get = function (path, defaultVal) {
    var val = _this.value();

    return (0, _irrelonPath.get)(val, path, defaultVal);
  };

  this.value = function () {
    return (0, _Store.getState)(name);
  };

  this.context = function () {
    return _this._Context;
  };

  this.Provider = function (props) {
    return _react["default"].createElement(_Provider["default"], {
      state: _this
    }, props.children);
  };
};

Emitter(State);
var _default = State;
exports["default"] = _default;