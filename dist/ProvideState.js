"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _Store = require("./Store");

var _irrelonLog = require("irrelon-log");

var log = (0, _irrelonLog.init)("ProvideState");

var ProvideState =
/*#__PURE__*/
function (_React$PureComponent) {
  (0, _inherits2["default"])(ProvideState, _React$PureComponent);

  function ProvideState(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, ProvideState);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ProvideState).call(this, props));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "generateNewStoreContainer", function (stateStore) {
      return {
        stateStore: stateStore
      };
    });

    if (!props.stateStore) {
      throw new Error("No stateStore prop passed to ProvideState, cannot continue!");
    }

    _this.state = {
      storeContainer: _this.generateNewStoreContainer(props.stateStore)
    }; //log.debug("Constructing with state:", JSON.stringify(this.state.storeContainer));

    _this.handleChange = function () {
      _this.setState({
        storeContainer: _this.generateNewStoreContainer(props.stateStore)
      });
    };

    if (process && process.browser) {
      props.stateStore.events.on("change", _this.handleChange);
    }

    return _this;
  }

  (0, _createClass2["default"])(ProvideState, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.props.stateStore.events.off("change", this.handleChange);
    }
  }, {
    key: "render",
    value: function render() {
      //log.debug('Rendering with store data:', JSON.stringify(this.state.storeContainer.stateStore.exportData()));
      var Context = (0, _Store.getContext)();
      return _react["default"].createElement(Context.Provider, {
        value: this.state.storeContainer
      }, this.props.children);
    }
  }]);
  return ProvideState;
}(_react["default"].PureComponent);

var _default = ProvideState;
exports["default"] = _default;