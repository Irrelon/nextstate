"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.events = exports.exportStore = exports.getState = exports.setState = exports.getStore = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

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

var Context = _react["default"].createContext(null);

var Log = require("irrelon-log");

var log = new Log("Store");

var Emitter = require("irrelon-emitter");

var events = new Emitter();
exports.events = events;
var storeObj;

var getStore = function getStore(initialData) {
  if (!process || !process.browser) {
    // Init a new store object whenever we are on the server
    log.info("Init on server");
    storeObj = _objectSpread({}, initialData);
    events.emit("store");
    return;
  }

  if (storeObj) {
    return;
  }

  log.info("Init on client");
  storeObj = _objectSpread({}, initialData);
  events.emit("store");
};

exports.getStore = getStore;

var getState = function getState(name) {
  if (!storeObj) {
    log.info("Ignoring store get state for \"".concat(name, "\" as we have no store object!"));
    return;
  }

  log.info("Getting state for \"".concat(name, "\" as ").concat(JSON.stringify(storeObj[name])));
  return storeObj[name];
};

exports.getState = getState;

var setState = function setState(name, val) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (storeObj) {
    log.info("Setting state for \"".concat(name, "\" to ").concat(JSON.stringify(val)));
    storeObj[name] = val;
    events.emit("change");
    return;
  } // Hook when we get a store


  if (!process || !process.browser) {
    // On server, we listen for store init every time it is emitted
    log.info("Waiting for store to become available on server...");
    events.on("store", function () {
      log.info("Store became available on server");
      setState(name, val, options);
    });
    return;
  } // On client we only want to hook the store event once
  // and only listen to the event if the dev told us to init
  // the value on the client instead of using the data sent
  // from the server - usually you don't want to specify
  // initOnClient as true since we want the server to tell us
  // what the initial value should be


  if (options.initOnClient === true) {
    log.info("Waiting for store to become available on client...");
    events.once("store", function () {
      log.info("Store became available on client");
      setState(name, val, options);
    });
  }
};

exports.setState = setState;

var exportStore = function exportStore() {
  return JSON.parse(JSON.stringify(storeObj));
};

exports.exportStore = exportStore;

var Provider =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(Provider, _React$PureComponent);

  function Provider(props) {
    var _this;

    _classCallCheck(this, Provider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Provider).call(this, props));
    _this.state = exportStore();

    _this.handleChange = function () {
      _this.setState(_objectSpread({}, exportStore()));
    };

    events.on("change", _this.handleChange);
    return _this;
  }

  _createClass(Provider, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      events.off("change", this.handleChange);
    }
  }, {
    key: "render",
    value: function render() {
      return _react["default"].createElement(Context.Provider, {
        value: this.state
      }, this.props.children);
    }
  }]);

  return Provider;
}(_react["default"].PureComponent);

var _default = {
  getStore: getStore,
  setState: setState,
  getState: getState,
  exportStore: exportStore,
  events: events
};
exports["default"] = _default;