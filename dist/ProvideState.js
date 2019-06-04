"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _Store = require("./Store");

var _irrelonLog = require("irrelon-log");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var log = (0, _irrelonLog.init)("ProvideState");

var ProvideState =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(ProvideState, _React$PureComponent);

  function ProvideState(props) {
    var _this;

    _classCallCheck(this, ProvideState);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ProvideState).call(this, props));

    if (!props.stateStore) {
      throw new Error("No stateStore prop passed to ProvideState, cannot continue!");
    }

    _this.state = {
      stateStore: _objectSpread({}, props.stateStore)
    };
    log.debug("Constructing with state:", JSON.stringify(_this.state));

    _this.handleChange = function () {
      _this.setState({
        stateStore: _objectSpread({}, props.stateStore)
      });
    };

    if (process && process.browser) {
      props.stateStore.events.on("change", _this.handleChange);
    }

    return _this;
  }

  _createClass(ProvideState, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.props.stateStore.events.off("change", this.handleChange);
    }
  }, {
    key: "render",
    value: function render() {
      log.debug('Rendering with store data:', JSON.stringify(this.state.stateStore.exportData()));
      var Context = (0, _Store.getContext)();
      return _react["default"].createElement(Context.Provider, {
        value: this.state.stateStore
      }, this.props.children);
    }
  }]);

  return ProvideState;
}(_react["default"].PureComponent);

var _default = ProvideState;
exports["default"] = _default;