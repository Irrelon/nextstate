"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _irrelonEmitter = _interopRequireDefault(require("irrelon-emitter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('irrelon-path'),
    pathGet = _require.get;
/**
 * The StateController class manages states including their data
 * and mutations.
 */


var StateController =
/*#__PURE__*/
function () {
  function StateController(data, options) {
    _classCallCheck(this, StateController);

    this._data = this.decouple(data);

    if (!options) {
      return;
    }

    this.name(options.name);
    this.debug(options.debug);
  }

  _createClass(StateController, [{
    key: "decouple",
    value: function decouple(data) {
      return JSON.parse(JSON.stringify(data));
    }
  }, {
    key: "name",
    value: function name(val) {
      if (val !== undefined) {
        this._name = val;
        return this;
      }

      return this._name;
    }
  }, {
    key: "debugLog",
    value: function debugLog(msg) {
      if (this._debug) {
        console.log("NextState StateController :: ".concat(this.name() || 'Unnamed', " :: ").concat(msg));
      }
    }
  }, {
    key: "debug",
    value: function debug(val) {
      if (val !== undefined) {
        this._debug = val;
        return this;
      }

      return this._debug;
    }
  }, {
    key: "update",
    value: function update(data) {
      this.debugLog("(update) Asking to update state with ".concat(JSON.stringify(data)));

      if (Object.is(this._data, data)) {
        return;
      }

      this.debugLog("(update) Updating state with ".concat(JSON.stringify(data)));

      if (_typeof(this._data) === 'object' && _typeof(data) === 'object') {
        // Mixin existing data
        this.debugLog("(update) Spreading ".concat(JSON.stringify(data)));
        this._data = _objectSpread({}, this._data, this.decouple(data));
      } else {
        this.debugLog("(update) Assigning ".concat(JSON.stringify(data)));
        this._data = data;
      }

      this.debugLog("(update) Update completed, new data ".concat(JSON.stringify(this._data)));
      this.debugLog("(update) Emitting state change...");
      this.emit('change');
    }
  }, {
    key: "overwrite",
    value: function overwrite(data) {
      if (Object.is(this._data, data)) {
        return;
      }

      this._data = _objectSpread({}, this.decouple(data));
      this.emit('change');
    }
  }, {
    key: "value",
    value: function value() {
      return this._data;
    }
  }, {
    key: "find",
    value: function find(query, options) {
      return this._data;
    }
  }, {
    key: "get",
    value: function get(path) {
      return pathGet(this._data, path);
    }
  }]);

  return StateController;
}(); // Give StateController's prototype the event emitter methods
// and functionality


(0, _irrelonEmitter.default)(StateController);
var _default = StateController;
exports.default = _default;