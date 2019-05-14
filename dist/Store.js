"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.events = exports.ProvideState = exports.getContext = exports.exportStore = exports.getState = exports.setState = exports.getStore = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _irrelonLog = _interopRequireDefault(require("irrelon-log"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var log = new _irrelonLog["default"]("Store");
var Context;

var Emitter = require("irrelon-emitter");

var events = new Emitter();
exports.events = events;
var storeObj;

var newStore = function newStore(initialData) {
  log.info("Getting new store with initialData:", JSON.stringify(initialData));
  Context = _react["default"].createContext(initialData);
  storeObj = _objectSpread({}, initialData);
  events.emit("store");
};

var getContext = function getContext() {
  return Context;
};

exports.getContext = getContext;

var getStore = function getStore(initialData) {
  if (!process || !process.browser) {
    // Init a new store object whenever we are on the server
    newStore(initialData);
    return;
  }

  if (storeObj) {
    return;
  }

  newStore(initialData);
};

exports.getStore = getStore;

var getState = function getState(name) {
  if (!storeObj) {
    return;
  }

  return storeObj[name];
};

exports.getState = getState;

var setState = function setState(name, val) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (storeObj) {
    log.info("Setting state:", name, JSON.stringify(val));
    storeObj[name] = val;
    events.emit("change");
    return;
  }

  log.info("Waiting to set state:", name, JSON.stringify(val)); // Hook when we get a store

  if (!process || !process.browser) {
    // On server, we listen for store init every time it is emitted
    events.once("store", function () {
      log.info("Store now available, setting state:", name, JSON.stringify(val));
      setState(name, val, options);
    }); //setState(name, val, options);

    return;
  } // On client we only want to hook the store event once
  // and only listen to the event if the dev told us to init
  // the value on the client instead of using the data sent
  // from the server - usually you don't want to specify
  // initOnClient as true since we want the server to tell us
  // what the initial value should be


  if (options.initOnClient === true) {
    events.once("store", function () {
      log.info("Store now available, setting state:", name, JSON.stringify(val));
      setState(name, val, options);
    });
  }
};

exports.setState = setState;

var exportStore = function exportStore() {
  return JSON.parse(JSON.stringify(storeObj));
};

exports.exportStore = exportStore;

var ProvideState =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(ProvideState, _React$PureComponent);

  function ProvideState(props) {
    var _this;

    _classCallCheck(this, ProvideState);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ProvideState).call(this, props));
    _this.state = exportStore();
    log.info("Constructing ProvideState with state:", JSON.stringify(_this.state));

    _this.handleChange = function () {
      _this.setState(_objectSpread({}, exportStore()));
    };

    if (process && process.browser) {
      events.on("change", _this.handleChange);
    }

    return _this;
  }

  _createClass(ProvideState, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      events.off("change", this.handleChange);
    }
  }, {
    key: "render",
    value: function render() {
      log.info('Rendering ProvideState with store data:', JSON.stringify(this.state));
      return _react["default"].createElement(Context.Provider, {
        value: this.state
      }, this.props.children);
    }
  }]);

  return ProvideState;
}(_react["default"].PureComponent);

exports.ProvideState = ProvideState;
var _default = {
  getStore: getStore,
  setState: setState,
  getState: getState,
  exportStore: exportStore,
  getContext: getContext,
  ProvideState: ProvideState,
  events: events
};
exports["default"] = _default;