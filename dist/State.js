"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _Store = require("./Store");

var _Provider = _interopRequireDefault(require("./Provider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Emitter = require("irrelon-emitter");

var State = function State(name, initialData, options) {
  var _this = this;

  _classCallCheck(this, State);

  var Log = require("irrelon-log");

  var log = new Log("State :: ".concat(name));
  this._Context = _react["default"].createContext(initialData);
  this._name = name;
  (0, _Store.setState)(name, initialData, options);

  this.name = function () {
    return _this._name;
  };

  this.update = function (data) {
    if (typeof data === "function") {
      // Call the function to get the update data
      log.info("Asking function for new state data value...");
      var newData = data((0, _Store.getState)(name));
      log.info("Asking store to update state value");
      (0, _Store.setState)(name, newData, options);

      _this.emit("change");

      return;
    }

    log.info("Asking store to update state value");
    (0, _Store.setState)(name, data, options);

    _this.emit("change");
  };

  this.value = function () {
    //log.info("Asking store for existing state value");
    return (0, _Store.getState)(name);
  };

  this.context = function () {
    return _this._Context;
  };

  this.Provider = function (props) {
    log.info("Rendering state provider");
    return _react["default"].createElement(_Provider["default"], {
      state: _this
    }, props.children);
  };
};

Emitter(State);
var _default = State;
exports["default"] = _default;